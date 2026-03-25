namespace ShopForHome.DTOs
{
    public class CreateCouponDto
    {
        public string CouponCode { get; set; }
            = string.Empty;
        public decimal DiscountPercent
        { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}