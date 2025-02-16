using System.Text;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;

namespace backend.Services
{
    public class RabbitMqService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public RabbitMqService(IConfiguration configuration)
        {
            var factory = new ConnectionFactory()
            {
                HostName = configuration["RabbitMQ:Host"] ?? "rabbitmq"
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            // Deklarujemy kolejkę – przykładowa nazwa "invoice_created"
            _channel.QueueDeclare(queue: "invoice_created",
                                  durable: false,
                                  exclusive: false,
                                  autoDelete: false,
                                  arguments: null);
        }

        public void PublishInvoiceCreated(int invoiceId)
        {
            var message = invoiceId.ToString();
            var body = Encoding.UTF8.GetBytes(message);

            _channel.BasicPublish(exchange: "",
                                  routingKey: "invoice_created",
                                  basicProperties: null,
                                  body: body);
        }
    }
}
