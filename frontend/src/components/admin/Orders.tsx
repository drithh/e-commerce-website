import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { DashboardService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Orders = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 20,
  });

  const fetchOrders = useQuery(['orders', params], () =>
    DashboardService.getOrder(params.page, params.pageSize)
  );

  if (fetchOrders.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" mb-8 whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div>
        <tr className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <th className="table-cell flex-[2] py-2 text-left font-semibold">
            Created At
          </th>
          <th className="table-cell flex-[3] py-2 text-left font-semibold">
            Name
          </th>
          <th className="table-cell flex-[6] py-2 text-left font-semibold">
            Address
          </th>
          <th className="table-cell flex-[2] py-2 text-left font-semibold">
            Nb Product
          </th>
          <th className="table-cell flex-[2] py-2 text-left font-semibold">
            Product Total
          </th>
          <th className="table-cell flex-[2] py-2 text-left font-semibold">
            Status
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchOrders.data?.data.map((order, index) => {
          return (
            <Link to={`${order.id}`}>
              <tr
                className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50"
                key={index}
              >
                <td className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.created_at}
                </td>
                <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.name}
                </td>
                <td className="table-cell flex-[6] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.address}
                </td>
                <td className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.total_product}
                </td>
                <td className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(order.total_price)}
                </td>
                <td className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(order.status)}
                </td>
              </tr>
            </Link>
          );
        })}
      </div>
      <Pagination
        currentPage={params.page}
        lastPage={fetchOrders.data?.pagination.total_page || 0}
        setParams={setParams}
      />
    </div>
  );
};

export default Orders;
