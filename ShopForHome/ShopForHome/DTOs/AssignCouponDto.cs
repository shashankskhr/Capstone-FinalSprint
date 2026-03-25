namespace ShopForHome.DTOs
{
    public class AssignCouponDto
    {
        public int? CouponId { get; set; }
        public List<int> UserIds { get; set; }
            = new List<int>();
    }
}