import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiError, SearchService } from '../api';
import { convertToBase64 } from '../components/util/utilFunc';
import { useSearch } from '../context/SearchContext';

const TestModel = () => {
  const { searchImage } = useSearch();
  return (
    <main
      id="main-content"
      className="relative mx-auto mt-20 min-h-screen w-[95vw] overflow-hidden  border-t border-gray-100 2xl:w-[90rem]"
    >
      <div className="w-full ">
        <h1 className="mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Model Test
        </h1>
      </div>
      <div className="mt-4 flex gap-y-4 flex-col w-full">
        {/* ===== Image ===== */}
        <section
          className={`
          ${searchImage.length > 0 && 'border-[1.5px] border-gray-500'}
          flex flex-wrap gap-4  py-2 px-5 font-medium text-gray-400 w-fit`}
        >
          {searchImage.map((image, index) => (
            <div key={index} className="flex flex-col place-content-center">
              <img
                src={(image.file as any).preview}
                className="w-40 h-40 rounded-md border-2  border-gray-100  object-contain object-bottom"
                onLoad={() => {
                  URL.revokeObjectURL((image.file as any).preview);
                }}
              />
              <h1 className="text-lg font-medium text-center">
                {image.category}
              </h1>
            </div>
          ))}
        </section>

        {/* ===== Main Section ===== */}
        <section>
          <Dropzone />
        </section>
      </div>
    </main>
  );
};

const Dropzone = () => {
  const { setSearch, setSearchImage, searchImage } = useSearch();
  const totalImages = useRef<number>(0);
  const [processing, setProcessing] = useState(false);
  const [showerThought, setShowerThought] = useState('');
  const indexShowerThought = useRef(0);
  const searchByImage = useMutation(
    (variables: { base64_image: string; imageFile: any }) =>
      SearchService.searchImage({ base64_image: variables.base64_image }),
    {
      onMutate: () => {
        setProcessing(true);
      },
      onSuccess: (data, variables) => {
        totalImages.current--;
        setSearchImage!((prev) => [
          ...prev,
          {
            category: data.title,
            file: variables.imageFile,
          },
        ]);
        if (totalImages.current === 0) {
          setSearch!(false);
          setProcessing(false);
        }
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
      staleTime: Infinity,
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
      totalImages.current = acceptedFiles.length;
      setSearchImage!([]);
      const mappedFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      mappedFiles.forEach(async (file: any) => {
        const base64 = (await convertToBase64(file)) as string;
        searchByImage.mutate({ base64_image: base64, imageFile: file });
      });
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

export default TestModel;
