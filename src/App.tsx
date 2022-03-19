import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './apiClient';
import colors from './colors';
import { useUpdate } from './hooks/useUpdate';
import Lookup from './screens/lookup/Lookup';
import Modify from './screens/modify/Modify';
import SnackBar from './ui/Snackbar';

LogBox.ignoreAllLogs();

export type TabParams = {
	lookup: { amiiboId: string } | undefined;
	modify: undefined;
};

export const Tabs = createBottomTabNavigator<TabParams>();

export default function App() {
	const [fontsLoaded] = useFonts({
		nunito: require('./assets/fonts/Nunito-Regular.ttf'),
		nunitoBold: require('./assets/fonts/Nunito-Bold.ttf'),
		nunitoExtraBold: require('./assets/fonts/Nunito-ExtraBold.ttf'),
		icons: require('./assets/icons/icomoon.ttf'),
	});

	// useScanningIconAnimation();
	useUpdate();

	if (!fontsLoaded) return null;

	return (
		<>
			<StatusBar style='light' />

			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<NavigationContainer
						theme={{
							...DefaultTheme,
							colors: { ...DefaultTheme.colors, background: colors.primaryBackground },
						}}
					>
						<Tabs.Navigator
							backBehavior='history'
							initialRouteName='lookup'
							screenOptions={{
								headerStyle: styles.header,
								headerTitleStyle: styles.headerTitle,
								tabBarStyle: styles.tabBar,
								tabBarLabelStyle: styles.tabBarLabel,
								headerTintColor: colors.primaryText,
								tabBarActiveTintColor: colors.ready,
								tabBarInactiveTintColor: colors.secondaryText,
							}}
						>
							<Tabs.Screen
								name='lookup'
								component={Lookup}
								options={{
									title: 'Lookup',
									tabBarIcon: ({ color, size }) => <Icon name='search' size={size} color={color} />,
								}}
							/>
							<Tabs.Screen
								name='modify'
								component={Modify}
								options={{
									title: 'Modify',
									tabBarIcon: ({ color, size }) => <Icon name='edit' size={size} color={color} />,
								}}
							/>
						</Tabs.Navigator>

						<SnackBar />
					</NavigationContainer>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</>
	);
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: colors.secondaryBackground,
		shadowColor: 'transparent',
		elevation: 0,
	},
	headerTitle: {
		fontSize: 24,
		fontFamily: 'nunitoBold',
	},
	tabBar: {
		backgroundColor: colors.secondaryBackground,
		borderTopWidth: 0,
	},
	tabBarLabel: {
		// fontWeight: 'normal',
		// fontFamily: 'nunito',
	},
});
