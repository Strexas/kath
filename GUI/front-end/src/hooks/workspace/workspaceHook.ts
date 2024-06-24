import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createWorkspace, getWorkspaces, getWorkspaceFiles, deleteWorkspace, uploadFile, deleteFile } from "../../services";

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace'] });
        },
    });
};

export const useGetWorkspaces = () => {
    return useQuery({
        queryKey: ['workspace'],
        queryFn: getWorkspaces,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });
};

export const useGetWorkspaceFiles = (workspace: string) => {
    return useQuery({
        queryKey: ['workspaceFiles', workspace],
        queryFn: getWorkspaceFiles,
        refetchOnWindowFocus: false,
        refetchInterval: false,
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace'] });
        },
    });
};

export const useUploadFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] });
        },
    });
}

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaceFiles'] });
        },
    });
}