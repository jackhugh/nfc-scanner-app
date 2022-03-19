import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type AmiiboImageProps = { url?: string; style?: StyleProp<ImageStyle> };

export default function AmiiboImage({ url, style }: AmiiboImageProps) {
	return <Image style={[styles.image, style]} source={{ uri: url }} />;
}

const styles = StyleSheet.create({
	image: {
		borderRadius: 25,
		aspectRatio: 277 / 388,
		maxWidth: 277,
		maxHeight: 388,
	},
});
