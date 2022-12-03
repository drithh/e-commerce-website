import { useState } from 'react';
import { HiArrowDown } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { DashboardService } from '../../api';
import Pagination from '../Pagination';
import { convertToCurrency } from '../util/utilFunc';

interface DefaultParams {
  page: number;
  pageSize: number;
}

interface SortType {
  column: string;
  order: 'asc' | 'desc' | 'off';
}

const Customers = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 15,
  });
  const [sort, setSort] = useState<SortType>({
    column: 'name',
    order: 'desc',
  });

  const fetchCustomers = useQuery(['customers', params, sort], () =>
    DashboardService.getCustomer(
      sort.column,
      sort.order,
      params.page,
      params.pageSize
    )
  );

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

  return (
    <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div>
        <div className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <div className="table-cell flex-[5] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('name');
              }}
            >
              <span>Name</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'name' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'name' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[4] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('email');
              }}
            >
              <span>Email</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'email' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'email' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[3] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('total_order');
              }}
            >
              <span>Total Order</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'total_order' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'total_order' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[3] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('total_spent');
              }}
            >
              <span>Total Spent</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'total_spent' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'total_spent' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[3] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('last_order');
              }}
            >
              <span>Last Order</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'last_order' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'last_order' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        {fetchCustomers.data?.data.map((customer) => {
          return (
            <Link to={`${customer.id}`} key={customer.id}>
              <div className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50">
                <div className="table-cell flex-[5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.name}
                </div>
                <div className="table-cell flex-[4] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.email}
                </div>
                <div className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.total_order}
                </div>
                <div className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(customer.total_spent)}
                </div>
                <div className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {customer.last_order}
                </div>
              </div>
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
