import Card from "../components/Card";
import { useQuery } from "react-query";
import { ProductService } from "../api";
import { useSearchParams } from "react-router-dom";
import { useRef, useState } from "react";
import Sort from "../components/Sort";
import Pagination from "../components/Pagination";
import { IoClose } from "react-icons/io5";
import { useSearch } from "../context/SearchContext";

interface ProductParams {
  category: Array<string>;
  page: number;
  pageSize: number;
  sortBy: string;
  price: Array<number>;
  condition: string;
  productName: string;
}

const Products = () => {
  const [searchParams] = useSearchParams();
  const { searchImage, setSearchImage } = useSearch();
  const scrolledToTop = useRef(false);
  const [params, setParams] = useState<ProductParams>({
    category: searchParams.getAll("category"),
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("page_size")) || 12,
    sortBy: searchParams.get("sort_by") || "Title a_z",
    price: searchParams.getAll("price").map((price) => Number(price)),
    condition: searchParams.get("condition") || "",
    productName: searchParams.get("product_name") || "",
  });

  const fetchProducts = useQuery(
    ["products", params],
    () =>
      ProductService.getProducts(
        params.category,
        params.page,
        params.pageSize,
        params.sortBy,
        params.price,
        params.condition,
        params.productName
      ),
    {
      staleTime: Infinity,
    }
  );

  if (fetchProducts.isError) {
    return <div>Error...</div>;
  }
  if (fetchProducts.isLoading) {
    // scroll to top only only once
    if (!scrolledToTop.current) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      scrolledToTop.current = true;
    }
  } else {
    scrolledToTop.current = false;
  }

  return (
    <main id="main-content" className="mx-auto mt-20 min-h-[60vh] max-w-7xl">
      {/* ===== Heading & Continue Shopping */}
      <div className="w-full border-t-2 border-gray-100 ">
        <h1 className="mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Product
        </h1>
      </div>

      {/* ===== Product Section ===== */}
      <div className="mb-16 flex min-h-screen  gap-x-4">
        <section className="h-fit w-72 border border-gray-400 p-4 ">
          <Sort
            params={params}
            setParams={setParams}
            pagination={fetchProducts.data?.pagination}
          />
        </section>
        <div className="flex flex-col gap-y-4 flex-1">
          {searchImage.category.length > 0 && (
            <section className="w-full  border border-gray-400 p-4">
              <div className="group relative w-full flex overflow-hidden place-content-start gap-x-4 ">
                <img
                  alt="you searched for"
                  src={(searchImage as any).file.preview}
                  className="rounded-md object-contain object-bottom  w-40  border-2 border-gray-100"
                  onLoad={() => {
                    URL.revokeObjectURL((searchImage as any).file.preview);
                  }}
                />
                <div className="text-gray-700 text-left text-xl">
                  <b>We found these following products:</b>
                  <p>
                    We're pretty sure you were looking for{" "}
                    <b>{searchImage.category}</b>
                    <br />
                    If this not what you were looking for, then we are fricked
                  </p>
                </div>
                <IoClose
                  onClick={() => {
                    setSearchImage!({
                      file: new File([], ""),
                      category: "",
                    });
                  }}
                  className="absolute top-0 right-0 animate-spin-fast-once text-3xl text-gray-400 "
                />
              </div>
            </section>
          )}

          {fetchProducts.isLoading ? (
            <div className="not-found flex h-full w-full flex-col items-center gap-y-4 py-[10%] text-2xl">
              <strong>Loading...</strong>
              <div>Please wait a moment</div>
            </div>
          ) : fetchProducts.data && fetchProducts.data?.data.length > 0 ? (
            <div className="flex flex-col justify-between gap-y-12">
              <section className="grid grid-cols-2 gap-y-4 gap-x-2 w-full lg:grid-cols-3 xl:grid-cols-4">
                {fetchProducts.data?.data.map((product) => (
                  <Card key={product.id} item={product} />
                ))}
              </section>
              <Pagination
                currentPage={params.page}
                lastPage={fetchProducts.data?.pagination.total_page}
                setParams={setParams}
              />
            </div>
          ) : (
            <div className="not-found flex h-full w-full flex-col  items-center gap-y-4 py-[10%] text-2xl">
              <strong>Oops! No product found</strong>
              <div>Please try again with different keywords or filters</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Products;
