import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
} from "react-icons/hi2";

interface ProductParams {
  category: Array<string>;
  page: number;
  pageSize: number;
  sortBy: string;
  price: Array<number>;
  condition: string;
  productName: string;
}

interface DefaultParams {
  page: number;
  pageSize: number;
}

type Props = {
  lastPage: number;
  currentPage: number;
  setParams:
    | React.Dispatch<React.SetStateAction<ProductParams>>
    | React.Dispatch<React.SetStateAction<DefaultParams>>;
};

const Pagination: React.FC<Props> = ({ lastPage, currentPage, setParams }) => {
  const scrolledToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  let pageNumbers: number[] = [];

  for (let i = 1; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  let midPageNumbers = false;
  let startPageNumbers = false;
  let endPageNumbers = false;

  if (currentPage <= 2) {
    pageNumbers = [1, 2, 3];
    startPageNumbers = true;
    midPageNumbers = false;
    endPageNumbers = false;
  } else if (currentPage >= lastPage - 1) {
    pageNumbers = [lastPage - 2, lastPage - 1, lastPage];
    endPageNumbers = true;
    midPageNumbers = false;
    startPageNumbers = false;
  } else {
    pageNumbers = [currentPage - 1, currentPage, currentPage + 1];
    midPageNumbers = true;
    startPageNumbers = false;
    endPageNumbers = false;
  }

  if (lastPage <= 3) {
    pageNumbers = [...Array(lastPage)].map((_, i) => i + 1);
    startPageNumbers = false;
    midPageNumbers = false;
    endPageNumbers = false;
  }

  return (
    <div className="w-full">
      <ul className="mx-auto flex justify-center">
        <li>
          <button
            type="button"
            aria-label="Navigate to Previous Page"
            onClick={() => {
              if (currentPage > 1) {
                setParams((prevParams: any) => ({
                  ...prevParams,
                  page: prevParams.page - 1,
                }));
                scrolledToTop();
              }
            }}
            disabled={currentPage === 1}
            className={`${
              currentPage === 1
                ? "pointer-events-none cursor-not-allowed text-gray-400"
                : "cursor-pointer"
            } mx-1 flex h-10 w-16 items-center text-2xl justify-center border px-3 hover:bg-gray-500 hover:text-gray-100 focus:outline-none`}
          >
            <HiOutlineArrowLongLeft />
          </button>
        </li>
        {(midPageNumbers || endPageNumbers) && (
          <li>
            <span className="flex items-end text-3xl">...</span>
          </li>
        )}
        {pageNumbers.map((num) => {
          return (
            <li key={num} className="">
              <button
                type="button"
                onClick={() => {
                  setParams((prevParams: any) => ({
                    ...prevParams,
                    page: num,
                  }));
                  scrolledToTop();
                }}
                className={`${
                  num === currentPage && "bg-gray-500 text-gray-100"
                } mx-1 flex h-10 w-10 cursor-pointer items-center justify-center border hover:bg-gray-500 hover:text-gray-100 focus:outline-none`}
              >
                {num}
              </button>
            </li>
          );
        })}
        {(midPageNumbers || startPageNumbers) && (
          <li>
            <span className="flex items-end text-3xl">...</span>
          </li>
        )}
        <li>
          <button
            type="button"
            aria-label="Navigate to Next Page"
            onClick={() => {
              if (currentPage < lastPage) {
                setParams((prevParams: any) => ({
                  ...prevParams,
                  page: prevParams.page + 1,
                }));
                scrolledToTop();
              }
            }}
            className={`${
              currentPage >= lastPage
                ? "pointer-events-none cursor-not-allowed text-gray-400"
                : "cursor-pointer"
            } mx-1 flex h-10 w-16 items-center text-2xl justify-center border px-3 hover:bg-gray-500 hover:text-gray-100 focus:outline-none`}
          >
            <HiOutlineArrowLongRight />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
