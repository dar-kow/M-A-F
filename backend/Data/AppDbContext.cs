using Microsoft.EntityFrameworkCore;
using backend.Models;
using System;
using System.Linq;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        // Definicje statyczne seed danych z datami – niezmienne
        private static readonly DateTime[] FixedContractorDates = new[]
        {
            new DateTime(2025, 2, 8, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 7, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 6, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 3, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 8, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 9, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 11, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 3, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 8, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 3, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 2, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 6, 0, 0, 0, DateTimeKind.Utc),
            new DateTime(2025, 2, 8, 0, 0, 0, DateTimeKind.Utc)
        };

        private static readonly DateTime FixedInvoiceDate = new DateTime(2025, 2, 8, 0, 0, 0, DateTimeKind.Utc);

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Correction> Corrections { get; set; }

        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Contractor> Contractors { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapowanie tabel z nazwami w małych literach
            modelBuilder.Entity<Invoice>().ToTable("invoices");
            modelBuilder.Entity<Contractor>().ToTable("contractors");
            modelBuilder.Entity<Correction>().ToTable("corrections");

            // Konfiguracja relacji między Invoice i Contractor
            modelBuilder.Entity<Invoice>()
                .HasOne<Contractor>()
                .WithMany()
                .HasForeignKey(i => i.ContractorId);

            // Relacja Invoice 1:N InvoiceItems
            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Invoice)
                .WithMany(i => i.InvoiceItems)
                .HasForeignKey(ii => ii.InvoiceId);

            // Konwersja enumów na stringi
            modelBuilder.Entity<Invoice>()
                .Property(i => i.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Invoice>()
                .Property(i => i.PaymentMethod)
                .HasConversion<string>();

            // Seed danych – wpisane ręcznie
            var contractors = new Contractor[]
            {
                new Contractor { Id = 1, Name = "Firma Alpha", FirstName = "Jan",   LastName = "Kowalski", Email = "jan.kowalski@example.com", TaxId = "1111111111", CreatedAt = FixedContractorDates[0], Street = "Ulica A", BuildingNumber = "1", ApartmentNumber = "10", City = "Warszawa", PostalCode = "00-001" },
                new Contractor { Id = 2, Name = "Firma Beta",  FirstName = "Anna",  LastName = "Nowak",     Email = "anna.nowak@example.com",    TaxId = "2222222222", CreatedAt = FixedContractorDates[1], Street = "Ulica B", BuildingNumber = "2", ApartmentNumber = "",   City = "Kraków",   PostalCode = "30-002" },
                new Contractor { Id = 3, Name = "Firma Gamma", FirstName = "Piotr", LastName = "Wiśniewski", Email = "piotr.w@example.com",       TaxId = "3333333333", CreatedAt = FixedContractorDates[2], Street = "Ulica C", BuildingNumber = "3", ApartmentNumber = "12", City = "Łódź",     PostalCode = "90-003" },
                new Contractor { Id = 4, Name = "Firma Delta", FirstName = "Ewa",   LastName = "Kowalczyk", Email = "ewa.k@example.com",         TaxId = "4444444444", CreatedAt = FixedContractorDates[3], Street = "Ulica D", BuildingNumber = "4", ApartmentNumber = "",   City = "Poznań",   PostalCode = "60-004" },
                new Contractor { Id = 5, Name = "Firma Epsilon", FirstName = "Marek", LastName = "Zieliński", Email = "marek.z@example.com",       TaxId = "5555555555", CreatedAt = FixedContractorDates[4], Street = "Ulica E", BuildingNumber = "5", ApartmentNumber = "20", City = "Wrocław",  PostalCode = "50-005" },
                new Contractor { Id = 6, Name = "Firma Zeta",   FirstName = "Kasia", LastName = "Jankowska", Email = "kasia.j@example.com",       TaxId = "6666666666", CreatedAt = FixedContractorDates[5], Street = "Ulica F", BuildingNumber = "6", ApartmentNumber = "",   City = "Gdańsk",   PostalCode = "80-006" },
                new Contractor { Id = 7, Name = "Firma Eta",    FirstName = "Adam",  LastName = "Lewandowski", Email = "adam.l@example.com",       TaxId = "7777777777", CreatedAt = FixedContractorDates[6], Street = "Ulica G", BuildingNumber = "7", ApartmentNumber = "5",  City = "Lublin",   PostalCode = "20-007" },
                new Contractor { Id = 8, Name = "Firma Theta",  FirstName = "Zofia", LastName = "Wójcik", Email = "zofia.w@example.com",         TaxId = "8888888888", CreatedAt = FixedContractorDates[7], Street = "Ulica H", BuildingNumber = "8", ApartmentNumber = "",   City = "Szczecin", PostalCode = "70-008" },
                new Contractor { Id = 9, Name = "Firma Iota",   FirstName = "Roman", LastName = "Pawlak", Email = "roman.p@example.com",         TaxId = "9999999999", CreatedAt = FixedContractorDates[8], Street = "Ulica I", BuildingNumber = "9", ApartmentNumber = "15", City = "Katowice", PostalCode = "40-009" },
                new Contractor { Id = 10, Name = "Firma Kappa", FirstName = "Magda", LastName = "Sikorska", Email = "magda.s@example.com",        TaxId = "1010101010", CreatedAt = FixedContractorDates[9], Street = "Ulica J", BuildingNumber = "10", ApartmentNumber = "",   City = "Gliwice",  PostalCode = "44-010" },
                new Contractor { Id = 11, Name = "Firma Lambda", FirstName = "Robert", LastName = "Adamski", Email = "robert.a@example.com",      TaxId = "1112131415", CreatedAt = FixedContractorDates[10], Street = "Ulica K", BuildingNumber = "11", ApartmentNumber = "22", City = "Bydgoszcz", PostalCode = "85-011" },
                new Contractor { Id = 12, Name = "Firma Mu",     FirstName = "Olga", LastName = "Błaszczyk", Email = "olga.b@example.com",       TaxId = "1213141516", CreatedAt = FixedContractorDates[11], Street = "Ulica L", BuildingNumber = "12", ApartmentNumber = "",   City = "Radom",    PostalCode = "45-012" },
                new Contractor { Id = 13, Name = "Firma Nu",     FirstName = "Tomasz", LastName = "Majewski", Email = "tomasz.m@example.com",      TaxId = "1314151617", CreatedAt = FixedContractorDates[12], Street = "Ulica M", BuildingNumber = "13", ApartmentNumber = "8",  City = "Olsztyn",  PostalCode = "10-013" },
                new Contractor { Id = 14, Name = "Firma Xi",     FirstName = "Barbara", LastName = "Górska", Email = "barbara.g@example.com",      TaxId = "1415161718", CreatedAt = FixedContractorDates[13], Street = "Ulica N", BuildingNumber = "14", ApartmentNumber = "",   City = "Rzeszów", PostalCode = "35-014" },
                new Contractor { Id = 15, Name = "Firma Omikron",FirstName = "Michał", LastName = "Krawczyk", Email = "michal.k@example.com",      TaxId = "1516171819", CreatedAt = FixedContractorDates[14], Street = "Ulica O", BuildingNumber = "15", ApartmentNumber = "3",  City = "Sopot",   PostalCode = "81-015" }
            };

            modelBuilder.Entity<Contractor>().HasData(contractors);

            // Seed faktur – wszystkie z tą samą, stałą datą
            var invoices = new Invoice[]
            {
                new Invoice { Id = 1, Number = "1/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 150.50m, PaymentStatus = PaymentStatus.Paid, ContractorId = 1, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Cash },
                new Invoice { Id = 2, Number = "2/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 250.75m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 2, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Transfer },
                new Invoice { Id = 3, Number = "3/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 350.00m, PaymentStatus = PaymentStatus.Paid, ContractorId = 3, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Card },
                new Invoice { Id = 4, Number = "4/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 450.25m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 4, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Other },
                new Invoice { Id = 5, Number = "5/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 550.50m, PaymentStatus = PaymentStatus.Paid, ContractorId = 5, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Cash },
                new Invoice { Id = 6, Number = "6/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 650.75m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 6, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Transfer },
                new Invoice { Id = 7, Number = "7/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 750.00m, PaymentStatus = PaymentStatus.Paid, ContractorId = 7, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Card },
                new Invoice { Id = 8, Number = "8/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 850.25m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 8, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Other },
                new Invoice { Id = 9, Number = "9/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 950.50m, PaymentStatus = PaymentStatus.Paid, ContractorId = 9, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Cash },
                new Invoice { Id = 10, Number = "10/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1050.75m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 10, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Transfer },
                new Invoice { Id = 11, Number = "11/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1150.00m, PaymentStatus = PaymentStatus.Paid, ContractorId = 11, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Card },
                new Invoice { Id = 12, Number = "12/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1250.25m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 12, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Other },
                new Invoice { Id = 13, Number = "13/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1350.50m, PaymentStatus = PaymentStatus.Paid, ContractorId = 13, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Cash },
                new Invoice { Id = 14, Number = "14/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1450.75m, PaymentStatus = PaymentStatus.Unpaid, ContractorId = 14, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Transfer },
                new Invoice { Id = 15, Number = "15/2025", Date = FixedInvoiceDate, DueDate = FixedInvoiceDate, Amount = 1550.00m, PaymentStatus = PaymentStatus.Paid, ContractorId = 15, CreatedAt = FixedInvoiceDate, PaymentMethod = PaymentMethod.Card }
            };

            modelBuilder.Entity<Invoice>().HasData(invoices);
        }
    }
}