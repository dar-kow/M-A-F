using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("invoices")]
    public class Invoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        public string Number { get; set; }
        public DateTime IssueDate { get; set; }
        public decimal TotalAmount { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
        public DateTime DueDate { get; set; }
        public decimal PaidAmount { get; set; } = 0;

        public string Description { get; set; }

        public int ContractorId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }
        public ICollection<InvoiceItem> InvoiceItems { get; set; }

        public void UpdatePaymentStatus()
        {
            if (PaidAmount >= TotalAmount)
            {
                PaymentStatus = PaymentStatus.Paid;
                return;
            }

            if (PaidAmount > 0)
            {
                PaymentStatus = PaymentStatus.PartiallyPaid;
            }
            else
            {
                PaymentStatus = PaymentStatus.Unpaid;
            }

            if (DueDate < DateTime.Now && PaymentStatus != PaymentStatus.Paid)
            {
                PaymentStatus = PaymentStatus.Overdue;
            }
        }
    }
}