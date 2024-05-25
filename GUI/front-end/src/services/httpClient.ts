import axios from 'axios';
import { API_URL } from '../types/constants';

const httpClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default httpClient;
