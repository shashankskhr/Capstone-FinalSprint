using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;

namespace ShopForHome.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchApiController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    var all = await _context.Products
                        .Include(p => p.Category)
                        .Select(p => new
                        {
                            p.ProductId,
                            p.ProductName,
                            p.Description,
                            p.Price,
                            p.Stock,
                            p.Rating,
                            p.ImageUrl,
                            p.CategoryId,
                            Category = p.Category == null ? null : new
                            {
                                p.Category.CategoryId,
                                p.Category.CategoryName
                            }
                        })
                        .ToListAsync();

                    return Ok(all);
                }

                var results = await _context.Products
                    .Include(p => p.Category)
                    .Where(p =>
                        p.ProductName.Contains(q) ||
                        (p.Description != null &&
                        p.Description.Contains(q)) ||
                        p.Category!.CategoryName.Contains(q))
                    .Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Description,
                        p.Price,
                        p.Stock,
                        p.Rating,
                        p.ImageUrl,
                        p.CategoryId,
                        Category = p.Category == null ? null : new
                        {
                            p.Category.CategoryId,
                            p.Category.CategoryName
                        }
                    })
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}