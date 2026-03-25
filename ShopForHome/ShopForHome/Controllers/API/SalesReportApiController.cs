using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.DTOs;

namespace ShopForHome.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SalesReportApiController
        : ControllerBase
    {
        private readonly AppDbContext _context;

        public SalesReportApiController(
            AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult>
            GetReport(
            [FromBody] SalesReportDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new
                    {
                        message =
                            "Invalid data."
                    });

                // ✅ Fix date range
                // set toDate to end of day
                DateTime fromDate =
                    dto.FromDate.Date;
                DateTime toDate =
                    dto.ToDate.Date
                    .AddDays(1)
                    .AddSeconds(-1);

                Console.WriteLine(
                    $"From: {fromDate}");
                Console.WriteLine(
                    $"To: {toDate}");

                var orders = await _context
                    .Orders
                    .Include(o => o.OrderItems)
                        .ThenInclude(
                            oi => oi.Product)
                    .Include(o => o.User)
                    .Where(o =>
                        o.OrderDate >= fromDate
                        && o.OrderDate <= toDate)
                    .ToListAsync();

                Console.WriteLine(
                    $"Orders found: " +
                    $"{orders.Count}");

                decimal totalRevenue =
                    orders.Sum(
                        o => o.TotalAmount);
                decimal totalDiscount =
                    orders.Sum(
                        o => o.DiscountApplied);

                var orderList =
                    new List<object>();

                foreach (var o in orders)
                {
                    var items =
                        new List<object>();

                    foreach (var oi
                        in o.OrderItems)
                    {
                        items.Add(new
                        {
                            productName =
                                oi.Product
                                == null
                                ? "Unknown"
                                : oi.Product
                                .ProductName,
                            quantity =
                                oi.Quantity,
                            unitPrice =
                                oi.UnitPrice
                        });
                    }

                    orderList.Add(new
                    {
                        orderId = o.OrderId,
                        orderDate = o.OrderDate,
                        status = o.Status,
                        totalAmount =
                            o.TotalAmount,
                        discountApplied =
                            o.DiscountApplied,
                        customerName =
                            o.User == null
                            ? "Unknown"
                            : o.User.FullName,
                        items = items
                    });
                }

                var report = new
                {
                    totalOrders = orders.Count,
                    totalRevenue = totalRevenue,
                    totalDiscount =
                        totalDiscount,
                    fromDate = fromDate,
                    toDate = toDate,
                    orders = orderList
                };

                return Ok(report);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new
                    {
                        message = ex.Message
                    });
            }
        }
    }
}