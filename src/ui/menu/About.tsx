import { updateId } from 'expo-updates';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import colors from '../../colors';
import Button from '../Button';

type AboutProps = { isVisible: boolean; closeAbout: () => void };

export default function About({ isVisible, closeAbout }: AboutProps) {
	if (!isVisible) return null;

	const menuPositionAnimation = useRef(new Animated.Value(0)).current;
	const opacityAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (!isVisible) return;

		Animated.parallel([
			Animated.timing(menuPositionAnimation, {
				toValue: 1,
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
				useNativeDriver: false,
			}),
			Animated.timing(opacityAnimation, {
				toValue: 1,
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
				useNativeDriver: false,
			}),
		]).start();
	}, [isVisible]);

	return (
		<Modal transparent onRequestClose={closeAbout}>
			<Animated.View style={[styles.container, { opacity: opacityAnimation }]}>
				<TouchableOpacity style={styles.touchableBackground} onPress={closeAbout} />
				<Animated.View
					style={[
						styles.card,
						{
							top: menuPositionAnimation.interpolate({
								inputRange: [0, 1],
								outputRange: ['-20%', '-10%'],
							}),
						},
					]}
				>
					<Text style={styles.title}>App Info</Text>

					<View style={styles.row}>
						<View style={styles.rowTextContainer}>
							<Text style={styles.heading}>Device ID</Text>
							<Text style={styles.text}>{getUniqueId()}</Text>
						</View>
						{/* <Button style={styles.button}>Copy</Button> */}
					</View>

					{updateId ? (
						<View style={styles.row}>
							<View>
								<Text style={styles.heading}>Version</Text>
								<Text style={styles.text}>{updateId}</Text>
							</View>
						</View>
					) : null}

					<Button onPress={closeAbout} style={styles.button}>
						Close
					</Button>
				</Animated.View>
			</Animated.View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	touchableBackground: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	card: {
		borderRadius: 10,
		padding: 20,
		backgroundColor: colors.secondaryBackground,
		marginHorizontal: 30,
		elevation: 8,
	},
	title: {
		color: colors.primaryText,
		fontFamily: 'nunitoExtraBold',
		fontSize: 26,
		marginBottom: 20,
	},
	row: {
		flexDirection: 'row',
		marginBottom: 20,
		marginHorizontal: 10,
		alignItems: 'center',
	},
	rowTextContainer: {
		flexShrink: 1,
	},
	heading: {
		color: colors.primaryText,
		fontFamily: 'nunitoBold',
		fontSize: 17,
		width: 100,
		marginBottom: 5,
	},
	text: {
		color: colors.secondaryText,
		fontSize: 17,
		fontFamily: 'nunito',
	},
	button: {
		marginLeft: 'auto',
	},
});
