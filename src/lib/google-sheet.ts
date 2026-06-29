import fs from 'fs';
import path from 'path';

export interface LeadRowData {
  source: 'contact-page' | 'assistant-widget';
  timestamp: string;
  name: string;
  organization?: string;
  phone: string;
  email: string;
  requirement?: string;
  message?: string;
}

export async function appendToGoogleSheet(data: LeadRowData) {
  const dirPath = "C:\\Users\\sanjeev\\OneDrive\\Desktop\\cryo new website\\data store";
  const filePath = path.join(dirPath, "leads.csv");

  try {
    // Ensure data store directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const fileExists = fs.existsSync(filePath);

    // Escape values for CSV compatibility
    const escapeCsv = (val: string | undefined) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = ["Timestamp", "Source", "Name", "Organization", "Phone", "Email", "Requirement", "Message"];
    const row = [
      data.timestamp || new Date().toISOString(),
      data.source || '',
      data.name || '',
      data.organization || '',
      data.phone || '',
      data.email || '',
      data.requirement || '',
      data.message || ''
    ].map(escapeCsv).join(",");

    if (!fileExists) {
      const headerRow = headers.map(escapeCsv).join(",") + "\n";
      fs.writeFileSync(filePath, headerRow + row + "\n", 'utf8');
    } else {
      fs.appendFileSync(filePath, row + "\n", 'utf8');
    }

    console.log('Successfully saved lead to local Excel/CSV:', filePath);
    return { success: true, method: 'local-excel-csv', path: filePath };
  } catch (error: any) {
    console.error('Failed to write to local Excel/CSV file:', error);
    return { success: false, error: error.message };
  }
}
