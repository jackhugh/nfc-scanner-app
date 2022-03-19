import { Animated, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../colors';

type PillSwitchSide = {
	id: string;
	text: string;
	color: string;
};

type PillSwitchProps<L extends PillSwitchSide, R extends PillSwitchSide> = {
	left: L;
	right: R;
	selected: L['id'] | R['id'];
	offset: Animated.AnimatedInterpolation;
	onPress: (button: L | R) => void;
};

export default function PillSwitch<L extends PillSwitchSide, R extends PillSwitchSide>({
	left,
	right,
	selected,
	offset,
	onPress,
}: PillSwitchProps<L, R>) {
	return (
		<Animated.View style={[styles.container, { transform: [{ translateY: offset }] }]}>
			<RectButton
				style={[styles.item, { backgroundColor: selected === left.id ? left.color : undefined }]}
				onPress={() => onPress(left)}
			>
				<Text style={styles.itemText}>{left.text}</Text>
			</RectButton>

			<RectButton
				style={[styles.item, { backgroundColor: selected === right.id ? right.color : undefined }]}
				onPress={() => onPress(right)}
			>
				<Text style={styles.itemText}>{right.text}</Text>
			</RectButton>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 9999,
		padding: 5,
		backgroundColor: colors.highlight_1,
		flexDirection: 'row',
		alignSelf: 'center',
		width: '70%',
		position: 'absolute',
		bottom: 40,
	},
	item: {
		padding: 10,
		flex: 1,
		borderRadius: 9999,
		overflow: 'hidden',
	},

	itemText: {
		color: colors.primaryText,
		fontFamily: 'nunitoBold',
		textAlign: 'center',
		fontSize: 22,
	},
});
