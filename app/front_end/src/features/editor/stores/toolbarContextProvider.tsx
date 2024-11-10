import { FileModel, FileTypes, GenesEnum } from '@/features/editor/types';
import React, { createContext, useState } from 'react';

export interface ToolbarContextProps {
  //
  // Universal state properties
  //
  saveTo: FileModel;
  override: boolean;
  saveToStateUpdate: (saveTo: FileModel, override?: boolean) => void;

  saveToError: string;
  saveToErrorStateUpdate: (saveToFileError: string) => void;

  //
  // Download state properties
  //
  gene: GenesEnum;
  geneStateUpdate: (gene: GenesEnum) => void;

  //
  // Merge state properties
  //
  lovdFile: FileModel | null;
  clinvarFile: FileModel | null;
  gnomadFile: FileModel | null;
  mergeStateUpdate: (lovdFile?: FileModel, clinvarFile?: FileModel, gnomadFile?: FileModel) => void;

  lovdError: string;
  lovdErrorStateUpdate: (lovdFileError: string) => void;
  clinvarError: string;
  clinvarErrorStateUpdate: (clinvarFileError: string) => void;
  gnomadError: string;
  gnomadErrorStateUpdate: (gnomadFileError: string) => void;

  //
  // Apply state properties
  //
  applyTo: FileModel | null;
  applyToStateUpdate: (applyTo: FileModel) => void;

  applyError: string;
  applyErrorStateUpdate: (applyError: string) => void;

  //
  // Align state properties
  //
  fastaFile: FileModel | null;
  fastqFileFolder: FileModel | null;
  alignStateUpdate: (fastaFile?: FileModel, fastqFileFolder?: FileModel) => void;

  fastaError: string;
  fastaErrorStateUpdate: (fastaFileError: string) => void;
  fastqError: string;
  fastqErrorStateUpdate: (fastqFileError: string) => void;
}

export const defaultSaveTo: FileModel = { id: '/', label: 'New file...', type: FileTypes.FILE };

export const ToolbarContext = createContext<ToolbarContextProps>({
  //
  // Universal state defaults
  //
  saveTo: defaultSaveTo, // Root directory (new file)
  override: false,
  saveToStateUpdate: () => {},

  saveToError: '',
  saveToErrorStateUpdate: () => {},

  //
  // Download state defaults
  //
  gene: GenesEnum.EYS,
  geneStateUpdate: () => {},

  //
  // Merge state defaults
  //
  lovdFile: null,
  clinvarFile: null,
  gnomadFile: null,
  mergeStateUpdate: () => {},

  lovdError: '',
  lovdErrorStateUpdate: () => {},
  clinvarError: '',
  clinvarErrorStateUpdate: () => {},
  gnomadError: '',
  gnomadErrorStateUpdate: () => {},

  //
  // Apply state defaults
  //
  applyTo: null,
  applyToStateUpdate: () => {},

  applyError: '',
  applyErrorStateUpdate: () => {},

  //
  // Align state defaults
  //
  fastaFile: null,
  fastqFileFolder: null,
  alignStateUpdate: () => {},

  fastaError: '',
  fastaErrorStateUpdate: () => {},
  fastqError: '',
  fastqErrorStateUpdate: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export const ToolbarContextProvider: React.FC<Props> = ({ children }) => {
  /***************
  State management 
  ***************/

  //
  // Universal state
  //
  const [saveTo, setSaveTo] = useState<FileModel>(defaultSaveTo);
  const [override, setOverride] = useState<boolean>(false);

  const saveToStateUpdate = (saveTo: FileModel, override?: boolean) => {
    setSaveTo(saveTo);
    if (override !== undefined) setOverride(override);
  };

  const [saveToError, setSaveToError] = useState<string>('');

  const saveToErrorStateUpdate = (saveToFileError: string) => {
    setSaveToError(saveToFileError);
  };

  //
  // Download state
  //
  const [gene, setGene] = useState<GenesEnum>(GenesEnum.EYS);

  const geneStateUpdate = (gene: GenesEnum) => {
    setGene(gene);
  };

  //
  // Merge state
  //
  const [lovdFile, setLovdFile] = useState<FileModel | null>(null);
  const [clinvarFile, setClinvarFile] = useState<FileModel | null>(null);
  const [gnomadFile, setGnomadFile] = useState<FileModel | null>(null);

  const mergeStateUpdate = (lovdFile?: FileModel, clinvarFile?: FileModel, gnomadFile?: FileModel) => {
    if (lovdFile) setLovdFile(lovdFile);
    if (clinvarFile) setClinvarFile(clinvarFile);
    if (gnomadFile) setGnomadFile(gnomadFile);
  };

  const [lovdError, setLovdError] = useState<string>('');

  const lovdErrorStateUpdate = (lovdFileError: string) => {
    setLovdError(lovdFileError);
  };

  const [clinvarError, setClinvarError] = useState<string>('');

  const clinvarErrorStateUpdate = (clinvarFileError: string) => {
    setClinvarError(clinvarFileError);
  };

  const [gnomadError, setGnomadError] = useState<string>('');

  const gnomadErrorStateUpdate = (gnomadFileError: string) => {
    setGnomadError(gnomadFileError);
  };

  //
  // Apply state
  //
  const [applyTo, setApplyTo] = useState<FileModel | null>(null);

  const applyToStateUpdate = (applyTo: FileModel) => {
    setApplyTo(applyTo);
  };

  const [applyError, setApplyError] = useState<string>('');

  const applyErrorStateUpdate = (applyError: string) => {
    setApplyError(applyError);
  };

  //
  // Align state
  //
  const [fastaFile, setFastaFile] = useState<FileModel | null>(null);
  const [fastqFileFolder, setFastqFileFolder] = useState<FileModel | null>(null);

  const alignStateUpdate = (fastaFile?: FileModel, fastqFileFolder?: FileModel) => {
    if (fastaFile) setFastaFile(fastaFile);
    if (fastqFileFolder) setFastqFileFolder(fastqFileFolder);
  };

  const [fastaError, setFastaError] = useState<string>('');

  const fastaErrorStateUpdate = (fastaFileError: string) => {
    setFastaError(fastaFileError);
  };

  const [fastqError, setFastqError] = useState<string>('');

  const fastqErrorStateUpdate = (fastqFileError: string) => {
    setFastqError(fastqFileError);
  };

  const ToolbarContextValue: ToolbarContextProps = {
    //
    // Universal state
    //
    saveTo,
    override,
    saveToStateUpdate,

    saveToError,
    saveToErrorStateUpdate,

    //
    // Download state
    //
    gene,
    geneStateUpdate,

    //
    // Merge state
    //
    lovdFile,
    clinvarFile,
    gnomadFile,
    mergeStateUpdate,

    lovdError,
    lovdErrorStateUpdate,
    clinvarError,
    clinvarErrorStateUpdate,
    gnomadError,
    gnomadErrorStateUpdate,

    //
    // Apply state
    //
    applyTo,
    applyToStateUpdate,

    applyError,
    applyErrorStateUpdate,

    //
    // Align state
    //
    fastaFile,
    fastqFileFolder,
    alignStateUpdate,

    fastaError,
    fastaErrorStateUpdate,
    fastqError,
    fastqErrorStateUpdate,
  };

  return <ToolbarContext.Provider value={ToolbarContextValue}>{children}</ToolbarContext.Provider>;
};
