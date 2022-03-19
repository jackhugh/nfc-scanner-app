import axios, { AxiosError } from 'axios';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { AmiiboData, fetchAmiiboData } from './api';
import colors from './colors';
import { AmiiboEntry } from './screens/modify/Modify';
import SnackBar from './ui/Snackbar';

const onError = (err: unknown) => {
	const error = (axios.isAxiosError(err) && (err.response?.data?.error as string)) || 'server error';
	SnackBar.setMessage({ text: error, color: colors.error });
};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: Infinity,
			staleTime: Infinity,
			onError,
		},
		mutations: {
			onError,
		},
	},
});

export function useAmiibo(amiiboId: string) {
	return useQuery(['amiibo', { amiiboId }], () => fetchAmiiboData(amiiboId, 0));
}

export function useAmiiboMutation() {
	return useMutation<AmiiboData, AxiosError, AmiiboEntry>(({ amiiboId, inc }) => fetchAmiiboData(amiiboId, inc), {
		onSuccess: (data, { amiiboId }) => {
			queryClient.setQueryData(['amiibo', { amiiboId }], data);
		},
	});
}
