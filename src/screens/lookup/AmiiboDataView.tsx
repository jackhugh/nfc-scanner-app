import { StyleSheet, Text, View } from 'react-native';
import { useAmiibo } from '../../apiClient';
import colors from '../../colors';
import AmiiboImage from '../../components/AmiiboImage';
import { objectKeys } from '../../util';

type AmiiboDataViewProps = { amiiboId: string };

export default function AmiiboDataView({ amiiboId }: AmiiboDataViewProps) {
	const { data: amiibo } = useAmiibo(amiiboId);
	if (!amiibo) return null;

	const textRows = objectKeys(amiibo.data)
		.map((key) => ({ key, text: amiibo.data[key] }))
		.filter((elem): elem is { key: string; text: string | number } =>
			['string', 'number'].includes(typeof elem.text)
		);

	return (
		<View>
			<AmiiboImage url={amiibo.imageData.imageURL} style={styles.amiiboImage} />

			<View style={styles.textContentContainer}>
				<Text style={styles.title}>{amiibo.appVars.name}</Text>

				{textRows.map((row, i) => (
					<View
						key={row.key}
						style={[
							styles.itemContainer,
							{
								backgroundColor: i % 2 ? colors.highlight_1 : colors.highlight_2,
								borderBottomLeftRadius: i === textRows.length - 1 ? 25 : 0,
								borderBottomRightRadius: i === textRows.length - 1 ? 25 : 0,
							},
						]}
					>
						<Text style={[styles.itemText, styles.itemTitle]}>{row.key}</Text>
						<Text style={styles.itemText}>{row.text}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	amiiboImage: {
		width: '90%',
		marginBottom: 20,
		alignSelf: 'center',
	},
	textContentContainer: {
		backgroundColor: colors.highlight_1,
		borderRadius: 25,
		alignSelf: 'stretch',
	},
	title: {
		color: colors.primaryText,
		fontSize: 26,
		fontFamily: 'nunitoExtraBold',
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	itemContainer: {
		paddingBottom: 5,
		paddingHorizontal: 10,
	},
	itemTitle: {
		fontFamily: 'nunitoBold',
		color: colors.primaryText,
	},
	itemText: {
		color: colors.secondaryText,
		fontFamily: 'nunito',
		fontSize: 18,
	},
});
