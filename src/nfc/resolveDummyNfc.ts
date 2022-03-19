import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { callAsync } from '../util';

let nextAmiibo = 0;
const cycleAmiibo = () => {
	const amiibos = ['03ee0001008b0502', '0100000003530902', '0183000100450502', '0000000000340102'];
	return amiibos[nextAmiibo++ % amiibos.length];
};

let resolve = () => {};
export const resolveDummyAmiibo = () => resolve();

export function useDummyAmiibo(callback: (id: string) => Promise<void> | void) {
	if (!__DEV__) return;

	useFocusEffect(
		useCallback(() => {
			let reject: () => void;
			callAsync(async () => {
				const scanLoop = async () => {
					try {
						const id = await new Promise<string>((res, rej) => {
							resolve = () => res(cycleAmiibo());
							reject = rej;
						});
						await callback(id);
					} catch {
						return;
					}
					scanLoop();
				};
				scanLoop();
			});

			return () => {
				reject();
			};
		}, [callback])
	);
}
