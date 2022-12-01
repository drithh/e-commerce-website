import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { DashboardService } from '../../api';
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

const Orders = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 20,
  });

  const [sort, setSort] = useState<SortType>({
    column: 'created_at',
    order: 'off',
  });

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

  const fetchOrders = useQuery(['orders', params, sort], () =>
    DashboardService.getOrder(
      sort.column,
      sort.order,
      params.page,
      params.pageSize
    )
  );

  return (
    <div className=" mb-8 whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div>
        <div className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <div className="table-cell flex-[2] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('created_at');
              }}
            >
              <span>Created At</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'created_at' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'created_at' || sort.order === 'off'
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
          <div className="table-cell flex-[6] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('address');
              }}
            >
              <span>Address</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'address' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'address' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[2] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('total_product');
              }}
            >
              <span>Nb Product</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'total_product' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'total_product' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[2] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('total_price');
              }}
            >
              <span>Product Total</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'total_price' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'total_price' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
          <div className="table-cell flex-[2] py-2 text-left font-semibold">
            <div
              className="flex place-content-between place-items-center pr-2 cursor-pointer hover:text-gray-400 m-0"
              onClick={() => {
                changeSort('status');
              }}
            >
              <span>Status</span>
              <HiArrowDown
                className={`
                  ${
                    sort.column === 'status' && sort.order === 'asc'
                      ? 'transform rotate-180'
                      : sort.column !== 'status' || sort.order === 'off'
                      ? 'hidden'
                      : ''
                  } text-gray-400 transition-all`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        {fetchOrders.data?.data.map((order, index) => {
          return (
            <Link to={`${order.id}`} key={index}>
              <div className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50">
                <div className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.created_at}
                </div>
                <div className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.name}
                </div>
                <div className="table-cell flex-[6] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.address}
                </div>
                <div className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {order.total_product}
                </div>
                <div className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {convertToCurrency(order.total_price)}
                </div>
                <div className="table-cell flex-[2] overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(order.status)}
                </div>
              </div>
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
