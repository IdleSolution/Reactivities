import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

// jsx instead of tsx because react-cropper has a lot of issues with typings as its not really mantained, I couldn't make it work otherwise

export const PhotoWidgetCropper = ({ setImage, imagePreview }) => {
    const cropper = useRef(null);

    const cropImage = () => {
        if (
            cropper.current &&
            typeof cropper.current.getCroppedCanvas() === 'undefined'
        ) {
            return;
        }
        cropper &&
            cropper.current &&
            cropper.current.getCroppedCanvas().toBlob((blob) => {
                setImage(blob);
            }, 'image/jpeg');
    };

    return (
        <Cropper
            ref={cropper}
            src={imagePreview}
            style={{ height: 200, width: '100%' }}
            // Cropper.js options
            aspectRatio={1 / 1}
            preview='.img-preview'
            guides={false}
            viewMode={1}
            dragMode='move'
            scalable={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            crop={cropImage}
        />
    );
};
