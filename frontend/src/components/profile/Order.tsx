import { useState } from 'react';
import { BsBoxSeam, BsTruck } from 'react-icons/bs';
import { IoMdCheckmark } from 'react-icons/io';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { capitalCase } from 'change-case';
import dayjs from 'dayjs';

import { OrderService } from '../../api';
import GhostButton from '../button/GhostButton';
import Pagination from '../Pagination';
import OrderProducts from './OrderProducts';

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Order = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 5,
  });

  const fetchOrder = useQuery(['orders', params], () =>
    OrderService.getOrdersUser(params.page, params.pageSize)
  );

  const updateOrder = useMutation(
    (id: string) => OrderService.updateOrderStatus(id),
    {
      onSuccess: (data) => {
        fetchOrder.refetch();
        toast.success(data.message);
      },
    }
  );

  const completeOrder = (id: string) => {
    updateOrder.mutate(id);
  };

  if (fetchOrder.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-4 pl-4">
      {fetchOrder.data?.data.map((order) => (
        <div key={order.id}>
          <div className="w-full border-2 border-gray-400 p-8  text-gray-600">
            <div className="mb-4 flex w-full place-content-between pb-4  text-[1.05rem] uppercase text-gray-400">
              <span>
                {dayjs(order.created_at).format('dddd, MMMM D YYYY, h:mm A')}
              </span>
              <span className="tracking-wider">
                {capitalCase(order.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 text-gray-400">
              <div className="flex flex-col ">
                <strong className="uppercase">Shipping</strong>
                <div>Method: {order.shipping_method}</div>
                <div>Price: {order.shipping_price}</div>
              </div>
              <div className="flex w-52 flex-col">
                <strong className="uppercase">Address</strong>
                {/* <div>{order.address_name}</div> */}
                <div>{order.shipping_address}</div>
              </div>
            </div>
            <OrderProducts order={order} />
            <div className="order-status mx-auto mt-16 flex max-w-[44rem] place-content-between place-items-center py-2 ">
              <div
                className={`${
                  order.status === 'processed' ||
                  order.status === 'shipped' ||
                  order.status === 'completed'
                    ? 'border-emerald-300 text-emerald-300'
                    : 'border-gray-200 text-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="rounded-full border-[3px] border-current p-4  text-4xl">
                  <BsBoxSeam />
                </div>
                <div className="">Processed</div>
              </div>
              <div
                className={`${
                  order.status === 'shipped' || order.status === 'completed'
                    ? 'bg-emerald-300'
                    : 'bg-gray-200'
                } line mb-7 h-1 w-full`}
              ></div>
              <div
                className={`${
                  order.status === 'shipped' || order.status === 'completed'
                    ? 'border-emerald-300 text-emerald-300'
                    : 'border-gray-200 text-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="rounded-full border-[3px] border-current p-4  text-4xl">
                  <BsTruck />
                </div>
                <div className="">Shipped</div>
              </div>
              <div
                className={`${
                  order.status === 'completed'
                    ? 'bg-emerald-300'
                    : 'bg-gray-200'
                } line mb-7 h-1 w-full `}
              ></div>
              <div
                className={`${
                  order.status === 'completed'
                    ? 'border-emerald-300 text-emerald-300'
                    : 'border-gray-200 text-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="rounded-full border-[3px] border-current p-4  text-4xl">
                  <IoMdCheckmark />
                </div>
                <div className="">Completed</div>
              </div>
            </div>
            <div
              className={`${
                order.status === 'shipped' ? 'flex' : 'hidden'
              } mt-12 place-content-end`}
            >
              <GhostButton onClick={() => completeOrder(order.id)}>
                Complete Order
              </GhostButton>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        currentPage={params.page}
        lastPage={fetchOrder.data?.pagination.total_page || 10}
        setParams={setParams}
      />
    </div>
  );
};

export default Order;
