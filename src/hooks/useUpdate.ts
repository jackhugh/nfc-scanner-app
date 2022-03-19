import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import colors from '../colors';
import SnackBar from '../ui/Snackbar';
import { callAsync, wait } from '../util';

export function useUpdate() {
	useEffect(() => {
		const listener = () => {
			!__DEV__ &&
				callAsync(async () => {
					try {
						const update = await Updates.checkForUpdateAsync();
						if (!update.isAvailable) return;

						SnackBar.setMessage({ text: 'update downloading', color: colors.accent });
						await Promise.all([Updates.fetchUpdateAsync(), wait(1000)]);

						SnackBar.setMessage({ text: 'update ready - please restart', color: colors.warning });
					} catch (err) {
						SnackBar.setMessage({ text: 'error updating', color: colors.error });
					}
				});
		};
		AppState.addEventListener('focus', listener);
		return () => AppState.removeEventListener('focus', listener);
	}, []);
}
