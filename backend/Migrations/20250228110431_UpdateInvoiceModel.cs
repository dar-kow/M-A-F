using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInvoiceModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "invoices",
                newName: "IssueDate");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "invoices",
                newName: "TotalAmount");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DueDate",
                table: "invoices",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "invoices",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "IssueDate",
                table: "invoices",
                newName: "Date");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DueDate",
                table: "invoices",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");
        }
    }
}
