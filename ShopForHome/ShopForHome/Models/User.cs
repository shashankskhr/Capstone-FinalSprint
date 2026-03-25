using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; }
            = string.Empty;

        [Required]
        public string Email { get; set; }
            = string.Empty;

        [Required]
        public string PasswordHash { get; set; }
            = string.Empty;

        public string Role { get; set; }
            = "User";

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        public ICollection<Cart> Carts
        { get; set; }
            = new List<Cart>();

        public ICollection<Wishlist> Wishlists
        { get; set; }
            = new List<Wishlist>();

        public ICollection<Order> Orders
        { get; set; }
            = new List<Order>();

        public ICollection<UserCoupon>
            UserCoupons
        { get; set; }
            = new List<UserCoupon>();
    }
}