using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShopForHome.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add MVC with JSON Circular Reference Fix
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions
            .ReferenceHandler =
            System.Text.Json.Serialization
            .ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions
            .WriteIndented = true;
    });

// ✅ Add API Controllers with JSON Fix
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions
            .ReferenceHandler =
            System.Text.Json.Serialization
            .ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions
            .WriteIndented = true;
    });

// ✅ Entity Framework
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseSqlServer(
        builder.Configuration
            .GetConnectionString("DefaultConnection")));

// ✅ JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],
                ValidAudience =
                    builder.Configuration["Jwt:Audience"],
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey))
            };
    });

// ✅ Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "ShopForHome API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer",
        new Microsoft.OpenApi.Models
            .OpenApiSecurityScheme
        {
            Description =
                "JWT Authorization. " +
                "Enter: Bearer {token}",
            Name = "Authorization",
            In = Microsoft.OpenApi.Models
                .ParameterLocation.Header,
            Type = Microsoft.OpenApi.Models
                .SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

    c.AddSecurityRequirement(
        new Microsoft.OpenApi.Models
            .OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models
                    .OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi
                        .Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models
                            .ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
});

// ✅ CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Build App
var app = builder.Build();

// ✅ Middleware Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "ShopForHome API v1");
    });
}

app.UseHttpsRedirection();

// ✅ Static Files for image uploads
app.UseStaticFiles();

app.UseRouting();

// ✅ CORS before Auth
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

// ✅ MVC Route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// ✅ API Controllers
app.MapControllers();

app.Run();