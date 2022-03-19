import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import NfcManager from 'react-native-nfc-manager';
import colors from '../colors';
import SnackBar from '../ui/Snackbar';
import { callAsync, UserError } from '../util';
import { NfcInterruptError, scanAmiiboId } from './scanAmiiboId';

export function useScannedAmiibo(callback: (id: string) => Promise<void> | void) {
	useFocusEffect(
		useCallback(() => {
			callAsync(async () => {
				if (!(await NfcManager.isSupported())) {
					!__DEV__ && SnackBar.setMessage({ text: 'NFC not supported', color: colors.error });
					return;
				}

				await NfcManager.start();

				const scanLoop = async () => {
					try {
						const id = await scanAmiiboId();
						await callback(id);
					} catch (err) {
						if (err instanceof NfcInterruptError) {
							return;
						} else if (err instanceof UserError) {
							SnackBar.setMessage({ text: err.message, color: colors.error });
						} else {
							SnackBar.setMessage({ text: 'error', color: colors.error });
						}
					}
					scanLoop();
				};

				scanLoop();
			});

			return () => {
				NfcManager.cancelTechnologyRequest();
			};
		}, [callback])
	);
}
