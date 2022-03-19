import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import colors from '../colors';

type ButtonProps = {
	children?: React.ReactNode;
	textStyle?: StyleProp<TextStyle>;
	uppercase?: boolean;
	style?: StyleProp<ViewStyle>;
} & React.ComponentProps<typeof Pressable>;

export default function Button({ children, textStyle, style, uppercase: capitilize = true, ...props }: ButtonProps) {
	return (
		<View style={[styles.view, style]}>
			<Pressable style={styles.button} android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }} {...props}>
				{typeof children === 'string' ? (
					<Text style={[styles.text, { textTransform: capitilize ? 'uppercase' : undefined }, textStyle]}>
						{children}
					</Text>
				) : (
					children
				)}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		overflow: 'hidden',
		borderRadius: 10,
	},
	button: {
		borderRadius: 10,
	},
	text: {
		padding: 16,
		fontSize: 16,
		color: colors.accent,
		fontFamily: 'nunitoBold',
	},
});
