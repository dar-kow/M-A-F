using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            return await _context.Invoices.ToListAsync();
        }

        // GET: api/Invoices/5
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

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, Invoice invoice)
        {
            if (id != invoice.Id)
            {
                return BadRequest();
            }

            invoice.UpdatePaymentStatus();

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                _rabbitMqService.PublishInvoiceUpdated(id);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
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

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice(Invoice invoice)
        {
            invoice.UpdatePaymentStatus();

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            _rabbitMqService.PublishInvoiceCreated(invoice.Id);

            return CreatedAtAction("GetInvoice", new { id = invoice.Id }, invoice);
        }

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/payment")]
        public async Task<ActionResult<Invoice>> UpdatePayment(int id, [FromBody] PaymentUpdateDto paymentData)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            invoice.PaidAmount = paymentData.PaidAmount;

            invoice.UpdatePaymentStatus();

            await _context.SaveChangesAsync();

            _rabbitMqService.PublishPaymentUpdated(id);

            return Ok(invoice);
        }

        // GET: api/invoices/last-number
        [HttpGet("last-number")]
        public async Task<ActionResult<string>> GetLastInvoiceNumber()
        {
            try
            {
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

        public class PaymentUpdateDto
        {
            public decimal PaidAmount { get; set; }
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.Id == id);
        }
    }
}