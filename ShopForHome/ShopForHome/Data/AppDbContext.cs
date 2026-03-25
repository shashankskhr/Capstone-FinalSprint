using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;

using ShopForHome.Models;

namespace ShopForHome.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
            DbContextOptions<AppDbContext>
            options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories
        { get; set; }

        public DbSet<Product> Products
        { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<Wishlist> Wishlists
        { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems
        { get; set; }

        public DbSet<DiscountCoupon>
            DiscountCoupons
        { get; set; }

        public DbSet<UserCoupon> UserCoupons
        { get; set; }

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cart → User
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(
                    DeleteBehavior.Cascade);

            // Cart → Product
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Product)
                .WithMany()
                .HasForeignKey(c => c.ProductId)
                .OnDelete(
                    DeleteBehavior.Restrict);

            // Wishlist → User
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Wishlists)
                .HasForeignKey(w => w.UserId)
                .OnDelete(
                    DeleteBehavior.Cascade);

            // Wishlist → Product
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Product)
                .WithMany()
                .HasForeignKey(w => w.ProductId)
                .OnDelete(
                    DeleteBehavior.Restrict);

            // Order → User
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(
                    DeleteBehavior.Cascade);

            // OrderItem → Order
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(
                    DeleteBehavior.Cascade);

            // OrderItem → Product
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(
                    oi => oi.ProductId)
                .OnDelete(
                    DeleteBehavior.Restrict);

            // Product → Category
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(
                    DeleteBehavior.Restrict);

            // UserCoupon → User
            modelBuilder.Entity<UserCoupon>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCoupons)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(
                    DeleteBehavior.Cascade);

            // UserCoupon → DiscountCoupon
            modelBuilder.Entity<UserCoupon>()
                .HasOne(uc => uc.DiscountCoupon)
                .WithMany()
                .HasForeignKey(
                    uc => uc.CouponId)
                .OnDelete(
                    DeleteBehavior.Cascade);
        }
    }
}
