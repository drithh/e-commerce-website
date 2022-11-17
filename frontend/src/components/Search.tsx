import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineSearch, AiOutlineCamera } from 'react-icons/ai';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { SearchService } from '../api';
import { convertToBase64 } from './util/utilFunc';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSearch } from '../context/SearchContext';

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
      className="pt-10 fixed z-[200]  w-screen h-screen  px-2 bg-[rgba(0,0,0,0.5)] top-0"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setSearch!(false);
        }
      }}
    >
      <div
        className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl "
        ref={wrapperRef}
      >
        <div className="md:flex">
          <div className="w-full px-3">
            <div className="relative">
              <AiOutlineSearch className="absolute top-4 left-4 text-gray-400 text-2xl" />
              <input
                autoFocus
                type="text"
                className={`bg-white h-14 w-full px-14 text-lg  focus:outline-none hover:cursor-pointer ${
                  data?.length || searchImage
                    ? 'border-b-2 border-gray-300 rounded-t-lg'
                    : 'rounded-lg'
                }`}
                name="search"
                placeholder="Product Name Or Brand"
                value={searchText}
                onFocus={() => {
                  setSearchImage!(false);
                }}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="absolute top-4 right-5 border-l pl-4">
                <AiOutlineCamera
                  onClick={() => setSearchImage(!searchImage)}
                  className="text-gray-500 hover:text-green-500 hover:cursor-pointer text-2xl top-4 right-4"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full px-3 relative flex flex-col ">
          <div className="bg-white flex flex-col  text-gray-600  rounded-b-lg">
            {searchImage ? (
              <Dropzone />
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
        setSearchImage!({
          file: image.current,
          category: data.title,
        });
        navigate(`/products?category=${data.id}&searchImage=true`);
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
      if (fetchShowerThought.data) {
        if (indexShowerThought.current === fetchShowerThought.data?.data.length)
          indexShowerThought.current = 0;
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
      'image/png': [],
      'image/webp': [],
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${isDragActive && 'bg-gray-100'} ${
          isDragReject && 'bg-red-100'
        } ${isDragAccept && 'bg-green-100'} ${
          processing && 'bg-gray-100 cursor-not-allowed'
        }
          gap-y flex h-[12rem] w-full cursor-pointer flex-col place-content-center place-items-center border-2 rounded-b-lg border-dashed border-gray-300 text-xl font-bold`}
      >
        <input {...getInputProps()} />
        {processing ? (
          <div className="flex flex-col justify-center items-center">
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
          <p className=" text-base text-center text-gray-400 px-[10%]">
            {showerThought}{' '}
          </p>
        ) : (
          <p className="text-lg text-gray-300">
            Only *.jpeg and *.png images will be accepted
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
