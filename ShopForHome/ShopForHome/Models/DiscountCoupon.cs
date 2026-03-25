using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations
    .Schema;

namespace ShopForHome.Models
{
    public class DiscountCoupon
    {
        [Key]
        [DatabaseGenerated(
            DatabaseGeneratedOption.Identity)]
        public int CouponId { get; set; }

        [Required]
        public string CouponCode { get; set; }
            = string.Empty;

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercent
        { get; set; }

        public DateTime? ExpiryDate
        { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;
    }
}