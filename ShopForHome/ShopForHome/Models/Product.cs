using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations
    .Schema;

namespace ShopForHome.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required]
        public string ProductName { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        public int Stock { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; }

        public string? ImageUrl { get; set; }

        public int CategoryId { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
    }
}