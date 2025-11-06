using api.Config;
using Azure;
using Azure.AI.Agents.Persistent;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using Azure.AI.Projects;
using Azure.Identity;
using Microsoft.Extensions.Options;
using OpenAI.Assistants;
using OpenAI.Chat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static System.Environment;
using MessageContent = Azure.AI.Agents.Persistent.MessageContent;
using MessageRole = Azure.AI.Agents.Persistent.MessageRole;
using RunStatus = Azure.AI.Agents.Persistent.RunStatus;
using ThreadRun = Azure.AI.Agents.Persistent.ThreadRun;

namespace api.Services;

#pragma warning disable AOAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates

public class ChatService : IChatService
{
    private readonly ChatConfig _config;

    public ChatService(IOptions<ChatConfig> config)
    {
        _config = config.Value;
    }

    private async Task<List<string>> AskQuestion(string question)
    {
        var endpoint = new Uri("https://atomb-mhnaki12-eastus2.services.ai.azure.com/api/projects/atomb-mhnaki12-eastus2-project");
        AIProjectClient projectClient = new(endpoint, new DefaultAzureCredential());

        PersistentAgentsClient agentsClient = projectClient.GetPersistentAgentsClient();

        PersistentAgent agent = agentsClient.Administration.GetAgent("asst_7Fz2ZgLg0EphMwSkLW8qNTtt");

        PersistentAgentThread thread = agentsClient.Threads.CreateThread();
        Console.WriteLine($"Created thread, ID: {thread.Id}");

        PersistentThreadMessage messageResponse = agentsClient.Messages.CreateMessage(
            thread.Id,
            MessageRole.User,
            question);

        ThreadRun run = agentsClient.Runs.CreateRun(
            thread.Id,
            agent.Id);

        // Poll until the run reaches a terminal status
        do
        {
            await Task.Delay(TimeSpan.FromMilliseconds(500));
            run = agentsClient.Runs.GetRun(thread.Id, run.Id);
        }
        while (run.Status == RunStatus.Queued
            || run.Status == RunStatus.InProgress);
        if (run.Status != RunStatus.Completed)
        {
            throw new InvalidOperationException($"Run failed or was canceled: {run.LastError?.Message}");
        }

        Pageable<PersistentThreadMessage> messages = agentsClient.Messages.GetMessages(
            thread.Id, order: ListSortOrder.Ascending);

        var messageList = new List<string>();

        // Display messages
        foreach (PersistentThreadMessage threadMessage in messages)
        {
            Console.Write($"{threadMessage.CreatedAt:yyyy-MM-dd HH:mm:ss} - {threadMessage.Role,10}: ");
            foreach (MessageContent contentItem in threadMessage.ContentItems)
            {
                if (contentItem is MessageTextContent textItem)
                {
                    messageList.Add(textItem.Text);
                }
                //else if (contentItem is MessageImageFileContent imageFileItem)
                //{
                //    Console.Write($"<image from ID: {imageFileItem.FileId}");
                //}
                //Console.WriteLine();
            }
        }
        if(messageList.Any())
        {
            return messageList;
        }
        messageList.Add( "I dont know!");
        return messageList;
    }

    public async Task<string> Ask(string question)
    {
        try
        {
            return (await AskQuestion(question)).Last();
        }
        catch (CredentialUnavailableException ex)
        {
            throw new InvalidOperationException("Azure credentials are unavailable. Sign in with 'az login' or configure the appropriate environment variables for DefaultAzureCredential.", ex);
        }
        catch (AuthenticationFailedException ex)
        {
            throw new InvalidOperationException("Authentication with Azure OpenAI failed. Ensure your identity has access to the project and the correct permissions.", ex);
        }
    }
}

#pragma warning restore AOAI001