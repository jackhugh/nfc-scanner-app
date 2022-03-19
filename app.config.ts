import { ExpoConfig } from '@expo/config-types';

const environments = {
	development: {
		name: '[DEV] amiibo Scanner',
		package: 'com.jackhugh.amiiboscannerdev',
		color: '#2089dc',
	},
	preview: {
		name: '[PREVIEW] amiibo Scanner',
		package: 'com.jackhugh.amiiboscannerpreview',
		color: '#ae00ff',
	},
	production: {
		name: 'amiibo Scanner',
		package: 'com.jackhugh.amiiboscanner',
		color: '#ffa500',
	},
};

const APP_ENV = process.env.APP_ENV as keyof typeof environments;
const environment = environments[APP_ENV in environments ? APP_ENV : 'production'];

const config: ExpoConfig = {
	name: environment.name,
	slug: 'amiibo-scanner',
	version: '1.0.0',
	orientation: 'portrait',
	splash: {
		image: './src/assets/app/splash.png',
		resizeMode: 'contain',
		backgroundColor: environment.color,
	},
	primaryColor: '#000000',
	backgroundColor: '#000000',
	updates: {
		fallbackToCacheTimeout: 0,
		checkAutomatically: 'ON_ERROR_RECOVERY',
	},
	assetBundlePatterns: ['./src/assets/**/*'],
	android: {
		adaptiveIcon: {
			foregroundImage: './src/assets/app/adaptive-icon.png',
			backgroundColor: environment.color,
		},
		permissions: ['android.permission.NFC'],
		package: environment.package,
	},
	plugins: ['./src/plugins/withCompileSdkVersion31.js', 'react-native-nfc-manager'],
};

export default config;
