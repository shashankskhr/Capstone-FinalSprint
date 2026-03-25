using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Data;
using ShopForHome.DTOs;
using ShopForHome.Models;
using System.Globalization;

namespace ShopForHome.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsApiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsApiController(
            AppDbContext context,
            IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/ProductsApi
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] decimal? minRating)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Category)
                    .AsQueryable();

                if (categoryId.HasValue)
                    query = query.Where(p =>
                        p.CategoryId == categoryId);

                if (minPrice.HasValue)
                    query = query.Where(p =>
                        p.Price >= minPrice);

                if (maxPrice.HasValue)
                    query = query.Where(p =>
                        p.Price <= maxPrice);

                if (minRating.HasValue)
                    query = query.Where(p =>
                        p.Rating >= minRating);

                var products = await query
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
                        p.CreatedAt,
                        Category = p.Category == null
                            ? null : new
                            {
                                p.Category.CategoryId,
                                p.Category.CategoryName
                            }
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // GET: api/ProductsApi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.ProductId == id)
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
                        p.CreatedAt,
                        Category = p.Category == null
                            ? null : new
                            {
                                p.Category.CategoryId,
                                p.Category.CategoryName
                            }
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                    return NotFound(new
                    {
                        message = "Product not found."
                    });

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // POST: api/ProductsApi
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] ProductDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new
                    {
                        message = "Invalid data."
                    });

                var product = new Product
                {
                    ProductName = dto.ProductName,
                    Description = dto.Description,
                    Price = dto.Price,
                    Stock = dto.Stock,
                    Rating = dto.Rating,
                    ImageUrl = dto.ImageUrl,
                    CategoryId = dto.CategoryId,
                    CreatedAt = DateTime.Now
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var created = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.ProductId ==
                        product.ProductId)
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
                        Category = p.Category == null
                            ? null : new
                            {
                                p.Category.CategoryId,
                                p.Category.CategoryName
                            }
                    })
                    .FirstOrDefaultAsync();

                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // PUT: api/ProductsApi/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] ProductDto dto)
        {
            try
            {
                var product = await _context.Products
                    .FindAsync(id);

                if (product == null)
                    return NotFound(new
                    {
                        message = "Product not found."
                    });

                product.ProductName = dto.ProductName;
                product.Description = dto.Description;
                product.Price = dto.Price;
                product.Stock = dto.Stock;
                product.Rating = dto.Rating;
                product.ImageUrl = dto.ImageUrl;
                product.CategoryId = dto.CategoryId;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Product updated.",
                    productId = product.ProductId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // DELETE: api/ProductsApi/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var product = await _context.Products
                    .FindAsync(id);

                if (product == null)
                    return NotFound(new
                    {
                        message = "Product not found."
                    });

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Product deleted."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // POST: api/ProductsApi/upload-image
        [HttpPost("upload-image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(
            IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new
                    {
                        message = "No file uploaded."
                    });

                var allowedExtensions = new[]
                {
                    ".jpg", ".jpeg",
                    ".png", ".gif", ".webp"
                };

                var extension = Path.GetExtension(
                    file.FileName).ToLower();

                if (!allowedExtensions
                    .Contains(extension))
                    return BadRequest(new
                    {
                        message = "Invalid file type."
                    });

                var uploadsFolder = Path.Combine(
                    _env.WebRootPath,
                    "assets", "images");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(
                        uploadsFolder);

                var fileName = Guid.NewGuid()
                    .ToString() + extension;

                var filePath = Path.Combine(
                    uploadsFolder, fileName);

                using (var stream = new FileStream(
                    filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl =
                    $"{Request.Scheme}://" +
                    $"{Request.Host}" +
                    $"/assets/images/{fileName}";

                return Ok(new
                {
                    imageUrl,
                    message = "Image uploaded."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // POST: api/ProductsApi/upload-csv
        [HttpPost("upload-csv")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadCsv(
            IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new
                    {
                        message = "No file uploaded."
                    });

                var products = new List<Product>();

                using var reader = new StreamReader(
                    file.OpenReadStream());
                using var csv = new CsvReader(
                    reader,
                    CultureInfo.InvariantCulture);

                var records = csv
                    .GetRecords<ProductDto>()
                    .ToList();

                foreach (var dto in records)
                {
                    products.Add(new Product
                    {
                        ProductName = dto.ProductName,
                        Description = dto.Description,
                        Price = dto.Price,
                        Stock = dto.Stock,
                        Rating = dto.Rating,
                        ImageUrl = dto.ImageUrl,
                        CategoryId = dto.CategoryId,
                        CreatedAt = DateTime.Now
                    });
                }

                _context.Products.AddRange(products);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"{products.Count}" +
                        " products uploaded."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // GET: api/ProductsApi/low-stock
        [HttpGet("low-stock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> LowStock()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.Stock < 10)
                    .Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.Stock,
                        p.Rating,
                        p.ImageUrl,
                        p.CategoryId,
                        Category = p.Category == null
                            ? null : new
                            {
                                p.Category.CategoryId,
                                p.Category.CategoryName
                            }
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // GET: api/ProductsApi/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context
                    .Categories
                    .Select(c => new
                    {
                        c.CategoryId,
                        c.CategoryName
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }
    }
}