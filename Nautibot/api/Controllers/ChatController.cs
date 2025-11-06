using Microsoft.AspNetCore.Mvc;
using api.Services;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService service)
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
        public required string Question { get; set; }
    }
}
