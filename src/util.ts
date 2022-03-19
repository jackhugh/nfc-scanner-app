export class UserError extends Error {}

export function wait(milliseconds: number) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), milliseconds);
	});
}

export function objectKeys<T extends object>(object: T) {
	return Object.keys(object) as (keyof T)[];
}

export async function urlContentToDataUri(url: string) {
	return fetch(url)
		.then((response) => response.blob())
		.then(
			(blob) =>
				new Promise<FileReader['result']>((resolve) => {
					const reader = new FileReader();
					reader.onload = function () {
						resolve(this.result);
					};
					reader.readAsDataURL(blob);
				})
		);
}

export async function callAsync<T>(func: () => Promise<T>) {
	return await func();
}
