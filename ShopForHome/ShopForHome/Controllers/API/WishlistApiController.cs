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
    public class WishlistApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistApiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/WishlistApi/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(
            int userId)
        {
            try
            {
                var wishlist = await _context.Wishlists
                    .Include(w => w.Product)
                        .ThenInclude(p => p!.Category)
                    .Where(w => w.UserId == userId)
                    .Select(w => new
                    {
                        w.WishlistId,
                        w.UserId,
                        w.ProductId,
                        w.AddedAt,
                        Product = w.Product == null
                            ? null : new
                            {
                                w.Product.ProductId,
                                w.Product.ProductName,
                                w.Product.Price,
                                w.Product.Stock,
                                w.Product.Rating,
                                w.Product.ImageUrl,
                                Category = w.Product.Category
                                == null ? null : new
                                {
                                    w.Product.Category.CategoryId,
                                    w.Product.Category.CategoryName
                                }
                            }
                    })
                    .ToListAsync();

                return Ok(wishlist);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // POST: api/WishlistApi
        [HttpPost]
        public async Task<IActionResult> AddToWishlist(
            [FromBody] WishlistDto dto)
        {
            try
            {
                var exists = await _context.Wishlists
                    .AnyAsync(w =>
                        w.UserId == dto.UserId &&
                        w.ProductId == dto.ProductId);

                if (exists)
                    return BadRequest(new
                    {
                        message = "Already in wishlist."
                    });

                _context.Wishlists.Add(new Wishlist
                {
                    UserId = dto.UserId,
                    ProductId = dto.ProductId
                });

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Added to wishlist."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // DELETE: api/WishlistApi/{wishlistId}
        [HttpDelete("{wishlistId}")]
        public async Task<IActionResult> Remove(
            int wishlistId)
        {
            try
            {
                var item = await _context.Wishlists
                    .FindAsync(wishlistId);
                if (item == null)
                    return NotFound(new
                    {
                        message = "Item not found."
                    });

                _context.Wishlists.Remove(item);
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    message = "Removed from wishlist."
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