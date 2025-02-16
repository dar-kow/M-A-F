using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Contractor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string TaxId { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string BuildingNumber { get; set; }

        [Required]
        public string ApartmentNumber { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string PostalCode { get; set; }
    }
}