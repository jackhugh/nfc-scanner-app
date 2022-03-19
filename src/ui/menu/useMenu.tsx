import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { TabParams } from '../../App';
import Menu from './Menu';

export function useMenu(children?: React.ReactNode) {
	const navigation = useNavigation<BottomTabNavigationProp<TabParams>>();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <Menu>{children}</Menu>,
		});
	}, [children]);
}
