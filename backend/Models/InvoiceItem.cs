using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum VatRate
    {
        Zero = 0,
        Three = 3,
        Five = 5,
        Eight = 8,
        TwentyThree = 23
    }

    public enum Unit
    {
        l,
        szt,
        m,
        kg
    }

    public class InvoiceItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int LineNumber { get; set; }

        [Required]
        public required string Description { get; set; }

        public decimal Quantity { get; set; }

        [Required]
        public required Unit Unit { get; set; }

        [Required]
        public required VatRate VatRate { get; set; }

        public decimal NetPrice { get; set; }

        public int InvoiceId { get; set; }

        [ForeignKey("InvoiceId")]
        public Invoice? Invoice { get; set; }

    }
}