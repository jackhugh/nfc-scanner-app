import { useEffect } from 'react';
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../assets/icons/selection.json';
import colors from '../colors';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icons');

// We put this outside of the component so that all screens that use the component can transition seamlessly
const opacity = new Animated.Value(1);

export function useScanningIconAnimation() {
	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 0.5, useNativeDriver: false, duration: 1000, delay: 500 }),
				Animated.timing(opacity, { toValue: 1, useNativeDriver: false, duration: 1000 }),
			])
		).start();
	}, []);
}

type ScanningIconProps = { style?: StyleProp<ViewStyle> };

export default function ScanningIcon({ style }: ScanningIconProps) {
	return (
		<View style={style}>
			{/* <Animated.View style={{ opacity }}> */}
			<Icon style={styles.icon} name='scan-outline' />
			<Icon style={[styles.icon, styles.inset]} name='amiibo-wireframe-inset' />
			{/* </Animated.View> */}

			<Text style={styles.text}>scan amiibo</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	icon: {
		textAlign: 'center',
		fontSize: 140,
		fontFamily: 'icons',
		color: colors.accent,
		opacity: 0.7,
	},
	inset: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	text: {
		fontFamily: 'nunitoExtraBold',
		fontSize: 36,
		color: colors.primaryText,
		textAlign: 'center',
		marginTop: 40,
	},
});
