import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { UserError } from '../util';

// Zero indexed start page to start reading id
const READ_PAGE = 21;

// First byte on page to start reading
const START_BYTE = 0;

// Number of bytes on page to read (max 16 starting on 0 with current implementation)
const BYTES_TO_READ = 8;

// Based on this example - https://github.com/revtel/react-native-nfc-manager#advanced-mifare-ultralight-usage
export async function scanAmiiboId() {
	// Cancel any outstanding requests as we can only have one at a time
	try {
		await NfcManager.cancelTechnologyRequest();
	} catch {}

	let nfcRequest: NfcTech | null;
	try {
		nfcRequest = await NfcManager.requestTechnology(NfcTech.MifareUltralight);
		if (nfcRequest === null) throw new Error();
	} catch {
		throw new NfcInterruptError();
	}
	if (nfcRequest !== NfcTech.MifareUltralight) throw new UserError('invalid amiibo');

	try {
		const data = await NfcManager.mifareUltralightHandlerAndroid.mifareUltralightReadPages(READ_PAGE);
		return (data as number[])
			.slice(START_BYTE, BYTES_TO_READ)
			.map((elem) => elem.toString(16).padStart(2, '0'))
			.join('');
	} catch {
		throw new UserError('read error');
	}
}

export class NfcInterruptError extends Error {}
