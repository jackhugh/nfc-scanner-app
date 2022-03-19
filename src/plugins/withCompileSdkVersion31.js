const { WarningAggregator, withProjectBuildGradle } = require('@expo/config-plugins');

const withCompileSdkVersion = (conf) => {
	return withProjectBuildGradle(conf, (config) => {
		if (config.modResults.language === 'groovy') {
			config.modResults.contents = setCompileSdkVersion(config.modResults.contents);
		} else {
			throw new Error("Can't set compileSdkVersion in the project build.gradle, because it's not groovy");
		}
		return config;
	});
};

const setCompileSdkVersion = (buildGradle) => {
	const name = 'compileSdkVersion';
	const minVersion = 31;

	const regex = new RegExp(`(${name}\\s?=\\s?)(\\d+(?:\\.\\d+)?)`);
	const currentVersion = buildGradle.match(regex)?.[2];
	if (!currentVersion) {
		WarningAggregator.addWarningAndroid(
			'withBuildScriptExtVersion',
			`Cannot set minimum buildscript.ext.${name} version because the property "${name}" cannot be found or does not have a numeric value.`
		);
		return buildGradle;
	}

	const currentVersionNum = Number(currentVersion);
	return buildGradle.replace(regex, `$1${Math.max(minVersion, currentVersionNum)}`);
};

module.exports = withCompileSdkVersion;
