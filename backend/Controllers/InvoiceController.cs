using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly RabbitMqService _rabbitMqService;
        private readonly ILogger<InvoicesController> _logger;

        public InvoicesController(AppDbContext context, RabbitMqService rabbitMqService, ILogger<InvoicesController> logger)
        {
            _context = context;
            _rabbitMqService = rabbitMqService;
            _logger = logger;
        }

        // GET: api/invoices
        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var invoices = await _context.Invoices.ToListAsync();
            return Ok(invoices);
        }

        // GET: api/invoices/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceItems)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return NotFound();
            }

            return invoice;
        }

        // POST: api/invoices
        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            foreach (var item in invoice.InvoiceItems)
            {
                item.InvoiceId = invoice.Id;
            }

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            try
            {
                _rabbitMqService.PublishInvoiceCreated(invoice.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError("Błąd przy publikacji do RabbitMQ: {0}", ex.Message);
            }

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        // PUT: api/invoices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] Invoice invoice)
        {
            if (id != invoice.Id)
                return BadRequest();

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Invoices.AnyAsync(i => i.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/invoices/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return NotFound();

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/invoices/last-number
        [HttpGet("last-number")]
        public async Task<ActionResult<string>> GetLastInvoiceNumber()
        {
            try
            {
                // Pobierz fakturę z największym ID (zakładamy, że najnowsze faktury mają wyższe ID)
                var lastInvoice = await _context.Invoices
                    .OrderByDescending(i => i.Id)
                    .FirstOrDefaultAsync();

                if (lastInvoice == null)
                {
                    return Ok("");
                }

                _logger.LogInformation($"Ostatni numer faktury: {lastInvoice.Number}");
                return Ok(lastInvoice.Number);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Błąd podczas pobierania ostatniego numeru faktury");
                return StatusCode(500, "Wystąpił błąd podczas przetwarzania żądania");
            }
        }
    }
}