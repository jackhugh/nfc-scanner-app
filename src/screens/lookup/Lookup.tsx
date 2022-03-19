import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TabParams } from '../../App';
import colors from '../../colors';
import ScanningIcon from '../../components/ScanningIcon';
import { useDummyAmiibo } from '../../nfc/resolveDummyNfc';
import { useScannedAmiibo } from '../../nfc/useScannedAmiibo';
import { useMenu } from '../../ui/menu/useMenu';
import SnackBar from '../../ui/Snackbar';
import AmiiboDataView from './AmiiboDataView';

export type LookupProps = BottomTabScreenProps<TabParams, 'lookup'>;

export default function Lookup({ route, navigation }: LookupProps) {
	const amiiboId = route.params?.amiiboId;

	useMenu();

	const onAmiiboScan = useCallback((amiiboId) => {
		SnackBar.setMessage(null);
		navigation.navigate('lookup', { amiiboId });
	}, []);

	useScannedAmiibo(onAmiiboScan);
	useDummyAmiibo(onAmiiboScan);

	const scrollView = useRef<ScrollView>(null);

	useEffect(() => {
		scrollView.current?.scrollTo({ y: 0 });
	}, [amiiboId]);

	if (!amiiboId) return <ScanningIcon style={{ marginTop: '35%' }} />;

	return (
		<View style={styles.container}>
			<ScrollView ref={scrollView} contentContainerStyle={styles.scrollContainer}>
				<AmiiboDataView amiiboId={amiiboId} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primaryBackground,
		flex: 1,
	},
	scrollContainer: {
		padding: 20,
	},
});
