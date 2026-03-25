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
    public class CartApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CartApi/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.Product)
                        .ThenInclude(p => p!.Category)
                    .Where(c => c.UserId == userId)
                    .Select(c => new
                    {
                        c.CartId,
                        c.UserId,
                        c.ProductId,
                        c.Quantity,
                        c.AddedAt,
                        Product = c.Product == null
                            ? null : new
                            {
                                c.Product.ProductId,
                                c.Product.ProductName,
                                c.Product.Price,
                                c.Product.Stock,
                                c.Product.Rating,
                                c.Product.ImageUrl,
                                Category = c.Product.Category
                                == null ? null : new
                                {
                                    c.Product.Category.CategoryId,
                                    c.Product.Category.CategoryName
                                }
                            }
                    })
                    .ToListAsync();

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // POST: api/CartApi
        [HttpPost]
        public async Task<IActionResult> AddToCart(
            [FromBody] CartItemDto dto)
        {
            try
            {
                var existing = await _context.Carts
                    .FirstOrDefaultAsync(c =>
                        c.UserId == dto.UserId &&
                        c.ProductId == dto.ProductId);

                if (existing != null)
                {
                    existing.Quantity += dto.Quantity;
                }
                else
                {
                    _context.Carts.Add(new Cart
                    {
                        UserId = dto.UserId,
                        ProductId = dto.ProductId,
                        Quantity = dto.Quantity
                    });
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Added to cart." });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // PUT: api/CartApi/{cartId}
        [HttpPut("{cartId}")]
        public async Task<IActionResult> UpdateQuantity(
            int cartId,
            [FromBody] UpdateQuantityDto dto)
        {
            try
            {
                var item = await _context.Carts
                    .FindAsync(cartId);
                if (item == null)
                    return NotFound(
                        new { message = "Cart item not found." });

                if (dto.Quantity <= 0)
                {
                    _context.Carts.Remove(item);
                }
                else
                {
                    item.Quantity = dto.Quantity;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Cart updated." });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // DELETE: api/CartApi/{cartId}
        [HttpDelete("{cartId}")]
        public async Task<IActionResult> RemoveFromCart(
            int cartId)
        {
            try
            {
                var item = await _context.Carts
                    .FindAsync(cartId);
                if (item == null)
                    return NotFound(
                        new { message = "Cart item not found." });

                _context.Carts.Remove(item);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Removed from cart."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }
    }
}