// Dummy responses for the chatbot
export const dummyResponses = [
    {
        id: 1,
        text: "Based on the SharePoint documents I've reviewed, I can help you with vessel navigation charts and maritime safety protocols. What specific information are you looking for?",
        delay: 1200,
    },
    {
        id: 2,
        text: "I've found several relevant documents about maritime regulations. Would you like me to summarize the latest updates on international shipping standards?",
        delay: 1500,
    },
    {
        id: 3,
        text: "Here's what I found in the documentation: The new safety protocols require vessels to maintain updated navigation charts at all times. I can provide more details if needed.",
        delay: 1800,
    },
    {
        id: 4,
        text: "I can access various SharePoint libraries including Navigation Charts, Safety Protocols, Fleet Management, and Compliance Documents. Which area interests you most?",
        delay: 1300,
    },
    {
        id: 5,
        text: "According to the latest documents, there are three main categories of maritime operations. Let me break them down for you...",
        delay: 1600,
    },
];

// Get a random response
export const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * dummyResponses.length);
    return dummyResponses[randomIndex];
};

// Simulate typing delay
export const simulateTypingDelay = (text) => {
    // Base delay of 1000ms + 30ms per character (max 3000ms)
    return Math.min(1000 + text.length * 30, 3000);
};

// Dummy conversation history
export const dummyConversations = [
    {
        id: '1',
        title: 'Navigation Chart Updates',
        timestamp: new Date(Date.now() - 3600000),
        preview: 'Can you show me the latest navigation charts?',
    },
    {
        id: '2',
        title: 'Safety Protocols Q3 2024',
        timestamp: new Date(Date.now() - 86400000),
        preview: 'What are the new safety requirements?',
    },
    {
        id: '3',
        title: 'Fleet Management Report',
        timestamp: new Date(Date.now() - 172800000),
        preview: 'Generate a summary of fleet operations',
    },
    {
        id: '4',
        title: 'Compliance Documentation',
        timestamp: new Date(Date.now() - 259200000),
        preview: 'Help me find compliance documents',
    },
];

// Dummy suggested prompts
export const suggestedPrompts = [
    "Show me the latest navigation charts",
    "What are the current safety protocols?",
    "Summarize fleet management reports",
    "Find compliance documentation",
    "Explain maritime regulations",
    "Search SharePoint for vessel data",
];
