import { nanoid } from 'nanoid/non-secure';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useAmiiboMutation } from '../../apiClient';
import colors from '../../colors';
import ScanningIcon from '../../components/ScanningIcon';
import { useDummyAmiibo } from '../../nfc/resolveDummyNfc';
import { useScannedAmiibo } from '../../nfc/useScannedAmiibo';
import { MenuItem } from '../../ui/menu/Menu';
import { useMenu } from '../../ui/menu/useMenu';
import PillSwitch from '../../ui/PillSwitch';
import SnackBar from '../../ui/Snackbar';
import MutatedAmiiboEntry from './MutatedAmiiboEntry';

export type AmiiboEntry = { amiiboId: string; entryId: string; inc: number };

const mutateTypes = {
	add: {
		text: 'Add',
		action: 'added',
		inc: 1,
	},
	remove: {
		text: 'Remove',
		action: 'removed',
		inc: -1,
	},
};

export default function Modify() {
	const [amiiboEntries, setAmiiboEntries] = useState<AmiiboEntry[]>([]);
	const [mutateType, setMutateType] = useState<keyof typeof mutateTypes>('add');
	const amiiboMutation = useAmiiboMutation();

	useMenu(useMemo(() => <MenuItem onPress={() => setAmiiboEntries([])}>Clear Entries</MenuItem>, []));

	const onAmiiboScan = useCallback(
		async (amiiboId) => {
			try {
				const entry = { amiiboId, inc: mutateTypes[mutateType].inc, entryId: nanoid() };

				await amiiboMutation.mutateAsync(entry);
				SnackBar.setMessage({ text: mutateTypes[mutateType].action, color: colors.success });

				setAmiiboEntries((prev) => [...prev, entry]);
			} catch {}
		},
		[mutateType]
	);

	useScannedAmiibo(onAmiiboScan);
	useDummyAmiibo(onAmiiboScan);

	const revertAmiiboMutation = (entry: AmiiboEntry) => () => {
		amiiboMutation.mutate({ ...entry, inc: -entry.inc });
		setAmiiboEntries((prev) => prev.filter((elem) => elem.entryId !== entry.entryId));
	};

	const scrollPosition = useRef(new Animated.Value(0)).current;

	const pillBarMoveHeight = 200;
	const scrollClamped = Animated.diffClamp(scrollPosition, 0, pillBarMoveHeight / 2);
	const offset = scrollClamped.interpolate({
		inputRange: [0, pillBarMoveHeight],
		outputRange: [0, pillBarMoveHeight],
	});

	const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollPosition } } }], {
		useNativeDriver: true,
	});

	return (
		<View style={styles.container}>
			{amiiboEntries.length ? (
				<Animated.FlatList<AmiiboEntry>
					contentContainerStyle={styles.entriesContainer}
					data={[...amiiboEntries].reverse()}
					keyExtractor={(amiiboEntry) => amiiboEntry.entryId}
					onScroll={onScroll}
					// onMomentumScrollEnd={() => {
					// 	Animated.timing(offset, { toValue: 0, useNativeDriver: true, duration: 300 });
					// }}
					renderItem={({ item }) => (
						<MutatedAmiiboEntry
							inc={item.inc}
							amiiboId={item.amiiboId}
							revertAmiiboMutation={revertAmiiboMutation(item)}
						/>
					)}
				/>
			) : (
				<ScanningIcon style={{ marginTop: '35%' }} />
			)}

			<PillSwitch
				left={{ id: 'add', text: mutateTypes.add.text, color: colors.accent }}
				right={{ id: 'remove', text: mutateTypes.remove.text, color: colors.error }}
				selected={mutateType}
				offset={offset}
				onPress={(selected) => setMutateType(selected.id as keyof typeof mutateTypes)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primaryBackground,
		flex: 1,
	},
	entriesContainer: {
		paddingHorizontal: 15,
		paddingTop: 15,
	},
});
