namespace ShopForHome.DTOs
{
    public class ProductDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public decimal Rating { get; set; }
        public string? ImageUrl { get; set; }
        public int CategoryId { get; set; }
    }
}