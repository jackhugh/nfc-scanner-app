import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import colors from '../colors';

type SnackBarInfo = { text: string; color: string; autoClose?: boolean };
type SnackBarAction = { buttonText: string; buttonAction: () => void } & SnackBarInfo;
type SnackBarMessage = SnackBarInfo | SnackBarAction | null;

type SnackBarState = {
	message: SnackBarMessage | null;
};
type SnackBarProps = {};

export default class SnackBar extends React.Component<SnackBarProps, SnackBarState> {
	private static subscribers: ((message: SnackBarMessage) => void)[] = [];

	static setMessage(message: SnackBarMessage) {
		this.subscribers.forEach((subscriber) => subscriber(message));
	}
	static subscribe(handler: (message: SnackBarMessage) => void) {
		this.subscribers.push(handler);
	}
	static unsubscribe(handler: (message: SnackBarMessage) => void) {
		this.subscribers = this.subscribers.filter((elem) => elem !== handler);
	}

	readonly MESSAGE_DURATION = 2000;

	state: SnackBarState = {
		message: null,
	};

	posAnimation = new Animated.Value(100);

	timer: NodeJS.Timeout | null = null;

	constructor(props: SnackBarProps) {
		super(props);
		this.subscribeHandler = this.subscribeHandler.bind(this);
	}

	subscribeHandler(message: SnackBarMessage) {
		this.setState({ message });
	}

	componentDidMount() {
		SnackBar.subscribe(this.subscribeHandler);
	}

	componentWillUnmount() {
		SnackBar.unsubscribe(this.subscribeHandler);
	}

	componentDidUpdate(prevProps: SnackBarProps, prevState: SnackBarState) {
		if (prevState.message !== this.state.message) {
			this.timer && clearTimeout(this.timer);
			this.animate();
		}
	}

	animate() {
		if (!this.state.message) return;

		Animated.timing(this.posAnimation, {
			toValue: 0,
			duration: 200,
			useNativeDriver: false,
		}).start();

		if (this.state.message.autoClose === false) return;

		this.timer = setTimeout(() => {
			Animated.timing(this.posAnimation, {
				toValue: 100,
				duration: 200,
				useNativeDriver: false,
			}).start();
		}, this.MESSAGE_DURATION);
	}

	render() {
		if (!this.state.message) return null;

		return (
			<View style={styles.positionContainer}>
				<Animated.View
					style={[
						styles.mainContainer,
						{
							backgroundColor: this.state.message.color,
							bottom: this.posAnimation.interpolate({
								inputRange: [0, 100],
								outputRange: ['0%', '-100%'],
							}),
						},
					]}
				>
					<Text style={styles.text}>{this.state.message.text}</Text>
				</Animated.View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	positionContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	mainContainer: {
		padding: 12,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: colors.primaryText,
	},
});
