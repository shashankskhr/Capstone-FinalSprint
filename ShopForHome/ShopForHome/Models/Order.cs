using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations
    .Schema;

namespace ShopForHome.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        public int UserId { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal DiscountApplied
        { get; set; }

        public DateTime OrderDate { get; set; }
            = DateTime.Now;

        public string Status { get; set; }
            = "Placed";

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<OrderItem>
            OrderItems
        { get; set; }
            = new List<OrderItem>();
    }
}