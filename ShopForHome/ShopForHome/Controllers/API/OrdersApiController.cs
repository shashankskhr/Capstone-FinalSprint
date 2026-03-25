using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.DTOs;
using ShopForHome.Models;

namespace ShopForHome.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersApiController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/OrdersApi
        [HttpPost]
        public async Task<IActionResult> PlaceOrder(
            [FromBody] PlaceOrderDto dto)
        {
            try
            {
                var cartItems = await _context.Carts
                    .Include(c => c.Product)
                    .Where(c => c.UserId == dto.UserId)
                    .ToListAsync();

                if (!cartItems.Any())
                    return BadRequest(
                        new { message = "Cart is empty." });

                decimal total = cartItems.Sum(c =>
                    c.Product!.Price * c.Quantity);
                decimal discount = 0;

                if (dto.CouponId.HasValue)
                {
                    var userCoupon = await _context.UserCoupons
                        .Include(uc => uc.DiscountCoupon)
                        .FirstOrDefaultAsync(uc =>
                            uc.UserId == dto.UserId &&
                            uc.CouponId == dto.CouponId &&
                            !uc.IsUsed);

                    if (userCoupon != null)
                    {
                        discount = total * (
                            userCoupon.DiscountCoupon!
                                .DiscountPercent / 100);
                        userCoupon.IsUsed = true;
                    }
                }

                var order = new Order
                {
                    UserId = dto.UserId,
                    TotalAmount = total - discount,
                    DiscountApplied = discount,
                    Status = "Placed",
                    OrderDate = DateTime.Now
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var item in cartItems)
                {
                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.OrderId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Product!.Price
                    });

                    // reduce stock
                    item.Product.Stock -= item.Quantity;
                    if (item.Product.Stock < 0)
                        item.Product.Stock = 0;
                }

                // clear cart
                _context.Carts.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Order placed successfully.",
                    orderId = order.OrderId,
                    totalAmount = order.TotalAmount,
                    discountApplied = order.DiscountApplied
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // GET: api/OrdersApi/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(
            int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .Where(o => o.UserId == userId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        o.Status,
                        o.TotalAmount,
                        o.DiscountApplied,
                        OrderItems = o.OrderItems
                            .Select(oi => new
                            {
                                oi.OrderItemId,
                                oi.Quantity,
                                oi.UnitPrice,
                                Product = oi.Product == null
                                    ? null : new
                                    {
                                        oi.Product.ProductId,
                                        oi.Product.ProductName,
                                        oi.Product.ImageUrl,
                                        oi.Product.Price
                                    }
                            })
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }
    }
}