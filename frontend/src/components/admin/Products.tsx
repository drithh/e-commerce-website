import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProductService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';
import { capitalCase } from 'change-case';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="w-full whitespace-nowrap px-8 pt-4 pb-8 border border-gray-500">
      <div className="flex place-content-end">
        <button
          type="button"
          onClick={() => navigate('create')}
          className="text-xl mt-3 mb-6 sm:text-base py-3 sm:py-2 px-6 border border-gray-500 w-52 text-center  hover:bg-gray-500 hover:text-gray-100"
          aria-label="Create Product"
        >
          Create Product
        </button>
      </div>
      <div>
        <tr className="border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4">
          <th className="py-2 text-left font-semibold table-cell flex-[5]">
            Title
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[4]">
            Brand
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[3]">
            Unit Price
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[2]">
            Condition
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchProducts.data?.data.map((product) => {
          return (
            <Link to={`${product.id}`}>
              <tr
                className=" border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4 hover:bg-gray-50 cursor-pointer"
                key={product.id}
              >
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[5]">
                  {product.title}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[4]">
                  {product.brand}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                  {convertToCurrency(product.price)}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[2]">
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
