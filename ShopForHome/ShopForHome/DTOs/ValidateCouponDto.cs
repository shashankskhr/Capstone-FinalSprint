namespace ShopForHome.DTOs
{
    public class ValidateCouponDto
    {
        public int UserId { get; set; }
        public string CouponCode { get; set; }
            = string.Empty;
    }
}