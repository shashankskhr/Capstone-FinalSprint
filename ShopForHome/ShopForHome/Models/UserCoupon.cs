using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations
    .Schema;

namespace ShopForHome.Models
{
    public class UserCoupon
    {
        [Key]
        [DatabaseGenerated(
            DatabaseGeneratedOption.Identity)]
        public int UserCouponId { get; set; }

        public int UserId { get; set; }

        public int CouponId { get; set; }

        public bool IsUsed { get; set; }
            = false;

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("CouponId")]
        public DiscountCoupon? DiscountCoupon
        { get; set; }
    }
}