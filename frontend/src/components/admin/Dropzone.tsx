import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoClose } from 'react-icons/io5';

interface props {
  initialImages: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const Dropzone = ({ initialImages, setImages, files, setFiles }: props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const mappedFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setFiles((current) => [...current, ...mappedFiles]);
    },
    [setFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-x-2">
        {initialImages.map((image, index) => (
          <button
            type="button"
            key={index}
            className="group relative h-52 w-40 cursor-pointer rounded border-2 border-gray-100  overflow-hidden"
            onClick={() => {
              setImages(
                initialImages.filter((selectedImage) => selectedImage !== image)
              );
            }}
          >
            <img
              src={image}
              alt=""
              className="rounded-md object-contain object-bottom"
            />
            <div className="group absolute inset-0 hidden h-full  w-full place-content-center place-items-center bg-gray-100 opacity-50 group-hover:flex">
              <IoClose className="animate-spin-fast-once text-7xl text-black " />
            </div>
          </button>
        ))}
        {files.map((file) => (
          <button
            type="button"
            key={file.name}
            className="group relative h-52 w-40 cursor-pointer overflow-hidden rounded border-2 border-gray-100"
            onClick={() => {
              setFiles(files.filter((f) => f.name !== file.name));
            }}
          >
            <img
              alt={file.name}
              src={(file as any).preview}
              className="rounded-md object-contain object-bottom"
              onLoad={() => {
                URL.revokeObjectURL((file as any).preview);
              }}
            />

            <div className="group absolute inset-0 hidden h-full  w-full place-content-center place-items-center bg-gray-100 opacity-50 group-hover:flex">
              <IoClose className="animate-spin-fast-once text-7xl text-black " />
            </div>
          </button>
        ))}
      </div>
      <div
        {...getRootProps()}
        className={`${isDragActive && 'bg-gray-100'} ${
          isDragReject && 'bg-red-100'
        } ${
          isDragAccept && 'bg-green-100'
        } gap-y flex h-[10rem] w-full cursor-pointer flex-col place-content-center place-items-center border-2 border-dashed border-gray-300 text-xl font-bold`}
      >
        <input {...getInputProps()} />
        {isDragReject ? (
          <p>Unsupported file type...</p>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <p>Drag 'n' drop some files here, or click here to select files</p>
          </>
        )}
        <p className="text-lg text-gray-300">
          (Only *.jpeg and *.png images will be accepted)
        </p>
      </div>
    </>
  );
};

export default Dropzone;
