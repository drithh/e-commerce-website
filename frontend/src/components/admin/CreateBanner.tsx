import { useCallback, useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';

import { ApiError, BannerService } from '../../api';
import Button from '../button/Button';
import Dropdown from '../input/Dropdown';
import Input from '../input/Input';
import { convertToBase64 } from '../util/utilFunc';

const CreateBanner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [textPosition, setTextPosition] = useState('left');
  const [image, setImage] = useState<string>('');
  const [file, setFile] = useState<File>(new File([], ''));

  const createBanner = useMutation(
    (variables: {
      title: string;
      url_path: string;
      text_position: string;
      image: string;
    }) =>
      BannerService.createBanner({
        title: variables.title,
        url_path: variables.url_path,
        text_position: variables.text_position,
        image: variables.image,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('banners');
        navigate('/admin/banners');
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageString = file.size
      ? ((await convertToBase64(file)) as string)
      : image === ''
      ? 'delete'
      : '';
    createBanner.mutate({
      title,
      url_path: urlPath,
      text_position: textPosition,
      image: imageString,
    });
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Create Banner</h2>
      <div className="flex py-3 ">
        <Link to="/admin/banners" className="flex place-items-center  gap-x-2">
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <div className="">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <Input
            name="name"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="urlPath" className="text-lg">
            Url Path
          </label>
          <Input
            name="urlPath"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={urlPath}
            onChange={(e) => setUrlPath((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <div className="mb-2 text-lg">Text Position</div>
          <Dropdown
            selected={textPosition}
            setSelected={setTextPosition}
            width="w-64"
            border="border-2 border-gray-400"
            options={['left', 'right']}
          />
        </div>
        <div className=" border-2 border-gray-400 p-4">
          <Dropzone
            initialImage={image}
            setImage={setImage}
            file={file}
            setFile={setFile}
          />
        </div>
        <div className="mt-8 flex place-content-between">
          <button
            type="button"
            onClick={() => navigate('/admin/banners')}
            className="mb-4 w-52 border border-gray-500 py-3 px-6 text-center text-xl hover:bg-gray-500  hover:text-gray-100 sm:py-2 sm:text-base"
            aria-label="Cancel Banner"
          >
            Cancel
          </button>
          <Button
            type="submit"
            value="Create Banner"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

interface props {
  initialImage: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File>>;
}

const Dropzone = ({ initialImage, setImage, file, setFile }: props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const mappedFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setFile(mappedFiles[0]);
    },
    [setFile]
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
      'image/webp': [],
    },
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-x-2">
        {file.name && (
          <button
            type="button"
            key={file.name}
            className="group relative h-40 w-52 cursor-pointer overflow-hidden rounded border-2 border-gray-100"
            onClick={() => {
              setFile(new File([], ''));
            }}
          >
            <img
              alt={file.name}
              src={(file as any).preview}
              className="rounded-md object-contain"
              onLoad={() => {
                URL.revokeObjectURL((file as any).preview);
              }}
            />

            <div className="group absolute inset-0 hidden h-full  w-full place-content-center place-items-center bg-gray-100 opacity-50 group-hover:flex">
              <IoClose className="animate-spin-fast-once text-7xl text-black " />
            </div>
          </button>
        )}
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
          (Only *.jpeg *.png and *.webp images will be accepted)
        </p>
      </div>
    </>
  );
};

export default CreateBanner;
