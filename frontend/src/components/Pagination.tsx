import NextArrow from '../assets/icons/NextArrow';
import PrevArrow from '../assets/icons/PrevArrow';

interface TypeParams {
  category: Array<string>;
  page: number;
  pageSize: number;
  sortBy: string;
  price: Array<number>;
  condition: string;
  productName: string;
}

type Props = {
  lastPage: number;
  currentPage: number;
  setParams: React.Dispatch<React.SetStateAction<TypeParams>>;
};

const Pagination: React.FC<Props> = ({ lastPage, currentPage, setParams }) => {
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

  if (lastPage === 3) {
    pageNumbers = [1, 2, 3];
    startPageNumbers = false;
    midPageNumbers = false;
    endPageNumbers = false;
  }

  if (lastPage === 1) {
    pageNumbers = [1];
    startPageNumbers = false;
    midPageNumbers = false;
    endPageNumbers = false;
  }

  return (
    <div className="w-full">
      <ul className="flex mx-auto justify-center">
        <li>
          <button
            type="button"
            aria-label="Navigate to Previous Page"
            onClick={() => {
              if (currentPage > 1) {
                setParams((prevParams) => ({
                  ...prevParams,
                  page: prevParams.page - 1,
                }));
              }
            }}
            disabled={currentPage === 1}
            className={`${
              currentPage === 1
                ? 'pointer-events-none cursor-not-allowed text-gray-400'
                : 'cursor-pointer'
            } focus:outline-none flex justify-center items-center h-10 w-16 px-3 border mx-1 hover:bg-gray-500 hover:text-gray-100`}
          >
            <PrevArrow />
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
                  setParams((prevParams) => ({
                    ...prevParams,
                    page: num,
                  }));
                }}
                className={`${
                  num === currentPage && 'bg-gray-500 text-gray-100'
                } focus:outline-none cursor-pointer flex justify-center items-center w-10 h-10 border mx-1 hover:bg-gray-500 hover:text-gray-100`}
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
                setParams((prevParams) => ({
                  ...prevParams,
                  page: prevParams.page + 1,
                }));
              }
            }}
            className={`${
              currentPage >= lastPage
                ? 'pointer-events-none cursor-not-allowed text-gray-400'
                : 'cursor-pointer'
            } focus:outline-none flex justify-center items-center h-10 w-16 px-3 border mx-1 hover:bg-gray-500 hover:text-gray-100`}
          >
            <NextArrow />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
