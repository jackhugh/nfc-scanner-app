import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import ImageColors from 'react-native-image-colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AmiiboData } from '../../api';
import { queryClient } from '../../apiClient';
import { TabParams } from '../../App';
import colors from '../../colors';
import AmiiboImage from '../../components/AmiiboImage';
import { callAsync, urlContentToDataUri } from '../../util';

type MutatedAmiiboProps = {
	amiiboId: string;
	inc: number;
	revertAmiiboMutation: () => void;
};

export default function MutatedAmiiboEntry({ amiiboId, inc, revertAmiiboMutation }: MutatedAmiiboProps) {
	const navigation = useNavigation<BottomTabNavigationProp<TabParams, 'modify'>>();

	const [imageDataUrl, setImageDataUrl] = useState<string>();
	const [backgroundColor, setBackgroundColor] = useState<string>();
	const amiibo = queryClient.getQueryData<AmiiboData>(['amiibo', { amiiboId }]);

	useEffect(() => {
		amiibo &&
			callAsync(async () => {
				const imageDataUrl = (await urlContentToDataUri(amiibo.imageData.imageURL)) as string;

				setImageDataUrl(imageDataUrl);
				const fallback = colors.highlight_1;
				try {
					const imageColors = await ImageColors.getColors(imageDataUrl, {
						cache: true,
						key: amiiboId,
						pixelSpacing: 50,
						fallback: fallback,
					});
					setBackgroundColor(imageColors.platform === 'android' ? imageColors.darkVibrant : fallback);
				} catch {
					setBackgroundColor(fallback);
				}
			});
	}, [amiibo]);

	const renderAction = () => (
		<RectButton style={styles.swipeComponent} onPress={revertAmiiboMutation} rippleColor='rgba(255,255,255,0.1)'>
			<Icon name='undo' color={colors.primaryText} size={22} />
			<Text style={styles.swipeComponentText}>undo</Text>
		</RectButton>
	);

	if (!(amiibo && imageDataUrl && backgroundColor)) return null;

	return (
		<Swipeable containerStyle={styles.container} renderRightActions={renderAction}>
			<RectButton
				onPress={() => navigation.navigate('lookup', { amiiboId: amiiboId })}
				style={[styles.button, { backgroundColor }]}
			>
				<AmiiboImage url={imageDataUrl} style={styles.image} />

				<View style={styles.contentContainer}>
					<Text style={styles.title}>{amiibo.appVars.name}</Text>
					<Text style={styles.textRow}>
						Action: {inc >= 0 ? '+' : null}
						{inc}
					</Text>
					<Text style={styles.textRow}>Quantity: {amiibo.appVars.quantity}</Text>
				</View>
			</RectButton>
		</Swipeable>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 15,
		overflow: 'visible',
	},
	button: {
		flexDirection: 'row',
		borderRadius: 10,
	},
	contentContainer: {
		padding: 10,
		alignItems: 'flex-start',
		flexShrink: 1,
	},
	image: {
		borderRadius: 10,
		width: '25%',
	},
	title: {
		fontSize: 22,
		fontFamily: 'nunitoBold',
		color: colors.primaryText,
		marginBottom: 'auto',
	},
	textRow: {
		fontSize: 16,
		fontFamily: 'nunito',
		color: colors.secondaryText,
	},
	swipeComponent: {
		width: '25%',
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	swipeComponentText: {
		color: colors.primaryText,
		fontFamily: 'nunitoBold',
		fontSize: 18,
		marginTop: 10,
	},
});
