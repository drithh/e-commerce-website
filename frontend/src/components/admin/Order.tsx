import { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { useMutation, useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { capitalCase } from 'change-case';
import dayjs from 'dayjs';

import { ApiError, OrderService } from '../../api';
import Button from '../button/Button';
import Dropdown from '../input/Dropdown';
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
        fetchOrder.refetch();
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
    updateOrder.mutate({ id, status });
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Update Order</h2>
      <div className="flex py-3 ">
        <Link to="/admin/orders" className="flex place-items-center  gap-x-2">
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <div className="w-full border border-gray-500 p-6 pb-4">
          <div className="mb-6 flex w-full place-content-between  text-[1.05rem] uppercase text-gray-400">
            <div>
              {dayjs(fetchOrder.data?.created_at).format(
                'dddd, MMMM D YYYY, h:mm A'
              )}
            </div>
            <div className="tracking-wider">
              {capitalCase(fetchOrder.data?.status || '')}
            </div>
          </div>
          <div className=" mb-6 grid grid-cols-2  border-b-2 border-gray-100 pb-6 text-gray-700 ">
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
        <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
          <div>
            <tr className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
              <th className="table-cell flex-[3] py-2 text-left font-semibold">
                Product
              </th>
              <th className="table-cell flex-1 py-2 text-left font-semibold">
                Size
              </th>
              <th className="table-cell flex-1 py-2 text-left font-semibold">
                Quantity
              </th>
              <th className="table-cell flex-[1.5] py-2 text-left font-semibold">
                Unit Price
              </th>
              <th className="table-cell flex-[1.5] py-2 text-left font-semibold">
                Total
              </th>
            </tr>
          </div>
          <div className="">
            {fetchOrder.data?.products.map((product, index) => {
              return product.details.map((detail, index) => {
                return (
                  <tr
                    className=" flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4 "
                    key={index}
                  >
                    <td className="table-cell flex-[3] overflow-hidden text-ellipsis py-2 text-left font-normal">
                      {product.name}
                    </td>
                    <td className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                      {detail.size}
                    </td>
                    <td className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                      {detail.quantity}
                    </td>
                    <td className="table-cell flex-[1.5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                      {convertToCurrency(product.price)}
                    </td>
                    <td className="table-cell flex-[1.5] overflow-hidden text-ellipsis py-2 text-left font-normal">
                      {convertToCurrency(product.price * detail.quantity)}
                    </td>
                  </tr>
                );
              });
            })}
          </div>
        </div>
        <div className="w-full whitespace-nowrap border border-gray-500 py-6 pl-12 pr-24">
          <div className="py flex">
            <p className="flex-[7] font-semibold">Sum Product</p>
            <p className="flex-1 text-left">
              {convertToCurrency(
                fetchOrder.data?.products.reduce((a, b) => {
                  return (
                    a + b.details.reduce((a, b) => a + b.quantity, 0) * b.price
                  );
                }, 0) || 0
              )}
            </p>
          </div>
          <div className="mb-4 flex border-b-2 border-gray-100 pt-2 pb-4">
            <p className="flex-[7] font-semibold">Shipping Fee</p>
            <p className="flex-1 text-left">
              {convertToCurrency(fetchOrder.data?.shipping_price || 0)}
            </p>
          </div>
          <div className="flex">
            <p className="flex-[7] font-semibold">Total</p>
            <p className="flex-1 text-left">
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
