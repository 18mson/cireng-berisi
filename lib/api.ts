const SHEET_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

export const getSheetUrl = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
  if (!apiKey) {
    throw new Error("Google Sheets API key not found");
  }
  return `${SHEET_BASE_URL}/${sheetId}/values/Sheet1?key=${apiKey}`;
};