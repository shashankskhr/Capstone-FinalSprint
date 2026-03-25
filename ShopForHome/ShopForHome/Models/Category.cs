using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        public string CategoryName { get; set; }
            = string.Empty;

        public ICollection<Product> Products
        { get; set; }
            = new List<Product>();
    }
}