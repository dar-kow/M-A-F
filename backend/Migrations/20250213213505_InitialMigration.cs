using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "contractors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    TaxId = table.Column<string>(type: "text", nullable: false),
                    Street = table.Column<string>(type: "text", nullable: false),
                    BuildingNumber = table.Column<string>(type: "text", nullable: false),
                    ApartmentNumber = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    PostalCode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contractors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "invoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    PaymentStatus = table.Column<string>(type: "text", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    PaidAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    ContractorId = table.Column<int>(type: "integer", nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_invoices_contractors_ContractorId",
                        column: x => x.ContractorId,
                        principalTable: "contractors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "corrections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_corrections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_corrections_invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LineNumber = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric", nullable: false),
                    Unit = table.Column<int>(type: "integer", nullable: false),
                    VatRate = table.Column<int>(type: "integer", nullable: false),
                    NetPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    InvoiceId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceItems_invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "contractors",
                columns: new[] { "Id", "ApartmentNumber", "BuildingNumber", "City", "CreatedAt", "Email", "FirstName", "LastName", "Name", "PostalCode", "Street", "TaxId" },
                values: new object[,]
                {
                    { 1, "10", "1", "Warszawa", new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "jan.kowalski@example.com", "Jan", "Kowalski", "Firma Alpha", "00-001", "Ulica A", "1111111111" },
                    { 2, "", "2", "Kraków", new DateTime(2025, 2, 7, 0, 0, 0, 0, DateTimeKind.Utc), "anna.nowak@example.com", "Anna", "Nowak", "Firma Beta", "30-002", "Ulica B", "2222222222" },
                    { 3, "12", "3", "Łódź", new DateTime(2025, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc), "piotr.w@example.com", "Piotr", "Wiśniewski", "Firma Gamma", "90-003", "Ulica C", "3333333333" },
                    { 4, "", "4", "Poznań", new DateTime(2025, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), "ewa.k@example.com", "Ewa", "Kowalczyk", "Firma Delta", "60-004", "Ulica D", "4444444444" },
                    { 5, "20", "5", "Wrocław", new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "marek.z@example.com", "Marek", "Zieliński", "Firma Epsilon", "50-005", "Ulica E", "5555555555" },
                    { 6, "", "6", "Gdańsk", new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "kasia.j@example.com", "Kasia", "Jankowska", "Firma Zeta", "80-006", "Ulica F", "6666666666" },
                    { 7, "5", "7", "Lublin", new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "adam.l@example.com", "Adam", "Lewandowski", "Firma Eta", "20-007", "Ulica G", "7777777777" },
                    { 8, "", "8", "Szczecin", new DateTime(2025, 2, 9, 0, 0, 0, 0, DateTimeKind.Utc), "zofia.w@example.com", "Zofia", "Wójcik", "Firma Theta", "70-008", "Ulica H", "8888888888" },
                    { 9, "15", "9", "Katowice", new DateTime(2025, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc), "roman.p@example.com", "Roman", "Pawlak", "Firma Iota", "40-009", "Ulica I", "9999999999" },
                    { 10, "", "10", "Gliwice", new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "magda.s@example.com", "Magda", "Sikorska", "Firma Kappa", "44-010", "Ulica J", "1010101010" },
                    { 11, "22", "11", "Bydgoszcz", new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "robert.a@example.com", "Robert", "Adamski", "Firma Lambda", "85-011", "Ulica K", "1112131415" },
                    { 12, "", "12", "Radom", new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "olga.b@example.com", "Olga", "Błaszczyk", "Firma Mu", "45-012", "Ulica L", "1213141516" },
                    { 13, "8", "13", "Olsztyn", new DateTime(2025, 2, 2, 0, 0, 0, 0, DateTimeKind.Utc), "tomasz.m@example.com", "Tomasz", "Majewski", "Firma Nu", "10-013", "Ulica M", "1314151617" },
                    { 14, "", "14", "Rzeszów", new DateTime(2025, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc), "barbara.g@example.com", "Barbara", "Górska", "Firma Xi", "35-014", "Ulica N", "1415161718" },
                    { 15, "3", "15", "Sopot", new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "michal.k@example.com", "Michał", "Krawczyk", "Firma Omikron", "81-015", "Ulica O", "1516171819" }
                });

            migrationBuilder.InsertData(
                table: "invoices",
                columns: new[] { "Id", "Amount", "ContractorId", "CreatedAt", "Date", "DueDate", "Number", "PaidAmount", "PaymentMethod", "PaymentStatus" },
                values: new object[,]
                {
                    { 1, 150.50m, 1, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "1/2025", 0m, "Cash", "Paid" },
                    { 2, 250.75m, 2, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "2/2025", 0m, "Transfer", "Unpaid" },
                    { 3, 350.00m, 3, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "3/2025", 0m, "Card", "Paid" },
                    { 4, 450.25m, 4, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "4/2025", 0m, "Other", "Unpaid" },
                    { 5, 550.50m, 5, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "5/2025", 0m, "Cash", "Paid" },
                    { 6, 650.75m, 6, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "6/2025", 0m, "Transfer", "Unpaid" },
                    { 7, 750.00m, 7, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "7/2025", 0m, "Card", "Paid" },
                    { 8, 850.25m, 8, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "8/2025", 0m, "Other", "Unpaid" },
                    { 9, 950.50m, 9, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "9/2025", 0m, "Cash", "Paid" },
                    { 10, 1050.75m, 10, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "10/2025", 0m, "Transfer", "Unpaid" },
                    { 11, 1150.00m, 11, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "11/2025", 0m, "Card", "Paid" },
                    { 12, 1250.25m, 12, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "12/2025", 0m, "Other", "Unpaid" },
                    { 13, 1350.50m, 13, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "13/2025", 0m, "Cash", "Paid" },
                    { 14, 1450.75m, 14, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "14/2025", 0m, "Transfer", "Unpaid" },
                    { 15, 1550.00m, 15, new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "15/2025", 0m, "Card", "Paid" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_corrections_InvoiceId",
                table: "corrections",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceItems_InvoiceId",
                table: "InvoiceItems",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_invoices_ContractorId",
                table: "invoices",
                column: "ContractorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "corrections");

            migrationBuilder.DropTable(
                name: "InvoiceItems");

            migrationBuilder.DropTable(
                name: "invoices");

            migrationBuilder.DropTable(
                name: "contractors");
        }
    }
}
