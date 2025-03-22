﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.Contractor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ApartmentNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BuildingNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PostalCode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("TaxId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("contractors", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            ApartmentNumber = "10",
                            BuildingNumber = "1",
                            City = "Warszawa",
                            CreatedAt = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "jan.kowalski@example.com",
                            FirstName = "Jan",
                            LastName = "Kowalski",
                            Name = "Firma Alpha",
                            PostalCode = "00-001",
                            Street = "Ulica A",
                            TaxId = "1111111111"
                        },
                        new
                        {
                            Id = 2,
                            ApartmentNumber = "",
                            BuildingNumber = "2",
                            City = "Kraków",
                            CreatedAt = new DateTime(2025, 2, 7, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "anna.nowak@example.com",
                            FirstName = "Anna",
                            LastName = "Nowak",
                            Name = "Firma Beta",
                            PostalCode = "30-002",
                            Street = "Ulica B",
                            TaxId = "2222222222"
                        },
                        new
                        {
                            Id = 3,
                            ApartmentNumber = "12",
                            BuildingNumber = "3",
                            City = "Łódź",
                            CreatedAt = new DateTime(2025, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "piotr.w@example.com",
                            FirstName = "Piotr",
                            LastName = "Wiśniewski",
                            Name = "Firma Gamma",
                            PostalCode = "90-003",
                            Street = "Ulica C",
                            TaxId = "3333333333"
                        },
                        new
                        {
                            Id = 4,
                            ApartmentNumber = "",
                            BuildingNumber = "4",
                            City = "Poznań",
                            CreatedAt = new DateTime(2025, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "ewa.k@example.com",
                            FirstName = "Ewa",
                            LastName = "Kowalczyk",
                            Name = "Firma Delta",
                            PostalCode = "60-004",
                            Street = "Ulica D",
                            TaxId = "4444444444"
                        },
                        new
                        {
                            Id = 5,
                            ApartmentNumber = "20",
                            BuildingNumber = "5",
                            City = "Wrocław",
                            CreatedAt = new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "marek.z@example.com",
                            FirstName = "Marek",
                            LastName = "Zieliński",
                            Name = "Firma Epsilon",
                            PostalCode = "50-005",
                            Street = "Ulica E",
                            TaxId = "5555555555"
                        },
                        new
                        {
                            Id = 6,
                            ApartmentNumber = "",
                            BuildingNumber = "6",
                            City = "Gdańsk",
                            CreatedAt = new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "kasia.j@example.com",
                            FirstName = "Kasia",
                            LastName = "Jankowska",
                            Name = "Firma Zeta",
                            PostalCode = "80-006",
                            Street = "Ulica F",
                            TaxId = "6666666666"
                        },
                        new
                        {
                            Id = 7,
                            ApartmentNumber = "5",
                            BuildingNumber = "7",
                            City = "Lublin",
                            CreatedAt = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "adam.l@example.com",
                            FirstName = "Adam",
                            LastName = "Lewandowski",
                            Name = "Firma Eta",
                            PostalCode = "20-007",
                            Street = "Ulica G",
                            TaxId = "7777777777"
                        },
                        new
                        {
                            Id = 8,
                            ApartmentNumber = "",
                            BuildingNumber = "8",
                            City = "Szczecin",
                            CreatedAt = new DateTime(2025, 2, 9, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "zofia.w@example.com",
                            FirstName = "Zofia",
                            LastName = "Wójcik",
                            Name = "Firma Theta",
                            PostalCode = "70-008",
                            Street = "Ulica H",
                            TaxId = "8888888888"
                        },
                        new
                        {
                            Id = 9,
                            ApartmentNumber = "15",
                            BuildingNumber = "9",
                            City = "Katowice",
                            CreatedAt = new DateTime(2025, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "roman.p@example.com",
                            FirstName = "Roman",
                            LastName = "Pawlak",
                            Name = "Firma Iota",
                            PostalCode = "40-009",
                            Street = "Ulica I",
                            TaxId = "9999999999"
                        },
                        new
                        {
                            Id = 10,
                            ApartmentNumber = "",
                            BuildingNumber = "10",
                            City = "Gliwice",
                            CreatedAt = new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "magda.s@example.com",
                            FirstName = "Magda",
                            LastName = "Sikorska",
                            Name = "Firma Kappa",
                            PostalCode = "44-010",
                            Street = "Ulica J",
                            TaxId = "1010101010"
                        },
                        new
                        {
                            Id = 11,
                            ApartmentNumber = "22",
                            BuildingNumber = "11",
                            City = "Bydgoszcz",
                            CreatedAt = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "robert.a@example.com",
                            FirstName = "Robert",
                            LastName = "Adamski",
                            Name = "Firma Lambda",
                            PostalCode = "85-011",
                            Street = "Ulica K",
                            TaxId = "1112131415"
                        },
                        new
                        {
                            Id = 12,
                            ApartmentNumber = "",
                            BuildingNumber = "12",
                            City = "Radom",
                            CreatedAt = new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "olga.b@example.com",
                            FirstName = "Olga",
                            LastName = "Błaszczyk",
                            Name = "Firma Mu",
                            PostalCode = "45-012",
                            Street = "Ulica L",
                            TaxId = "1213141516"
                        },
                        new
                        {
                            Id = 13,
                            ApartmentNumber = "8",
                            BuildingNumber = "13",
                            City = "Olsztyn",
                            CreatedAt = new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "tomasz.m@example.com",
                            FirstName = "Tomasz",
                            LastName = "Majewski",
                            Name = "Firma Nu",
                            PostalCode = "10-013",
                            Street = "Ulica M",
                            TaxId = "1314151617"
                        },
                        new
                        {
                            Id = 14,
                            ApartmentNumber = "",
                            BuildingNumber = "14",
                            City = "Rzeszów",
                            CreatedAt = new DateTime(2025, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "barbara.g@example.com",
                            FirstName = "Barbara",
                            LastName = "Górska",
                            Name = "Firma Xi",
                            PostalCode = "35-014",
                            Street = "Ulica N",
                            TaxId = "1415161718"
                        },
                        new
                        {
                            Id = 15,
                            ApartmentNumber = "3",
                            BuildingNumber = "15",
                            City = "Sopot",
                            CreatedAt = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Email = "michal.k@example.com",
                            FirstName = "Michał",
                            LastName = "Krawczyk",
                            Name = "Firma Omikron",
                            PostalCode = "81-015",
                            Street = "Ulica O",
                            TaxId = "1516171819"
                        });
                });

            modelBuilder.Entity("backend.Models.Correction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("InvoiceId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("InvoiceId");

                    b.ToTable("corrections", (string)null);
                });

            modelBuilder.Entity("backend.Models.Invoice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ContractorId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("DueDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("IssueDate")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("PaidAmount")
                        .HasColumnType("numeric");

                    b.Property<string>("PaymentMethod")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PaymentStatus")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("TotalAmount")
                        .HasColumnType("numeric");

                    b.HasKey("Id");

                    b.HasIndex("ContractorId");

                    b.ToTable("invoices", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            ContractorId = 1,
                            CreatedAt = new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/1/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Cash",
                            PaymentStatus = "Paid",
                            TotalAmount = 150.50m
                        },
                        new
                        {
                            Id = 2,
                            ContractorId = 2,
                            CreatedAt = new DateTime(2025, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/2/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Transfer",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 250.75m
                        },
                        new
                        {
                            Id = 3,
                            ContractorId = 3,
                            CreatedAt = new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/3/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Card",
                            PaymentStatus = "Paid",
                            TotalAmount = 350.00m
                        },
                        new
                        {
                            Id = 4,
                            ContractorId = 4,
                            CreatedAt = new DateTime(2025, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/4/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Other",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 450.25m
                        },
                        new
                        {
                            Id = 5,
                            ContractorId = 5,
                            CreatedAt = new DateTime(2025, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/5/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Cash",
                            PaymentStatus = "Paid",
                            TotalAmount = 550.50m
                        },
                        new
                        {
                            Id = 6,
                            ContractorId = 6,
                            CreatedAt = new DateTime(2025, 2, 12, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/6/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Transfer",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 650.75m
                        },
                        new
                        {
                            Id = 7,
                            ContractorId = 7,
                            CreatedAt = new DateTime(2025, 2, 16, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/7/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Card",
                            PaymentStatus = "Paid",
                            TotalAmount = 750.00m
                        },
                        new
                        {
                            Id = 8,
                            ContractorId = 8,
                            CreatedAt = new DateTime(2025, 2, 22, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/8/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Other",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 850.25m
                        },
                        new
                        {
                            Id = 9,
                            ContractorId = 9,
                            CreatedAt = new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/9/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Cash",
                            PaymentStatus = "Paid",
                            TotalAmount = 950.50m
                        },
                        new
                        {
                            Id = 10,
                            ContractorId = 10,
                            CreatedAt = new DateTime(2025, 3, 3, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/10/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Transfer",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 1050.75m
                        },
                        new
                        {
                            Id = 11,
                            ContractorId = 11,
                            CreatedAt = new DateTime(2025, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/11/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Card",
                            PaymentStatus = "Paid",
                            TotalAmount = 1150.00m
                        },
                        new
                        {
                            Id = 12,
                            ContractorId = 12,
                            CreatedAt = new DateTime(2025, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/12/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Other",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 1250.25m
                        },
                        new
                        {
                            Id = 13,
                            ContractorId = 13,
                            CreatedAt = new DateTime(2025, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/13/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Cash",
                            PaymentStatus = "Paid",
                            TotalAmount = 1350.50m
                        },
                        new
                        {
                            Id = 14,
                            ContractorId = 14,
                            CreatedAt = new DateTime(2025, 3, 21, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/14/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Transfer",
                            PaymentStatus = "Unpaid",
                            TotalAmount = 1450.75m
                        },
                        new
                        {
                            Id = 15,
                            ContractorId = 15,
                            CreatedAt = new DateTime(2025, 3, 22, 0, 0, 0, 0, DateTimeKind.Utc),
                            Description = "Faktura VAT 23%",
                            DueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            IssueDate = new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc),
                            Number = "FV/15/2025",
                            PaidAmount = 0m,
                            PaymentMethod = "Card",
                            PaymentStatus = "Paid",
                            TotalAmount = 1550.00m
                        });
                });

            modelBuilder.Entity("backend.Models.InvoiceItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("InvoiceId")
                        .HasColumnType("integer");

                    b.Property<int>("LineNumber")
                        .HasColumnType("integer");

                    b.Property<decimal>("NetPrice")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Quantity")
                        .HasColumnType("numeric");

                    b.Property<int>("Unit")
                        .HasColumnType("integer");

                    b.Property<int>("VatRate")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("InvoiceId");

                    b.ToTable("InvoiceItems");
                });

            modelBuilder.Entity("backend.Models.Correction", b =>
                {
                    b.HasOne("backend.Models.Invoice", "Invoice")
                        .WithMany()
                        .HasForeignKey("InvoiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Invoice");
                });

            modelBuilder.Entity("backend.Models.Invoice", b =>
                {
                    b.HasOne("backend.Models.Contractor", null)
                        .WithMany()
                        .HasForeignKey("ContractorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("backend.Models.InvoiceItem", b =>
                {
                    b.HasOne("backend.Models.Invoice", "Invoice")
                        .WithMany("InvoiceItems")
                        .HasForeignKey("InvoiceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Invoice");
                });

            modelBuilder.Entity("backend.Models.Invoice", b =>
                {
                    b.Navigation("InvoiceItems");
                });
#pragma warning restore 612, 618
        }
    }
}
