import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { DashboardService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Customers = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 15,
  });
  const fetchCustomers = useQuery(['customers', params], () =>
    DashboardService.getCustomer(params.page, params.pageSize)
  );

  if (fetchCustomers.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div>
        <tr className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <th className="table-cell flex-[5] py-2 text-left font-semibold">
            Name
          </th>
          <th className="table-cell flex-[4] py-2 text-left font-semibold">
            Email
          </th>
          <th className="table-cell flex-[3] py-2 text-left font-semibold">
            Total Order
          </th>
          <th className="table-cell flex-[3] py-2 text-left font-semibold">
            Total Spent
          </th>
          <th className="table-cell flex-[3] py-2 text-left font-semibold">
            Last Order
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchCustomers.data?.data.map((customer) => {
          return (
            <Link to={`${customer.id}`}>
              <tr
                className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50"
                key={customer.id}
              >
                <td className="table-cell flex-[5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.name}
                </td>
                <td className="table-cell flex-[4] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.email}
                </td>
                <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.total_order}
                </td>
                <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(customer.total_spent)}
                </td>
                <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.last_order}
                </td>
              </tr>
            </Link>
          );
        })}
      </div>
      <Pagination
        currentPage={params.page}
        lastPage={fetchCustomers.data?.pagination.total_page || 0}
        setParams={setParams}
      />
    </div>
  );
};

export default Customers;
