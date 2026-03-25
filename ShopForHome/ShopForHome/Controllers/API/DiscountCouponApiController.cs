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
    public class DiscountCouponApiController
        : ControllerBase
    {
        private readonly AppDbContext _context;

        public DiscountCouponApiController(
            AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var list = await _context
                    .DiscountCoupons
                    .ToListAsync();

                var result = new List<object>();

                for (int i = 0;
                    i < list.Count; i++)
                {
                    DiscountCoupon c = list[i];
                    result.Add(new
                    {
                        couponId = c.CouponId,
                        couponCode = c.CouponCode,
                        discountPercent =
                            c.DiscountPercent,
                        expiryDate = c.ExpiryDate,
                        createdAt = c.CreatedAt
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] CreateCouponDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new
                    {
                        message = "Invalid data."
                    });

                if (string.IsNullOrEmpty(
                    dto.CouponCode))
                    return BadRequest(new
                    {
                        message =
                            "Coupon code required."
                    });

                if (dto.DiscountPercent <= 0)
                    return BadRequest(new
                    {
                        message =
                            "Discount must be > 0."
                    });

                var coupon = new DiscountCoupon();
                coupon.CouponCode =
                    dto.CouponCode
                    .Trim()
                    .ToUpper();
                coupon.DiscountPercent =
                    dto.DiscountPercent;
                coupon.ExpiryDate =
                    dto.ExpiryDate;
                coupon.CreatedAt = DateTime.Now;

                await _context.DiscountCoupons
                    .AddAsync(coupon);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    couponId = coupon.CouponId,
                    couponCode = coupon.CouponCode,
                    discountPercent =
                        coupon.DiscountPercent,
                    expiryDate = coupon.ExpiryDate,
                    message =
                        "Coupon created successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        [HttpPost("assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            AssignToUsers(
            [FromBody] AssignCouponDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new
                    {
                        message = "Invalid data."
                    });

                if (dto.CouponId == null
                    || dto.CouponId == 0)
                    return BadRequest(new
                    {
                        message =
                            "Select a coupon."
                    });

                if (dto.UserIds == null
                    || dto.UserIds.Count == 0)
                    return BadRequest(new
                    {
                        message =
                            "Select at least " +
                            "one user."
                    });

                int couponId = dto.CouponId.Value;

                bool couponExists =
                    await _context
                    .DiscountCoupons
                    .AnyAsync(c =>
                        c.CouponId == couponId);

                if (!couponExists)
                    return NotFound(new
                    {
                        message =
                            "Coupon not found."
                    });

                int count = 0;

                for (int i = 0;
                    i < dto.UserIds.Count; i++)
                {
                    int userId = dto.UserIds[i];

                    bool userExists =
                        await _context.Users
                        .AnyAsync(u =>
                            u.UserId == userId);

                    if (!userExists)
                        continue;

                    bool assigned =
                        await _context
                        .UserCoupons
                        .AnyAsync(uc =>
                            uc.UserId == userId
                            && uc.CouponId ==
                            couponId);

                    if (!assigned)
                    {
                        UserCoupon uc =
                            new UserCoupon();
                        uc.UserId = userId;
                        uc.CouponId = couponId;
                        uc.IsUsed = false;

                        await _context
                            .UserCoupons
                            .AddAsync(uc);
                        count++;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message =
                        "Coupon assigned to "
                        + count.ToString()
                        + " user(s) successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        [HttpGet("my-coupons/{userId}")]
        [Authorize]
        public async Task<IActionResult>
            MyCoupons(int userId)
        {
            try
            {
                var list = await _context
                    .UserCoupons
                    .Include(uc =>
                        uc.DiscountCoupon)
                    .Where(uc =>
                        uc.UserId == userId
                        && uc.IsUsed == false)
                    .ToListAsync();

                var result = new List<object>();

                for (int i = 0;
                    i < list.Count; i++)
                {
                    UserCoupon uc = list[i];

                    if (uc.DiscountCoupon == null)
                        continue;

                    result.Add(new
                    {
                        userCouponId =
                            uc.UserCouponId,
                        isUsed = uc.IsUsed,
                        couponId =
                            uc.DiscountCoupon
                            .CouponId,
                        couponCode =
                            uc.DiscountCoupon
                            .CouponCode,
                        discountPercent =
                            uc.DiscountCoupon
                            .DiscountPercent,
                        expiryDate =
                            uc.DiscountCoupon
                            .ExpiryDate
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // ✅ Step 3 — Fixed Validate
        [HttpPost("validate")]
        [Authorize]
        public async Task<IActionResult> Validate(
            [FromBody] ValidateCouponDto dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest(new
                    {
                        message = "Invalid data."
                    });

                if (string.IsNullOrEmpty(
                    dto.CouponCode))
                    return BadRequest(new
                    {
                        message =
                            "Coupon code required."
                    });

                var list = await _context
                    .UserCoupons
                    .Include(uc =>
                        uc.DiscountCoupon)
                    .Where(uc =>
                        uc.UserId == dto.UserId
                        && uc.IsUsed == false)
                    .ToListAsync();

                UserCoupon? found = null;

                for (int i = 0;
                    i < list.Count; i++)
                {
                    UserCoupon uc = list[i];

                    if (uc.DiscountCoupon == null)
                        continue;

                    string code =
                        uc.DiscountCoupon
                        .CouponCode
                        .ToLower()
                        .Trim();

                    string input =
                        dto.CouponCode
                        .ToLower()
                        .Trim();

                    if (code == input)
                    {
                        found = uc;
                        break;
                    }
                }

                if (found == null)
                    return BadRequest(new
                    {
                        message =
                            "Invalid or " +
                            "expired coupon."
                    });

                // ✅ Fixed DateTime check
                if (found.DiscountCoupon!
                    .ExpiryDate != null)
                {
                    DateTime expiry =
                        found.DiscountCoupon
                        .ExpiryDate
                        .GetValueOrDefault();

                    DateTime now = DateTime.Now;

                    int compare =
                        DateTime.Compare(
                            expiry, now);

                    if (compare < 0)
                    {
                        return BadRequest(new
                        {
                            message =
                                "Coupon has expired."
                        });
                    }
                }

                decimal discount =
                    found.DiscountCoupon
                    .DiscountPercent;

                int couponId =
                    found.DiscountCoupon
                    .CouponId;

                string couponCode =
                    found.DiscountCoupon
                    .CouponCode;

                return Ok(new
                {
                    discountPercent = discount,
                    couponId = couponId,
                    couponCode = couponCode
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = ex.Message });
            }
        }

        // ✅ Step 4 — Fixed Delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            Delete(int id)
        {
            try
            {
                var coupon = await _context
                    .DiscountCoupons
                    .FindAsync(id);

                if (coupon == null)
                    return NotFound(new
                    {
                        message =
                            "Coupon not found."
                    });

                var userCoupons = await _context
                    .UserCoupons
                    .Where(uc =>
                        uc.CouponId == id)
                    .ToListAsync();

                if (userCoupons.Count > 0)
                {
                    _context.UserCoupons
                        .RemoveRange(userCoupons);
                }

                _context.DiscountCoupons
                    .Remove(coupon);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Coupon deleted."
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