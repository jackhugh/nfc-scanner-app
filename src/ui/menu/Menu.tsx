import { createContext, useContext, useState } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Menu as MaterialMenu, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../colors';
import { resolveDummyAmiibo } from '../../nfc/resolveDummyNfc';
import Button from '../Button';
import About from './About';

type MenuProps = { children?: React.ReactNode };

const MenuContext = createContext<{ closeMenu: () => void } | null>(null);

export default function Menu({ children }: MenuProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAbout, setShowAbout] = useState(false);

	return (
		<MenuContext.Provider value={{ closeMenu: () => setIsMenuOpen(false) }}>
			<MaterialMenu
				visible={isMenuOpen}
				anchor={
					<Button onPress={() => setIsMenuOpen(true)}>
						<Icon name='ellipsis-v' style={styles.ellipsis} />
					</Button>
				}
				onRequestClose={() => setIsMenuOpen(false)}
				style={styles.menu}
			>
				{children}

				{children ? <MenuDivider color='rgb(50,50,50)' /> : null}

				{__DEV__ ? <MenuItem onPress={resolveDummyAmiibo}>Dummy Amiibo</MenuItem> : null}

				<MenuItem onPress={() => setShowAbout((prev) => !prev)}>About</MenuItem>
			</MaterialMenu>

			<About isVisible={showAbout} closeAbout={() => setShowAbout(false)} />
		</MenuContext.Provider>
	);
}

type MenuItemProps = { children: string } & React.ComponentProps<typeof Button>;

export function MenuItem({ onPress, ...props }: MenuItemProps) {
	const menu = useContext(MenuContext);
	const onPressWithClose = (e: GestureResponderEvent) => {
		onPress?.(e);
		menu?.closeMenu();
	};

	return (
		<Button style={styles.item} textStyle={styles.text} uppercase={false} onPress={onPressWithClose} {...props} />
	);
}

const styles = StyleSheet.create({
	menu: {
		backgroundColor: colors.highlight_1,
		borderRadius: 10,
		overflow: 'hidden',
	},
	heading: {
		fontFamily: 'nunitoBold',
		padding: 15,
	},
	item: {
		minWidth: 150,
	},
	text: {
		color: colors.primaryText,
		fontFamily: 'nunitoBold',
		fontSize: 16,
	},
	ellipsis: {
		fontSize: 20,
		color: colors.primaryText,
		height: '100%',
		textAlign: 'center',
		textAlignVertical: 'center',
		aspectRatio: 1,
	},
});
