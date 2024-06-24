import { Box, Typography, useTheme, IconButton, Button } from "@mui/material";
import { useLanguageContext } from "../../../contexts";
import { useEffect, useState } from "react";
import { useDeleteFile, useGetWorkspaceFiles, useUploadFile } from "../../../hooks";
import { useWorkspaceContext } from "../../../contexts/tool/UseWorkspaceContext";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileInput from "../../fileInput/FileInput";

const FileInstance: React.FC = () => {

    const Theme = useTheme();

    const languageContext = useLanguageContext();
    const workspaceContext = useWorkspaceContext();
    const deleteFile = useDeleteFile();
    const createFile = useUploadFile();


    const [files, setFiles] = useState<string[]>([]);
    const [file, setFile] = useState<string | ArrayBuffer | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const { data, isLoading, isFetching } = useGetWorkspaceFiles(workspaceContext.workspace as string);

    useEffect(() => {
        if (data?.files.length > 0) {
            setFiles(data.files);
        } else {
            setFiles([]);
        }
    }, [data]);

    const onFileSelect = (selectedFile: string | ArrayBuffer | null, name: string) => {
        setFile(selectedFile);
        setFileName(name);
    }

    const createNewFile = async () => {

        const binaryData = dataURLtoBlob(file);

        const data = new FormData();
        data.append('workspace', workspaceContext.workspace as string);
        data.append('file', binaryData);
        data.append('file_name', fileName);

        await createFile.mutateAsync(data);

        setFile(null);
        setFileName('');
    }

    const dataURLtoBlob = (file : string | ArrayBuffer | null) => {
        const stringFile = file as string;
        const arr = stringFile.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);

        if (!mimeMatch) {
            return new Blob();
        }
    
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    };

    return (
        <>
        {workspaceContext.workspace && !isLoading && !isFetching && (
            <>
                <Typography>{languageContext.language === 'en' ? 'Files' : 'Failai'}</Typography>
                <Box
                    sx={{
                        color: Theme.palette.text.secondary,
                        backgroundColor: Theme.palette.background.default,
                        borderRadius: '10px',
                        padding: '10px',
                        px: '10px',
                    }}
                >
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                    <FileInput onFileSelect={onFileSelect} />
                    {file && fileName && (fileName)}
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            color: Theme.palette.text.secondary,
                            backgroundColor: Theme.palette.background.default,
                            borderRadius: '10px',
                            height: '40px',
                            px: '10px',
                            marginBottom: '10px',
                            marginTop: '10px',
                        }}
                        fullWidth
                        disabled={!file || !fileName}
                        onClick={() => createNewFile()}
                    >
                        {languageContext.language === 'en' ? 'Upload file' : 'Įkelti failą'}
                    </Button>
                    {
                        files?.length > 0 ? (
                            files.map((file) => (
                                <Typography key={file}>
                                    {file}
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        size="small"
                                        onClick={ async () => {
                                            const data = {
                                                workspace: workspaceContext.workspace,
                                                file_name: file,
                                            } 

                                            await deleteFile.mutateAsync(data);
                                        }}
                                    >
                                        <DeleteForeverIcon sx={{ height: '30px' }} />
                                    </IconButton>
                                </Typography>
                            ))
                        ) : (
                        <Typography>{languageContext.language === 'en' ? 'No files' : 'Nėra failų'}</Typography>
                    )}
                </Box>
            </>
        )}
        </>
    );
}

export default FileInstance;