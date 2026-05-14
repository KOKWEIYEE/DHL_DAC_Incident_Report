import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateTicketDraft(content: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an AI assistant for the DHL Incident Report system. 
    Analyze the following raw notes, email, or message and extract details for a new incident ticket.
    
    Return the result ONLY as a JSON object with the following fields:
    - subject: A concise summary of the issue.
    - description: A detailed explanation of what happened.
    - department: One of ["IT Services", "Operation", "Customer Services", "Human Resources", "Sales"]. Choose the most relevant one.
    - type: One of ["Issue", "Task", "Request"].
    - priority: One of ["Low", "Medium", "High", "Urgent"].
    - tags: An array of up to 3 relevant keywords (e.g., ["Software", "Network", "Hardware"]).

    Input content:
    """
    ${content}
    """

    Return ONLY the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from markdown if present
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating draft with Gemini:', error);
    throw new Error('Failed to generate AI draft.');
  }
}
