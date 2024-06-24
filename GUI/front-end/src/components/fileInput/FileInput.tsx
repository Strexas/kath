import { Button } from "@mui/material";
import { useRef } from "react";
import { useLanguageContext } from "../../contexts";

function FileInput({ onFileSelect } : { onFileSelect: (file: string | ArrayBuffer | null, name: string) => void}){
    const languageContext = useLanguageContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0];

            if(!['text/plain'].includes(file.type)){
                alert('Please select a text file');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                onFileSelect(reader.result, file.name);
            };

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }

        
    };

    const onFileInputClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".txt"
                ref={inputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <Button
                variant="contained"
                onClick={onFileInputClick}
            >
                {languageContext.language === 'en' ? 'Select file' : 'Pasirinkti failą'}
            </Button>
        </div>
    );
}

export default FileInput;