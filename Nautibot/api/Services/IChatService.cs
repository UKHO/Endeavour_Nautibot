
using api.Models;

namespace api.Services;

public interface IChatService
{
    Task<ChatResponse> Ask(string question, string threadId = null);
}