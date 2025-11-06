using api.Config;
using api.Models;
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

    private async Task<ChatResponse> AskQuestion(string question, string threadId = null)
    {
        var endpoint = new Uri("https://atomb-mhnaki12-eastus2.services.ai.azure.com/api/projects/atomb-mhnaki12-eastus2-project");
        AIProjectClient projectClient = new(endpoint, new DefaultAzureCredential());

        PersistentAgentsClient agentsClient = projectClient.GetPersistentAgentsClient();

        PersistentAgent agent = agentsClient.Administration.GetAgent("asst_7Fz2ZgLg0EphMwSkLW8qNTtt");

        string threadIdToUse = threadId;
        if (string.IsNullOrEmpty(threadId))
        {
            PersistentAgentThread thread = agentsClient.Threads.CreateThread();
            threadIdToUse = thread.Id;
        }

        PersistentThreadMessage messageResponse = agentsClient.Messages.CreateMessage(
            threadIdToUse,
            MessageRole.User,
            question);

        ThreadRun run = agentsClient.Runs.CreateRun(
            threadIdToUse,
            agent.Id);

        // Poll until the run reaches a terminal status
        do
        {
            await Task.Delay(TimeSpan.FromMilliseconds(500));
            run = agentsClient.Runs.GetRun(threadIdToUse, run.Id);
        }
        while (run.Status == RunStatus.Queued
            || run.Status == RunStatus.InProgress);
        if (run.Status != RunStatus.Completed)
        {
            throw new InvalidOperationException($"Run failed or was canceled: {run.LastError?.Message}");
        }

        Pageable<PersistentThreadMessage> messages = agentsClient.Messages.GetMessages(
            threadIdToUse, order: ListSortOrder.Ascending);

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
            }
        }
        if(messageList.Any())
        {
            return new ChatResponse
            {
                ThreadId = threadIdToUse,
                Message = messageList.Last()
            };
        }
   
        return new ChatResponse
        {
            ThreadId = threadIdToUse,
            Message = "I dont know!"
        };
    }

    public async Task<ChatResponse> Ask(string question, string threadId = null)
    {
        try
        {
            return await AskQuestion(question, threadId);
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