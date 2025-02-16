using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;
using System.Text.Json.Serialization;
using System;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Dodaj CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin",
        builder => builder.WithOrigins("http://localhost:3000") // Adres Twojej aplikacji frontendowej
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Dodaj DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dodaj pozostałe usługi (np. kontrolery)
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Dodaj Swaggera
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Rejestracja RabbitMqService – dependencies zostaną wstrzyknięte automatycznie
builder.Services.AddSingleton<RabbitMqService>();

var app = builder.Build();

// Konfiguracja middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Włącz CORS
app.UseCors("AllowMyOrigin");

app.UseAuthorization();
app.MapControllers();
app.Run();