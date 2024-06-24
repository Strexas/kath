import { Select, useTheme, styled, MenuItem, TextField, Button, IconButton } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material/';
import { useLanguageContext } from "../../../contexts";
import { useWorkspaceContext } from "../../../contexts/tool/UseWorkspaceContext";
import { useEffect, useState } from "react";
import { useCreateWorkspace, useDeleteWorkspace, useGetWorkspaces } from "../../../hooks";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileInstance from "./FileInstance";

const WorkspaceInstance: React.FC = () => {
    const Theme = useTheme();

    const languageContext = useLanguageContext();
    const workspaceContext = useWorkspaceContext();

    const [awailableWorkspaces, setAwailableWorkspaces] = useState<string[]>([]);
    const [newWorkspace, setNewWorkspace] = useState<string>('');

    const { data, isLoading, isFetching } = useGetWorkspaces();
    const createWorkspace = useCreateWorkspace();
    const deleteWorkspace = useDeleteWorkspace();

    const createNewWorkspace = () => {
        createWorkspace.mutate(newWorkspace);
        workspaceContext.update(newWorkspace);
        setNewWorkspace('');
    }

    useEffect(() => {
        if (data?.workspaces.length > 0) {
            setAwailableWorkspaces(data.workspaces);
        } else {
            setAwailableWorkspaces([]);
        }
    }, [data]);

    return (
        <>
            <TextField
                variant="standard"
                sx={{
                    color: Theme.palette.text.secondary,
                    backgroundColor: Theme.palette.background.default,
                    borderRadius: '10px',
                    height: '40px',
                    px: '10px',
                }}
                label={languageContext.language === 'en' ? 'Create new workspace' : 'Pridėti darbo aplinką'}
                value={newWorkspace}
                onChange={(e) => setNewWorkspace(e.target.value)}
            />
            <Button
                variant="contained"
                sx={{
                    color: Theme.palette.text.secondary,
                    backgroundColor: Theme.palette.background.default,
                    borderRadius: '10px',
                    height: '40px',
                    px: '10px',
                }}
                onClick={() => createNewWorkspace()}
            >
                {languageContext.language === 'en' ? 'Create' : 'Sukurti'}
            </Button>
            {awailableWorkspaces.length > 0 && !isFetching && !isLoading && (
                <>
                <Select
                    variant="standard"
                    IconComponent={styled(ArrowDropDownIcon)({
                        width: '24px',
                        height: '24px',
                    })}
                    disableInjectingGlobalStyles={true}
                    disableUnderline={true}
                    sx={{
                        color: Theme.palette.text.secondary,
                        backgroundColor: Theme.palette.background.default,
                        borderRadius: '10px',
                        height: '40px',
                        px: '10px',
                    }}
                    value={workspaceContext.workspace || ''}
                    onChange={(e) => workspaceContext.update(e.target.value as string)}
                >
                     {
                        awailableWorkspaces.map((value) => (
                            <MenuItem
                                key={value}
                                value={value}
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                {value}
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    size="small"
                                    onClick={ async (e) => {
                                        e.stopPropagation();
                                        await deleteWorkspace.mutate(value);
                                        workspaceContext.update('');
                                    }}
                                >
                                    <DeleteForeverIcon sx={{ height: '40px' }} />
                                </IconButton>
                            </MenuItem>
                    ))}
                </Select>
                <FileInstance />
                </>
            )}
        </>
    );
}

export default WorkspaceInstance;