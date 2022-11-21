import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { ProductService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Products = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 15,
  });
  const fetchProducts = useQuery(['products', params], () =>
    ProductService.getProducts([], params.page, params.pageSize)
  );

  if (fetchProducts.isLoading) {
    return <div>Loading...</div>;
  }

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
        <tr className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <th className="table-cell flex-[5] py-2 text-left font-semibold">
            Title
          </th>
          <th className="table-cell flex-[4] py-2 text-left font-semibold">
            Brand
          </th>
          <th className="table-cell flex-[3] py-2 text-left font-semibold">
            Unit Price
          </th>
          <th className="table-cell flex-[2] py-2 text-left font-semibold">
            Condition
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchProducts.data?.data.map((product) => {
          return (
            <Link to={`${product.id}`}>
              <tr
                className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50"
                key={product.id}
              >
                <td className="table-cell flex-[5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {product.title}
                </td>
                <td className="table-cell flex-[4] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {product.brand}
                </td>
                <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(product.price)}
                </td>
                <td className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(product.condition)}
                </td>
              </tr>
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
