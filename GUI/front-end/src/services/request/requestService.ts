import { ENDPOINTS } from "../../types/constants";
import httpClient from "../httpClient";


export async function sendRequest(request: string) {
    return await httpClient
        .post(ENDPOINTS.REQUEST, request)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
        });
}