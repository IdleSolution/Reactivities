import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

interface IProps {
    setFile: (file: object) => void;
}

const dropzoneStyles = {
    border: 'dashed 3px',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingTop: '30px',
    textAlign: 'center' as 'center',
    height: '200px'
};

const dropzoneActive = {
    borderColor: 'green'
};

export const PhotoWidgetDropzone: React.FC<IProps> = ({ setFile }) => {
    const onDrop = useCallback(acceptedFiles => {
        setFile(Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0])
        }))
    }, [setFile])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={isDragActive ? {...dropzoneStyles, ...dropzoneActive} : dropzoneStyles}>
            <input {...getInputProps()} />
            <Icon name='upload' size='huge'/>
            <Header content='Drop image here'/>
        </div>
    )
}