import { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { ApiError, OrderService } from '../../api';
import Button from '../button/Button';
import { toast } from 'react-toastify';
import Dropdown from '../input/Dropdown';
import dayjs from 'dayjs';
import { capitalCase } from 'change-case';
import { convertToCurrency } from '../util/utilFunc';

const Order = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const statusOptions = ['processed', 'shipped', 'cancelled', 'completed'];

  const updateOrder = useMutation(
    (variables: { id: string; status: string }) =>
      OrderService.updateOrders(variables.id, variables.status),
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error((error as ApiError).body.message);
      },
    }
  );

  const fetchOrder = useQuery(
    ['order', id],
    () => OrderService.getOrderDetails(id as string),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setStatus(data.status);
      },
    }
  );

  if (fetchOrder.isLoading || id === undefined) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateOrder.mutate({ id: id as string, status });
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Update Order</h2>
      <div className="py-3 flex ">
        <Link to="/admin/orders" className="flex place-items-center  gap-x-2">
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <div className="border-gray-500 border w-full p-6 pb-4">
          <div className="flex w-full place-content-between mb-6  text-gray-400 uppercase text-[1.05rem]">
            <div>
              {dayjs(fetchOrder.data?.created_at).format(
                'dddd, MMMM D YYYY, h:mm A'
              )}
            </div>
            <div className="tracking-wider">
              {capitalCase(fetchOrder.data?.status || '')}
            </div>
          </div>
          <div className=" grid grid-cols-2 mb-6  text-gray-700 border-gray-100 pb-6 border-b-2 ">
            <div className="w-64">
              <p className="font-semibold">Customer</p>
              <p className="">{fetchOrder.data?.name}</p>
              <p className="">{fetchOrder.data?.email}</p>

              <div className="pb-4 pt-8">
                <p className="font-semibold">Status</p>
                <Dropdown
                  selected={status}
                  setSelected={setStatus}
                  width="w-64"
                  options={statusOptions}
                  border="border-gray-400 border"
                />
              </div>
            </div>
            <div className="w-64">
              <p className="font-semibold">Shipping</p>
              <p className="">{fetchOrder.data?.shipping_method}</p>
              <p className="">{fetchOrder.data?.shipping_address}</p>
            </div>
          </div>
        </div>
        <div className="w-full whitespace-nowrap px-8 pt-4 pb-8 border border-gray-500">
          <div>
            <tr className="border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4">
              <th className="py-2 text-left font-semibold table-cell flex-[3]">
                Product
              </th>
              <th className="py-2 text-left font-semibold table-cell flex-1">
                Size
              </th>
              <th className="py-2 text-left font-semibold table-cell flex-1">
                Quantity
              </th>
              <th className="py-2 text-left font-semibold table-cell flex-[1.5]">
                Unit Price
              </th>
              <th className="py-2 text-left font-semibold table-cell flex-[1.5]">
                Total
              </th>
            </tr>
          </div>
          <div className="">
            {fetchOrder.data?.products.map((product, index) => {
              return product.details.map((detail, index) => {
                return (
                  <tr
                    className=" border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4 "
                    key={index}
                  >
                    <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                      {product.name}
                    </td>
                    <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-1">
                      {detail.size}
                    </td>
                    <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-1">
                      {detail.quantity}
                    </td>
                    <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[1.5]">
                      {convertToCurrency(product.price)}
                    </td>
                    <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[1.5]">
                      {convertToCurrency(product.price * detail.quantity)}
                    </td>
                  </tr>
                );
              });
            })}
          </div>
        </div>
        <div className="w-full whitespace-nowrap pl-12 pr-24 py-6 border border-gray-500">
          <div className="flex py">
            <p className="font-semibold flex-[7]">Sum Product</p>
            <p className="text-left flex-1">
              {convertToCurrency(
                fetchOrder.data?.products.reduce((a, b) => {
                  return (
                    a + b.details.reduce((a, b) => a + b.quantity, 0) * b.price
                  );
                }, 0) || 0
              )}
            </p>
          </div>
          <div className="flex pt-2 pb-4 mb-4 border-b-2 border-gray-100">
            <p className="font-semibold flex-[7]">Shipping Fee</p>
            <p className="text-left flex-1">
              {convertToCurrency(fetchOrder.data?.shipping_price || 0)}
            </p>
          </div>
          <div className="flex">
            <p className="font-semibold flex-[7]">Total</p>
            <p className="text-left flex-1">
              {convertToCurrency(
                (fetchOrder.data?.products.reduce((a, b) => {
                  return (
                    a + b.details.reduce((a, b) => a + b.quantity, 0) * b.price
                  );
                }, 0) || 0) + (fetchOrder.data?.shipping_price || 0)
              )}
            </p>
          </div>
        </div>
        <div className="mt-8 flex place-content-end">
          <Button
            type="submit"
            value="Update Order"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

export default Order;
