import { GenesEnum } from '@/features/editor/types';
import React, { createContext, useState } from 'react';

export interface ToolbarContextProps {
  //
  // Universal state properties
  //
  saveTo: string;
  override: boolean;
  saveToStateUpdate: (saveTo: string, override?: boolean) => void;

  //
  // Download state properties
  //
  gene: GenesEnum;
  geneStateUpdate: (gene: GenesEnum) => void;

  //
  // Merge state properties
  //
  lovdFile: string;
  clinvarFile: string;
  gnomadFile: string;
  mergeStateUpdate: (lovdFile: string, clinvarFile: string, gnomadFile: string) => void;

  lovdError: string;
  lovdErrorStateUpdate: (lovdFileError: string) => void;
  clinvarError: string;
  clinvarErrorStateUpdate: (clinvarFileError: string) => void;
  gnomadError: string;
  gnomadErrorStateUpdate: (gnomadFileError: string) => void;

  //
  // Apply state properties
  //
  applyTo: string;
  applyToStateUpdate: (applyTo: string) => void;

  applyError: string;
  applyErrorStateUpdate: (applyError: string) => void;
}

export const ToolbarContext = createContext<ToolbarContextProps>({
  //
  // Universal state defaults
  //
  saveTo: '/', // Root directory (new file)
  override: false,
  saveToStateUpdate: () => {},

  //
  // Download state defaults
  //
  gene: GenesEnum.EYS,
  geneStateUpdate: () => {},

  //
  // Merge state defaults
  //
  lovdFile: '',
  clinvarFile: '',
  gnomadFile: '',
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
  applyTo: '',
  applyToStateUpdate: () => {},

  applyError: '',
  applyErrorStateUpdate: () => {},
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
  const [saveTo, setSaveTo] = useState<string>('/');
  const [override, setOverride] = useState<boolean>(false);

  const saveToStateUpdate = (saveTo: string, override?: boolean) => {
    setSaveTo(saveTo);
    if (override !== undefined) setOverride(override);
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
  const [lovdFile, setLovdFile] = useState<string>('');
  const [clinvarFile, setClinvarFile] = useState<string>('');
  const [gnomadFile, setGnomadFile] = useState<string>('');

  const mergeStateUpdate = (lovdFile: string, clinvarFile: string, gnomadFile: string) => {
    setLovdFile(lovdFile);
    setClinvarFile(clinvarFile);
    setGnomadFile(gnomadFile);
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
  const [applyTo, setApplyTo] = useState<string>('');

  const applyToStateUpdate = (applyTo: string) => {
    setApplyTo(applyTo);
  };

  const [applyError, setApplyError] = useState<string>('');

  const applyErrorStateUpdate = (applyError: string) => {
    setApplyError(applyError);
  };

  const ToolbarContextValue: ToolbarContextProps = {
    //
    // Universal state
    //
    saveTo,
    override,
    saveToStateUpdate,

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
  };

  return <ToolbarContext.Provider value={ToolbarContextValue}>{children}</ToolbarContext.Provider>;
};
