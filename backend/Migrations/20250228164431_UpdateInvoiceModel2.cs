using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInvoiceModel2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "invoices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 2,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 3,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 4,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 5,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 6,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 7,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 8,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 9,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 10,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 11,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 12,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 13,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 14,
                column: "Description",
                value: "Faktura VAT 23%");

            migrationBuilder.UpdateData(
                table: "invoices",
                keyColumn: "Id",
                keyValue: 15,
                column: "Description",
                value: "Faktura VAT 23%");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "invoices");
        }
    }
}
