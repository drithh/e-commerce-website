import { useQuery } from 'react-query';
import { OrderService } from '../../api';
import dayjs from 'dayjs';

const Order = () => {
  const fetchOrder = useQuery('order', () => OrderService.getOrdersUser(), {
    staleTime: Infinity,
  });

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
          <div className="border border-gray-300 rounded-md w-full">
            <div className="flex place-content-between w-full p-4 text-gray-300 text-sm">
              <span>{dayjs(order.created_at).format('dddd, MMMM D YYYY')}</span>
              <span>{dayjs(order.created_at).format('h:mm A')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Order;
