using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceItemsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceItem>>> GetInvoiceItemsByInvoiceId([FromQuery] int invoiceId)
        {
            var invoiceItems = await _context.InvoiceItems
                .Where(i => i.InvoiceId == invoiceId)
                .ToListAsync();

            return Ok(invoiceItems);
        }
    }
}