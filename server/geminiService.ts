import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateTicketDraft(content: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
    You are an AI assistant for the DHL Incident Report system. 
    Analyze the following raw notes, email, or message and extract details for a new incident ticket.
    
    Return the result ONLY as a JSON object with the following fields:
    - subject: A concise summary of the issue.
    - description: A detailed explanation in HTML format. Divide it into three sections:
        1. <h3>Summary</h3>: A brief overview of the incident.
        2. <h3>Action</h3>: A numbered list (<ol><li>...</li></ol>) of troubleshooting steps or required actions.
        3. <h3>Related Links</h3>: A list of relevant URLs or resources mentioned.
      
      Use rich HTML formatting for the content:
      - <b>Bold</b> for crucial terms, system names, or error codes.
      - <i>Italics</i> for emphasis or quotes.
      - <u>Underline</u> for specific headings or important IDs.
      - Use "double quotes" for verbatim messages.
      - Use <br/> for line breaks within sections.
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
    console.log('Gemini Raw Response:', text);
    
    // Extract JSON from markdown if present
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Error generating draft with Gemini:', error);
    throw new Error(`AI processing failed: ${error.message || 'Unknown error'}`);
  }
}
