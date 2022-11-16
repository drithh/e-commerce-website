import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiOutlineSearch, AiOutlineCamera } from "react-icons/ai";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { SearchService } from "../api";
interface props {
  setSearch: Dispatch<SetStateAction<boolean>>;
}

const Search = ({ setSearch }: props) => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setSearch);
  const [searchText, setSearchText] = useState("");

  const { data } = useQuery(
    ["search", searchText],
    () => SearchService.searchText(searchText),
    {
      enabled: searchText.length > 0,
      staleTime: Infinity,
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const searchProduct = (productId: string) => {
    setSearch(false);
    navigate(`/products/${productId}`);
  };

  return (
    <div
      className="pt-10 fixed z-[200]  w-screen h-screen  px-2 bg-[rgba(0,0,0,0.5)]"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setSearch(false);
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
                  data?.length
                    ? "border-b-2 border-gray-300 rounded-t-lg"
                    : "rounded-lg"
                }`}
                name="search"
                placeholder="Product Name Or Brand"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="absolute top-4 right-5 border-l pl-4">
                <AiOutlineCamera className="text-gray-500 hover:text-green-500 hover:cursor-pointer text-2xl top-4 right-4" />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full px-3 relative flex flex-col ">
          <div className="bg-white flex flex-col  text-gray-600  rounded-b-lg">
            {data?.map((item) => (
              <button
                onClick={() => searchProduct(item.id)}
                key={item.id}
                className="flex flex-col p-3 hover:bg-gray-100 hover:text-black"
              >
                <div className="flex flex-row">{item.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function useOutsideAlerter(
  ref: React.MutableRefObject<any>,
  setSearch: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearch(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setSearch]);
}
export default Search;
