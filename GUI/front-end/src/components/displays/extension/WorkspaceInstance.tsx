import { Select, useTheme, styled, MenuItem, Button, IconButton, Input, FormControl, InputLabel } from "@mui/material";
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
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
            <FormControl variant="standard" sx={{ marginBottom: '10px' }}>
                    {!newWorkspace && 
                    <InputLabel
                        htmlFor="new-workspace-input"
                        sx={{
                            color: Theme.palette.text.primary,
                            transform: 'translate(10px, 25px)',
                            zIndex: 1,
                        }}
                    >
                        {languageContext.language === 'en' ? 'Create new workspace' : 'Pridėti darbo aplinką'}
                    </InputLabel>}
                    <Input
                        id="new-workspace-input"
                        sx={{
                            color: Theme.palette.text.secondary,
                            backgroundColor: Theme.palette.background.default,
                            borderRadius: '10px',
                            height: '40px',
                            px: '10px',
                            zIndex: 0,
                        }}
                        disableUnderline={true}
                        value={newWorkspace}
                        onChange={(e) => setNewWorkspace(e.target.value)}
                    />
            </FormControl>
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
                disabled={!newWorkspace}
            >
                {languageContext.language === 'en' ? 'Create' : 'Sukurti'}
            </Button>
            {awailableWorkspaces.length > 0 && !isFetching && !isLoading && (
                <>
                <FormControl variant="standard" sx={{ marginBottom: '10px' }}>
                    {!workspaceContext.workspace && 
                        <InputLabel
                            htmlFor="new-workspace-input"
                            sx={{
                                color: Theme.palette.text.primary,
                                transform: 'translate(10px, 25px)',
                                zIndex: 1,
                            }}
                        >
                            {languageContext.language === 'en' ? 'Select workspace' : 'Pasirinkti darbo aplinką'}
                        </InputLabel>}
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
                        onOpen={() => setIsOpen(true)}
                        onClose={() => setIsOpen(false)}
                    >
                        {
                            awailableWorkspaces.map((value) => (
                                <MenuItem
                                    key={value}
                                    value={value}
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    {value}
                                    {isOpen &&
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
                                            <DeleteForeverIcon sx={{ height: '30px' }} />
                                        </IconButton>
                                    }
                                </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FileInstance />
                </>
            )}
        </>
    );
}

export default WorkspaceInstance;