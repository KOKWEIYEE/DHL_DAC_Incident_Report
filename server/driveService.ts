import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function getDriveClient() {
  const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (credentialsJson) {
    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      SCOPES
    );
    return google.drive({ version: 'v3', auth });
  }

  if (apiKey) {
    return google.drive({ version: 'v3', auth: apiKey });
  }

  // Mock data for mockup/testing purposes if no keys are provided
  return null;
}

export async function listRecentFiles(folderId: string) {
  const drive = getDriveClient();
  
  if (!drive) {
    // Return mock data for the mockup
    return [
      { id: 'mock-1', name: 'Server_Down_Report.txt', createdTime: new Date().toISOString() },
      { id: 'mock-2', name: 'Logistics_Delay_Email.txt', createdTime: new Date().toISOString() },
    ];
  }

  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 10,
    });
    return response.data.files || [];
  } catch (error) {
    console.error('Error listing Drive files:', error);
    return []; // Return empty instead of crashing for mockup
  }
}

export async function getFileContent(fileId: string) {
  if (fileId.startsWith('mock-')) {
    return fileId === 'mock-1' 
      ? "Incident: Server in Warehouse B is unresponsive. Started at 2 PM. Multiple shipments affected."
      : "Subject: Logistics Delay. Our truck is stuck in traffic. Expected delay: 4 hours.";
  }

  const drive = getDriveClient();
  if (!drive) throw new Error('No Drive client configured.');

  try {
    const file = await drive.files.get({ fileId, fields: 'mimeType, name' });
    const mimeType = file.data.mimeType;

    if (mimeType === 'application/vnd.google-apps.document') {
      const res = await drive.files.export({ fileId, mimeType: 'text/plain' });
      return res.data as string;
    }

    const res = await drive.files.get({ fileId, alt: 'media' });
    return res.data as string;
  } catch (error) {
    console.error('Error fetching Drive content:', error);
    throw error;
  }
}
