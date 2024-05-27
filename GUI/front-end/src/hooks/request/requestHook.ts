import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sendRequest } from "../../services";

export const useSendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['request']});
        },
    });
};