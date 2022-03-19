import { useCallback, useRef } from 'react';

export function useNumberCycle(startingValue: number, changeValue: number, endValue: number) {
	const speed = useRef(startingValue);

	return useCallback(() => {
		const original = speed.current;

		speed.current = speed.current + changeValue;

		if (speed.current < endValue) {
			speed.current = startingValue;
		}

		return original;
	}, [startingValue, changeValue, endValue]);
}
