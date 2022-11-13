import { useQuery } from "react-query";
import { CategoryService, Pagination } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { capitalCase } from "change-case";
import { CiDollar } from "react-icons/ci";
import Dropdown from "../components/Dropdown";
import { useRef } from "react";
const pluralize = require("pluralize");

interface TypeParams {
  category: Array<string>;
  page: number;
  pageSize: number;
  sortBy: string;
  price: Array<number>;
  condition: string;
  productName: string;
}

interface SortProps {
  params: TypeParams;
  setParams: React.Dispatch<React.SetStateAction<TypeParams>>;
  pagination?: Pagination;
}

const Sort: React.FC<SortProps> = ({ params, setParams, pagination }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const popping = useRef(false);
  useEffect(() => {
    window.onpopstate = () => {
      if (!window.location.pathname.includes("product")) return;
      setParams({
        category: searchParams.getAll("category"),
        page: Number(searchParams.get("page")) || 1,
        pageSize: Number(searchParams.get("page_size")) || 12,
        sortBy: searchParams.get("sort_by") || "Title a_z",
        price: searchParams.getAll("price").map((price) => Number(price)),
        condition: searchParams.get("condition") || "",
        productName: searchParams.get("product_name") || "",
      });
    };
    popping.current = true;
  }, [setParams, searchParams]);

  const fetchCategories = useQuery(
    "categories",
    () => CategoryService.getCategory(),
    {
      staleTime: Infinity,
    }
  );

  const conditions = ["new", "used"];

  useEffect(() => {
    const requestParams = new URLSearchParams();
    requestParams.append("page", params.page.toString());
    requestParams.append("page_size", params.pageSize.toString());
    requestParams.append("sort_by", params.sortBy);
    params.category.forEach((single_category) => {
      requestParams.append("category", single_category);
    });
    params.price.forEach((single_price) => {
      if (single_price) {
        requestParams.append("price", single_price.toString());
      }
    });
    if (params.condition.length > 0) {
      requestParams.append("condition", params.condition);
    }
    if (params.productName.length > 0) {
      requestParams.append("product_name", params.productName);
    }
    if (
      searchParams.toString() === "" ||
      searchParams.toString() === requestParams.toString() ||
      popping.current
    ) {
      navigate(`?${requestParams.toString()}`, { replace: true });
      popping.current = false;
    } else {
      navigate(`?${requestParams.toString()}`, {
        state: { params },
      });
    }
  }, [params, navigate, searchParams]);

  if (fetchCategories.isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchCategories.isError || !fetchCategories.data) {
    return <div>Error...</div>;
  }

  const categories = fetchCategories.data.data;
  const categoriesByType = categories.reduce((acc, category) => {
    const { type } = category;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(category);
    return acc;
  }, {} as Record<string, Array<any>>);

  return (
    <div className="flex w-full  flex-col text-gray-600">
      <div className="border-b border-b-gray-100 px-4 py-5 ">
        {pagination && pagination.total_item > 0 ? (
          <span>
            Showing {1 + (pagination.page - 1) * pagination.page_size} -{" "}
            {Math.min(
              pagination.page * pagination.page_size,
              pagination.total_item
            )}{" "}
            of {pagination.total_item} Results
          </span>
        ) : (
          <span>No results</span>
        )}
      </div>
      <div className="flex flex-col gap-y-4 border-b border-b-gray-100 px-4 pt-3 pb-4 ">
        {Object.entries(categoriesByType).map(([type, categories]) => (
          <div key={type}>
            <h2 className="mb-2 text-xl text-black">
              {pluralize(capitalCase(type, { delimiter: " & " }))}
            </h2>
            <ul className="flex flex-col gap-y-2">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center ">
                  <input
                    type="checkbox"
                    checked={params.category.includes(category.id)}
                    id={category.id}
                    name={pluralize.singular(capitalCase(category.title))}
                    value={category.id}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      if (checked) {
                        setParams((prev) => ({
                          ...prev,
                          page: 1,
                          category: [...prev.category, value],
                        }));
                      } else {
                        setParams((prev) => ({
                          ...prev,
                          page: 1,
                          category: prev.category.filter(
                            (item) => item !== value
                          ),
                        }));
                      }
                    }}
                    className="mx-2 h-4 w-4 border-gray-300  text-gray-600 accent-gray-600"
                  />
                  {pluralize.singular(capitalCase(category.title))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="sort border-b border-b-gray-100 px-4 pt-3 pb-6">
        <h2 className="mb-2 text-xl text-black">Sort By</h2>
        <Dropdown params={params} setParams={setParams} />
      </div>
      <div className="price flex flex-col gap-y-4 border-b border-b-gray-100 px-4 pt-3 pb-6">
        <fieldset className="price-wrapper">
          <legend className="mb-3 text-xl text-black">Minimum Price</legend>
          <div className="input-price flex items-center gap-x-2 rounded border border-gray-300 px-3 py-1">
            <CiDollar className="text-3xl text-gray-400" />
            <input
              type="number"
              name="min-price"
              id="min-price"
              className="h-5 w-full"
              placeholder="0"
              defaultValue={params.price[0]}
              onBlur={(e) => {
                const value = e.target.value;
                if (value || params.price[0] !== parseInt(value)) {
                  setParams((prev) => ({
                    ...prev,
                    page: 1,
                    price: [Number(value), prev.price[1]],
                  }));
                }
              }}
            />
          </div>
        </fieldset>
        <fieldset className="price-wrapper">
          <legend className="mb-3 text-xl text-black">Maximum Price</legend>
          <div className="input-price flex items-center gap-x-2 rounded border border-gray-300 px-3 py-1">
            <CiDollar className="text-3xl text-gray-400" />
            <input
              type="number"
              name="max-price"
              id="max-price"
              defaultValue={params.price[1]}
              className="h-5 w-full"
              onBlur={(e) => {
                let value = e.target.value;
                if (!value) {
                  setParams((prev) => ({
                    ...prev,
                    page: 1,
                    price: [prev.price[0]],
                  }));
                } else {
                  setParams((prev) => ({
                    ...prev,
                    page: 1,
                    price: [prev.price[0] || 0, Number(value)],
                  }));
                }
              }}
              placeholder="999999"
            />
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col gap-y-3 px-4 py-3 ">
        <h2 className="text-xl text-black">Condition</h2>
        <ul className="flex flex-col gap-y-2">
          {conditions.map((condition, index) => (
            <li key={index} className="flex items-center ">
              <input
                type="radio"
                checked={params.condition === condition}
                name="condition"
                value={condition}
                onChange={(e) => {
                  const { checked, value } = e.target;
                  if (checked) {
                    setParams((prev) => ({
                      ...prev,
                      page: 1,
                      condition: value,
                    }));
                  }
                }}
                className="mx-2 h-4 w-4 border-gray-300  text-gray-600 accent-gray-600"
              />
              {capitalCase(condition)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sort;
