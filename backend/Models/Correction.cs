using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("corrections")]
    public class Correction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
    }
}