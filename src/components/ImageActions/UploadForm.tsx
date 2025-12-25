import React, { useRef, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GAEvent } from '../Utils/GA-Tracker';
import { MAX_IMAGE_SIZE_IN_MB, getFirstCategory } from '../../utils/helpers';
import { getUploadUrl, uploadToS3, processUpload } from '../../utils/apis';
import Categories from '../Utils/Categories';

interface uploadProps {}

const UploadForm: React.FunctionComponent<uploadProps> = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<FileList | null>(null);
  const [fileStatusSuccess, setFileStatusSuccess] = useState(true);
  const [fileStatusMsg, setFileStatusMsg] = useState('No file selected');
  const [description, setDescription] = useState('');
  const [categorySelected, setCategorySelected] = useState(
    getFirstCategory().tag
  );
  const [isBiotc, setIsBiotc] = useState(false);
  const [isPanorama, setIsPanorama] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  /* Request status state */
  const [requestStatusSuccess, setRequestStatusSuccess] = useState(false);
  const [requestStatusMsg, setRequestStatusMsg] = useState('');
  // We use mutation.isPending for processing state

  const {
    mutate: uploadImage,
    isPending: requestProcessing,
    isError: requestFailed,
    isSuccess: requestSuccess,
  } = useMutation({
    mutationFn: async ({
      file,
      imageName,
      metadata,
    }: {
      file: File;
      imageName: string;
      metadata: {
        imageName: string;
        resolution: string;
        category: string;
        biotc: boolean;
        panorama: boolean;
        portrait: boolean;
        description: string;
      };
    }) => {
      const { tokens } = await fetchAuthSession();
      if (!tokens?.idToken) throw new Error('No session');
      const idToken = tokens.idToken.toString();

      // Step 1: Get pre-signed URL for S3 upload
      const { uploadUrl, objectKey } = await getUploadUrl(
        idToken,
        imageName,
        file.type
      );

      // Step 2: Upload file directly to S3 (bypasses Lambda 6MB limit)
      const uploadSuccess = await uploadToS3(uploadUrl, file);
      if (!uploadSuccess) {
        throw new Error('S3 upload failed');
      }

      // Step 3: Trigger image processing
      const response = await processUpload(
        idToken,
        JSON.stringify({
          objectKey,
          ...metadata,
        })
      );

      if (!response.ok) {
        throw new Error('Processing failed');
      }
      return imageName;
    },
    onSuccess: (imageName) => {
      setRequestStatusSuccess(true);
      setRequestStatusMsg(`${imageName} uploaded successfully.`);
      GAEvent('Upload', categorySelected, 'successful');
      // Invalidate queries if necessary
      queryClient.invalidateQueries({ queryKey: ['images', categorySelected] });
    },
    onError: (error: any, variables) => {
      console.error('Upload failed with error: ', error);
      setRequestStatusSuccess(false);

      if (error.message === 'No session') {
        console.error('Authorization failed: No session');
      }

      setRequestStatusMsg(
        `Failed to upload ${variables.imageName}. Try again!`
      );
      GAEvent('Upload', categorySelected, 'failed');
    },
  });

  const openFileDialog = () => {
    fileRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles?.length) {
      if (selectedFiles[0].size <= MAX_IMAGE_SIZE_IN_MB * 1024 * 1024) {
        setFiles(selectedFiles);
        setFileStatusSuccess(true);
        setFileStatusMsg(`${selectedFiles[0].name} is selected`);
        descriptionRef.current?.focus();
      } else {
        setFiles(selectedFiles);
        setFileStatusSuccess(false);
        setFileStatusMsg(`Max file size: ${MAX_IMAGE_SIZE_IN_MB}MB`);
      }
    } else {
      setFiles(null);
      setFileStatusSuccess(true);
      setFileStatusMsg('No file selected');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (files && files.length !== 0 && description.length) {
      const file = files[0];
      const imageName = file.name;

      // Get image dimensions without base64 conversion
      const image = new window.Image();
      const objectUrl = window.URL.createObjectURL(file);

      image.onload = () => {
        window.URL.revokeObjectURL(objectUrl);

        const metadata = {
          imageName,
          resolution: `${image.width}:${image.height}`,
          category: categorySelected,
          biotc: isBiotc,
          panorama: isPanorama,
          portrait: isPortrait,
          description,
        };

        uploadImage({ file, imageName, metadata });
      };

      image.src = objectUrl;
    }
  };

  const renderTextArea = () => (
    <textarea
      placeholder='Give some description'
      ref={descriptionRef}
      value={description}
      onBlur={(event) => {
        const val = event.target.value.trim();
        setDescription(val);
        if (descriptionRef.current) {
          if (!val.length) descriptionRef.current.classList.add('error');
          else descriptionRef.current.classList.remove('error');
        }
      }}
      onChange={(event) => {
        const val = event.target.value;
        setDescription(val);
        if (descriptionRef.current) {
          if (!val.length) descriptionRef.current.classList.add('error');
          else descriptionRef.current.classList.remove('error');
        }
      }}
    ></textarea>
  );

  const renderCheckBoxToggles = () => (
    <div className='resolutionCbToggles'>
      <label htmlFor='biotcCb' className='mcCheckboxContainer'>
        <input
          type='checkbox'
          id='biotcCb'
          checked={isBiotc}
          onChange={(event) => setIsBiotc(event.target.checked)}
        />
        <div className='mcCheckboxHidden'></div>
        <span className='mcCheckboxLabel' title='Best Image of the Category'>
          Biotc
        </span>
      </label>
      <label htmlFor='portraitCb' className='mcCheckboxContainer'>
        <input
          type='checkbox'
          id='portraitCb'
          checked={isPortrait}
          onChange={(event) => {
            const isChecked = event.target.checked;
            setIsPortrait(isChecked);
            if (isChecked) setIsPanorama(false);
          }}
        />
        <div className='mcCheckboxHidden'></div>
        <span className='mcCheckboxLabel' title='Portrait'>
          Portrait
        </span>
      </label>
      <label htmlFor='panaromaCb' className='mcCheckboxContainer'>
        <input
          type='checkbox'
          id='panaromaCb'
          checked={isPanorama}
          onChange={(event) => {
            const isChecked = event.target.checked;
            setIsPanorama(isChecked);
            if (isChecked) setIsPortrait(false);
          }}
        />
        <div className='mcCheckboxHidden'></div>
        <span className='mcCheckboxLabel' title='Panorama'>
          Panorama
        </span>
      </label>
    </div>
  );

  const requestStarted = requestProcessing || requestFailed || requestSuccess;

  return (
    <div className='uploadOrSignInContainer'>
      <section className='upload-form'>
        <form onSubmit={handleSubmit}>
          <input
            type='button'
            value='Choose file to Upload'
            onClick={openFileDialog}
          />
          <span style={{ color: fileStatusSuccess ? 'black' : 'red' }}>
            {fileStatusMsg}
          </span>
          <input
            type='file'
            accept='image/*'
            ref={fileRef}
            onChange={handleChange}
            style={{ visibility: 'hidden' }}
            title='Choose file to Upload'
          />
          {renderTextArea()}
          <Categories
            onSelectCategory={(categoryTag) => {
              setCategorySelected(categoryTag);
            }}
          />
          {renderCheckBoxToggles()}
          <input
            type='submit'
            value='Upload'
            className={files?.length && description.length ? '' : 'disabled'}
          />
          {requestStarted && (
            <div className='requestStatus'>
              {requestProcessing && (
                <div>
                  <span className='processing'></span>
                  &nbsp;&nbsp;
                  <span> Processing...</span>
                </div>
              )}
              {!requestProcessing && (
                <div
                  className={`${requestStatusSuccess ? 'success' : 'error'}`}
                >
                  {requestStatusMsg}
                </div>
              )}
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default UploadForm;
