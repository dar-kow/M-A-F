using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContractorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/contractors
        [HttpGet]
        public async Task<IActionResult> GetContractors()
        {
            var contractors = await _context.Contractors.ToListAsync();
            return Ok(contractors);
        }

        // GET: api/contractors/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContractor(int id)
        {
            var contractor = await _context.Contractors.FirstOrDefaultAsync(c => c.Id == id);
            if (contractor == null) return NotFound();
            return Ok(contractor);
        }

        // POST: api/contractors
        [HttpPost]
        public async Task<IActionResult> CreateContractor([FromBody] Contractor contractor)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (contractor.CreatedAt == default(DateTime))
            {
                contractor.CreatedAt = DateTime.UtcNow;
            }

            _context.Contractors.Add(contractor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetContractor), new { id = contractor.Id }, contractor);
        }

        // PUT: api/contractors/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContractor(int id, [FromBody] Contractor contractor)
        {
            if (id != contractor.Id)
            {
                return BadRequest();
            }

            var existingContractor = await _context.Contractors.FindAsync(id);
            if (existingContractor == null)
            {
                return NotFound();
            }

            existingContractor.Name = contractor.Name;
            existingContractor.Email = contractor.Email;
            existingContractor.FirstName = contractor.FirstName;
            existingContractor.LastName = contractor.LastName;
            existingContractor.TaxId = contractor.TaxId;
            existingContractor.Street = contractor.Street;
            existingContractor.BuildingNumber = contractor.BuildingNumber;
            existingContractor.ApartmentNumber = contractor.ApartmentNumber;
            existingContractor.City = contractor.City;
            existingContractor.PostalCode = contractor.PostalCode;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contractors.Any(c => c.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/contractors/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContractor(int id)
        {
            var contractor = await _context.Contractors.FirstOrDefaultAsync(c => c.Id == id);
            if (contractor == null) return NotFound();

            var hasInvoices = await _context.Invoices.AnyAsync(i => i.ContractorId == id);
            if (hasInvoices)
            {
                return BadRequest("Nie można usunąć kontrahenta, który ma przypisane faktury.");
            }

            _context.Contractors.Remove(contractor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}