import { AxiosError } from 'axios';
import { ENDPOINTS } from '../../types/constants';
import httpClient from '../httpClient';

export async function getUsers() {
	return await httpClient
		.get(ENDPOINTS.USERS)
		.then((res) => res.data)
		.catch((err) => {
			// Handle error
			console.error((err as AxiosError).code);
		});
}
