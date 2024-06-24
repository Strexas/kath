import { ENDPOINTS } from "../../types/constants";
import httpClient from "../httpClient";


export async function sendRequest(data: { content: string, workspace: string | null}) {
    return await httpClient
        .post(ENDPOINTS.REQUEST, data)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
        });
}