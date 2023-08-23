import { SECRET_GOOGLE_SHEETS_CREDENTIALS } from '$env/static/private';
import { google } from "googleapis";

const sheets = google.sheets('v4');

// Decode credentials from .env file
const credentials = JSON.parse(
	Buffer.from(SECRET_GOOGLE_SHEETS_CREDENTIALS, "base64").toString()
)

/**
 * Authenticates the Google Sheets API service account and binds the authentication token to further calls.
 */
export const initSheetsAuth = async () => {
	const auth = new google.auth.GoogleAuth({
		projectId: credentials.project_id,
		credentials: {
			client_email: credentials.client_email,
			private_key: credentials.private_key,
		},
		scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
	})

	const authClient = await auth.getClient();

	// Bind auth client to all further calls
	google.options({
		auth: authClient as any,
	})
} 

/**
 * Gets the values from the specified sheet and range
 * @param {string} spreadsheetId the id of the spreadsheet as given in the URL
 * @param {string} sheetName the name of the sheet within the spreadsheet document
 * @param {string} range 
 */
export const getSpreadSheetValues = async (spreadsheetId: string, sheetName: string, range: string) => {
	return await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: `${sheetName}!${range}`
	})
}