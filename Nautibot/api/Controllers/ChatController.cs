using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Azure;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly SearchClient _searchClient;

        public ChatController(IConfiguration configuration)
        {
        //    var searchServiceEndpoint = configuration["AzureSearch:Endpoint"];
        //    var indexName = configuration["AzureSearch:IndexName"];
        //    var apiKey = configuration["AzureSearch:ApiKey"];

            var searchServiceEndpoint = "https://endeavor-search.search.windows.net";
            var indexName = "";
            var apiKey = "";

            _searchClient = new SearchClient(
                new Uri(searchServiceEndpoint),
                indexName,
                new AzureKeyCredential(apiKey)
            );
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion([FromBody] ChatRequest request)
        {
            try
            {
                var searchOptions = new SearchOptions
                {
                    Size = 5, // Number of results to return
                    Select = { "title", "chunk" }, // Fields to return
                    IncludeTotalCount = true
                };

                SearchResults<SearchDocument> response = await _searchClient.SearchAsync<SearchDocument>(
                    request.Question,
                    searchOptions
                );

                var results = new List<object>();
                await foreach (SearchResult<SearchDocument> result in response.GetResultsAsync())
                {
                    results.Add(new
                    {
                        Score = result.Score,
                        Document = result.Document
                    });
                }

                return Ok(new { Results = results, TotalCount = response.TotalCount });
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
