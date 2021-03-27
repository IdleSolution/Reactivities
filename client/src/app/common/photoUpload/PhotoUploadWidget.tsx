import React, { Fragment, useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import { PhotoWidgetDropzone } from './PhotoWidgetDropzone';
import { PhotoWidgetCropper } from './PhotoWidgetCropper';
import { observer } from 'mobx-react-lite';

interface IProps {
    uploadPhoto: (file: Blob) => void;
    uploadingPhoto: boolean
}

export const PhotoUploadWidget: React.FC<IProps> = observer(({uploadPhoto, uploadingPhoto}) => {
    const [file, setFile] = useState<any>({});
    const [image, setImage] = useState<Blob | null>(null);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(file);
        }
    })

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 1 - Add Photo' />
                    <PhotoWidgetDropzone setFile={setFile} />
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Step 2 - Resize Image' />
                    {file && (
                        <PhotoWidgetCropper setImage={setImage} imagePreview={file.preview}/>
                    )}
                </Grid.Column>
                <Grid.Column width={1} />
                <Grid.Column width={4}>
                    <Header color='teal' sub content='Preview & Upload' />
                    {file && (
                        <Fragment>
                            <div className='img-preview' style={{minHeight: '200px', overflow: 'hidden'}}/>
                            <Button.Group widths={2}>
                                <Button positive icon='check' loading={uploadingPhoto} onClick={() => uploadPhoto(image!)}/>
                                <Button icon='close' disabled={uploadingPhoto} onClick={() => null}/>
                            </Button.Group>
                        </Fragment>
                    )}
                </Grid.Column>
            </Grid>
        </Fragment>
    )
})
