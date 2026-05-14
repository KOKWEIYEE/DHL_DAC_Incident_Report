import dotenv from 'dotenv';
dotenv.config();
import { generateTicketDraft } from '../server/geminiService';

async function testDraft() {
  const content = `
    Subject: Network Issue in Warehouse A
    Hi Team, 
    We are experiencing a major network outage in Warehouse A since 9:00 AM. 
    The main switch seems to be flickering. 
    We tried restarting it but no luck. 
    Users cannot access the ERP system. 
    Please check the logs at http://internal-dash/logs/warehouse-a.
    Error code: ERR_NET_TIMEOUT.
  `;

  try {
    const draft = await generateTicketDraft(content);
    console.log('AI Draft Result:', JSON.stringify(draft, null, 2));
  } catch (error: any) {
    console.error('Test Failed:', error.message);
  }
}

testDraft();
