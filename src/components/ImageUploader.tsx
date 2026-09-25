import React, { useState, useRef, useEffect } from 'react';
import style from './ImageUploader.module.css';
import { cl } from '@_linked/react/utils/ClassNames';
import { Spinner } from '@_linked/primitives/components/Spinner';

interface ImageUploaderProps {
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  aspectRatio?: number;
  className?: string;
  uploadIcon?: React.ReactNode;
  confirmText?: string;
  property?: string;
  onUploaded?: (dataUrl: string, format: string) => void;
  potentialValue?;
}

export const ImageUploader = ({
  thumbnailHeight,
  thumbnailWidth,
  aspectRatio = 8 / 4,
  className,
  uploadIcon,
  confirmText = 'Save',
  property,
  onUploaded,
  potentialValue,
}: ImageUploaderProps) => {
  const [image, setImage] = useState<string>(
    (potentialValue && potentialValue.contentUrl) || ''
  );
  const [fileName, setFileName] = useState<string>(
    (potentialValue && potentialValue?.contentUrl?.split('/').pop()) || ''
  );
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (potentialValue && potentialValue.contentUrl) {
      setImage(potentialValue?.contentUrl);
      setFileName(potentialValue?.contentUrl?.split('/').pop());
    }
  }, [potentialValue]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const format = file.type.split('/')[1];
        setImage(dataUrl);
        setFileName(file.name);
        setLoadingImage(false);
        if (onUploaded) {
          onUploaded(dataUrl, format);
        }
      };
      reader.readAsDataURL(file);
      setLoadingImage(true);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={style.Root}>
      <div
        className={cl(style.uploaderContainer, className)}
        style={{
          aspectRatio: aspectRatio ? aspectRatio : 'inherit',
          height: thumbnailHeight ? thumbnailHeight + 'px' : 'auto',
          width: thumbnailWidth ? thumbnailWidth + 'px' : 'auto',
        }}
        onClick={handleImageClick}
      >
        {loadingImage ? (
          <Spinner />
        ) : image ? (
          <img
            src={image}
            alt={fileName}
            className={cl(style.imageUpload)}
            style={{
              height: thumbnailHeight ? thumbnailHeight + 'px' : 'auto',
              aspectRatio: aspectRatio ? aspectRatio : 'inherit',
            }}
          />
        ) : (
          <label className={style.uploadLabel}>
            {uploadIcon ? uploadIcon : <span>Upload Image</span>}
          </label>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </div>
  );
};
