import axios from 'axios';
import { getUniqueId } from 'react-native-device-info';
import colors from './colors';
import SnackBar from './ui/Snackbar';

const client = axios.create({ timeout: 5000 });

export type AmiiboData = {
	data: Record<string, unknown>;
	appVars: {
		game: string;
		series: string;
		number: string;
		name: string;
		quantity: number;
	};
	imageData: {
		imageURL: string;
	};
};

export async function fetchAmiiboData(amiiboId: string, inc: number) {
	SnackBar.setMessage({ text: 'processing...', color: colors.warning, autoClose: false });
	const { data } = await client.get<AmiiboData>('https://example.com', {
		params: { id: amiiboId, inc, device: getUniqueId() },
	});
	SnackBar.setMessage(null);
	return data;
}
