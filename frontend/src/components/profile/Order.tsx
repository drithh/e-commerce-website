import { useMutation, useQuery } from 'react-query';
import { OrderService } from '../../api';
import dayjs from 'dayjs';
import { capitalCase } from 'change-case';
import { BsTruck, BsBoxSeam } from 'react-icons/bs';
import { IoMdCheckmark } from 'react-icons/io';
import GhostButton from '../button/GhostButton';
import { toast } from 'react-toastify';
import OrderProducts from './OrderProducts';
const Order = () => {
  const fetchOrder = useQuery('order', () => OrderService.getOrdersUser(), {
    staleTime: Infinity,
  });
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

  if (fetchOrder.isError) {
    return <div>Something went wrong</div>;
  }
  if (fetchOrder.isLoading) {
    return <div>Loading...</div>;
  }
  if (fetchOrder.data) {
    console.log(fetchOrder.data);
  }

  return (
    <div className="flex gap-y-4 pl-4 flex-col">
      {fetchOrder.data?.data.map((order) => (
        <div key={order.id}>
          <div className="border border-gray-300 rounded-md w-full pt-4 pb-8 px-5  text-gray-600">
            <div className="flex place-content-between w-full  pb-4 text-gray-400 text-sm">
              <span>
                {dayjs(order.created_at).format('dddd, MMMM D YYYY, h:mm A')}
              </span>
              <span className="tracking-wider">
                {capitalCase(order.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 text-gray-400">
              <div className="flex flex-col ">
                <strong>Shipping</strong>
                <div>Method: {order.shipping_method}</div>
                <div>Price: {order.shipping_price}</div>
              </div>
              <div className="flex flex-col w-52">
                <strong>Address</strong>
                <div>{order.shipping_address}</div>
              </div>
            </div>
            <OrderProducts order={order} />
            <div className="order-status py-2 mt-16 flex place-content-between place-items-center mx-auto max-w-[44rem] ">
              <div
                className={`${
                  order.status === 'processed' ||
                  order.status === 'shipped' ||
                  order.status === 'finished'
                    ? 'text-emerald-300 border-emerald-300'
                    : 'text-gray-200 border-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="text-4xl border-current rounded-full border-[3px]  p-4">
                  <BsBoxSeam />
                </div>
                <div className="">Processed</div>
              </div>
              <div
                className={`${
                  order.status === 'processed' ||
                  order.status === 'shipped' ||
                  order.status === 'finished'
                    ? 'bg-emerald-300'
                    : 'bg-gray-200'
                } line h-1 w-full mb-7`}
              ></div>
              <div
                className={`${
                  order.status === 'shipped' || order.status === 'finished'
                    ? 'text-emerald-300 border-emerald-300'
                    : 'text-gray-200 border-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="text-4xl border-current rounded-full border-[3px]  p-4">
                  <BsTruck />
                </div>
                <div className="">Shipped</div>
              </div>
              <div
                className={`${
                  order.status === 'shipped' || order.status === 'finished'
                    ? 'bg-emerald-300'
                    : 'bg-gray-200'
                } line h-1 w-full mb-7 `}
              ></div>
              <div
                className={`${
                  order.status === 'finished'
                    ? 'text-emerald-300 border-emerald-300'
                    : 'text-gray-200 border-gray-200'
                } status flex flex-col gap-y-2`}
              >
                <div className="text-4xl border-current rounded-full border-[3px]  p-4">
                  <IoMdCheckmark />
                </div>
                <div className="">Finished</div>
              </div>
            </div>
            <div
              className={`${
                order.status === 'shipped' ? 'flex' : 'hidden'
              } mt-12 place-content-end pr-8 `}
            >
              <GhostButton onClick={() => completeOrder(order.id)}>
                Complete Order
              </GhostButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
