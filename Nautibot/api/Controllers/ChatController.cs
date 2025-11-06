using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Azure;
using api.Services;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly SearchClient _searchClient;
        private readonly IChatService _chatService;

        public ChatController(IConfiguration configuration, IChatService service)
        {
            _chatService = service;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion([FromBody] ChatRequest request)
        {
            try
            {
                var response = await _chatService.Ask(request.Question);

                return Ok(new { Results = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }

    public class ChatRequest
    {
        public string Question { get; set; }
    }
}
