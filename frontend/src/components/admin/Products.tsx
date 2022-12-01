import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { ProductService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';
import { HiArrowDown } from 'react-icons/hi';

interface DefaultParams {
  page: number;
  pageSize: number;
}

interface SortType {
  column: string;
  order: 'asc' | 'desc' | 'off';
}

const Products = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 15,
  });

  const [sort, setSort] = useState<SortType>({
    column: 'name',
    order: 'desc',
  });

  const convertSort = (sortType: SortType) => {
    if (sortType.column === 'title') {
      if (sortType.order === 'asc') {
        return 'Title a_z';
      } else if (sortType.order === 'desc') {
        return 'Title z_a';
      }
    } else if (sortType.column === 'price') {
      if (sortType.order === 'asc') {
        return 'Price a_z';
      } else if (sortType.order === 'desc') {
        return 'Price z_a';
      }
    }
    return '';
  };

  const changeSort = (column: string) => {
    if (sort.column === column) {
      if (sort.order === 'asc') {
        setSort({ column, order: 'desc' });
      } else if (sort.order === 'desc') {
        setSort({ column, order: 'off' });
      } else {
        setSort({ column, order: 'asc' });
      }
    } else {
      setSort({ column, order: 'asc' });
    }
  };

  const fetchProducts = useQuery(['products', params, sort], () =>
    ProductService.getProducts(
      [],
      params.page,
      params.pageSize,
      convertSort(sort)
    )
  );

  return (
    <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div className="flex place-content-end">
        <button
          type="button"
          onClick={() => navigate('create')}
          className="mt-3 mb-6 w-52 border border-gray-500 py-3 px-6 text-center text-xl hover:bg-gray-500 hover:text-gray-100  sm:py-2 sm:text-base"
          aria-label="Create Product"
        >
          Create Product
        </button>
      </div>
      <div>
        <div className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <div className="table-cell flex-[5] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('title');
              }}
            >
              <span>Title</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'title' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'title' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[4] py-2 text-left font-semibold">
            Brand
          </div>
          <div className="table-cell flex-[3] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('price');
              }}
            >
              <span>Unit Price</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'price' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'price' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[2] py-2 text-left font-semibold">
            Condition
          </div>
        </div>
      </div>
      <div className="mb-8">
        {fetchProducts.data?.data.map((product) => {
          return (
            <Link to={`${product.id}`} key={product.id}>
              <div className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50">
                <div className="table-cell flex-[5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {product.title}
                </div>
                <div className="table-cell flex-[4] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {product.brand}
                </div>
                <div className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(product.price)}
                </div>
                <div className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(product.condition)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Pagination
        currentPage={params.page}
        lastPage={fetchProducts.data?.pagination.total_page || 0}
        setParams={setParams}
      />
    </div>
  );
};

export default Products;
