const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5180';

/**
 * Send a question to the chat API and return the answer.
 */
export const askQuestion = async (question) => {
    const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Question: question }),
    });

    if (!response.ok) {
        throw new Error(`API error ${response.status}`);
    }

    return response.json();
};
