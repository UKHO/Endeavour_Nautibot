
namespace api.Services;

public interface IChatService
{
    Task<string> Ask(string question);
}