import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  AiOutlineCamera,
  AiOutlineLoading3Quarters,
  AiOutlineSearch,
} from 'react-icons/ai';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ApiError, SearchService } from '../api';
import { useSearch } from '../context/SearchContext';
import { convertToBase64 } from './util/utilFunc';

const Search = () => {
  const { search, setSearch } = useSearch();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setSearch);
  const [searchText, setSearchText] = useState('');
  const [searchImage, setSearchImage] = useState(false);

  const { data } = useQuery(
    ['search', searchText],
    () => SearchService.searchText(searchText),
    {
      enabled: searchText.length > 0,
      staleTime: Infinity,
    }
  );

  const searchProduct = (productId: string) => {
    setSearch!(false);
    navigate(`/products/${productId}`);
  };

  if (!search) return null;

  return (
    <div
      className="fixed top-0 z-[200]  h-screen w-screen  bg-[rgba(0,0,0,0.5)] px-2 pt-10"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setSearch!(false);
        }
      }}
    >
      <div
        className="mx-auto max-w-md overflow-hidden rounded-lg md:max-w-xl "
        ref={wrapperRef}
      >
        <div className="md:flex">
          <div className="w-full px-3">
            <div className="relative">
              <AiOutlineSearch className="absolute top-4 left-4 text-2xl text-gray-400" />
              <input
                autoFocus
                type="text"
                className={`h-14 w-full bg-white px-14 text-lg  hover:cursor-pointer focus:outline-none ${
                  data?.length || searchImage
                    ? 'rounded-t-lg border-b-2 border-gray-300'
                    : 'rounded-lg'
                }`}
                name="search"
                placeholder="Product Name Or Brand"
                value={searchText}
                onFocus={() => {
                  setSearchImage(false);
                }}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="absolute top-4 right-5 border-l pl-4">
                <AiOutlineCamera
                  onClick={() => setSearchImage(!searchImage)}
                  className="top-4 right-4 text-2xl text-gray-500 hover:cursor-pointer hover:text-green-500"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-col px-3 ">
          <div className="flex flex-col rounded-b-lg  bg-white  text-gray-600">
            {searchImage ? (
              <div className="flex flex-col gap-4 ">
                <Dropzone />
                <div className="flex flex-col px-4">
                  Example image
                  <DownloadLink
                    fileUrl="https://res.cloudinary.com/dw21zy54j/image/upload/v1674834399/tutu/banners/test-ayam-goreng-2.jpg"
                    name="hat"
                  />
                  <DownloadLink
                    fileUrl="https://res.cloudinary.com/dw21zy54j/image/upload/v1674834398/tutu/banners/test-4.jpg"
                    name="shoe"
                  />
                  <DownloadLink
                    fileUrl="https://res.cloudinary.com/dw21zy54j/image/upload/v1674834397/tutu/banners/makan-nasi-ayam-2.png"
                    name="bag"
                  />
                </div>
              </div>
            ) : (
              data?.map((item) => (
                <button
                  onClick={() => searchProduct(item.id)}
                  key={item.id}
                  className="flex flex-col p-3 hover:bg-gray-100 hover:text-black"
                >
                  <div className="flex flex-row">{item.title}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DownloadLinkProps {
  fileUrl: string;
  name: string;
}

const DownloadLink = ({ fileUrl, name }: DownloadLinkProps) => {
  const handleDownload = async () => {
    try {
      // URL of the file to be downloaded
      // const fileUrl

      // Fetch the file content
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a Blob URL for the Blob object
      const url = URL.createObjectURL(blob);

      // Create a link element with the download attribute
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.webp`;

      // Append the link to the document body and click it
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the link and revoking the Blob URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button
      className="text-blue-500 hover:text-blue-700 text-start"
      onClick={handleDownload}
    >
      {name}
    </button>
  );
};

const Dropzone = () => {
  const navigate = useNavigate();
  const { setSearch, setSearchImage } = useSearch();
  const image = useRef<any>(null);
  const [processing, setProcessing] = useState(false);
  const [showerThought, setShowerThought] = useState('');
  const indexShowerThought = useRef(0);
  const searchByImage = useMutation(
    (base64_image: string) => SearchService.searchImage({ base64_image }),
    {
      onMutate: () => {
        setProcessing(true);
      },
      onSuccess: (data) => {
        setSearch!(false);
        setSearchImage!(
          new Array({
            file: image.current,
            category: data.title,
          })
        );
        navigate(`/products?category=${data.id}&searchImage=true`);
      },
      onError: (error: ApiError) => {
        toast.error(error.body.message);
        setProcessing(false);
      },
    }
  );

  const fetchShowerThought = useQuery(
    'showerThought',
    () => SearchService.showerThoughts(),
    {
      staleTime: 10000,
      onSuccess: (data) => {
        setShowerThought(data.data[indexShowerThought.current]);
        indexShowerThought.current++;
      },
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (fetchShowerThought.data != null) {
        if (
          indexShowerThought.current === fetchShowerThought.data?.data.length
        ) {
          indexShowerThought.current = 0;
        }
        setShowerThought(
          fetchShowerThought.data?.data[indexShowerThought.current]
        );
        indexShowerThought.current++;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchShowerThought.data]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const mappedFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      const base64 = await convertToBase64(mappedFiles[0]);
      searchByImage.mutate(base64 as string);
      image.current = mappedFiles[0];
    },
    [searchByImage]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    disabled: processing,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${isDragActive && 'bg-gray-100'} ${
          isDragReject && 'bg-red-100'
        } ${isDragAccept && 'bg-green-100'} ${
          processing && 'cursor-not-allowed bg-gray-100'
        }
          gap-y flex h-[12rem] w-full cursor-pointer flex-col place-content-center place-items-center rounded-b-lg border-2 border-dashed border-gray-300 text-xl font-bold`}
      >
        <input {...getInputProps()} />
        {processing ? (
          <div className="flex flex-col items-center justify-center">
            <p className="">Processing Your Image</p>
            <AiOutlineLoading3Quarters className="my-3 animate-spin-slow text-5xl text-gray-300" />
          </div>
        ) : isDragReject ? (
          <p>Unsupported file type...</p>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click here to select files</p>
        )}

        {processing ? (
          <p className=" px-[10%] text-center text-base text-gray-400">
            {showerThought}{' '}
          </p>
        ) : (
          <p className="text-lg text-gray-300">
            Only *jpg *.jpeg *.png and *.webp images will be accepted
          </p>
        )}
      </div>
    </>
  );
};

const useOutsideAlerter = (
  ref: React.MutableRefObject<any>,
  setSearch?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearch!(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setSearch]);
};
export default Search;
