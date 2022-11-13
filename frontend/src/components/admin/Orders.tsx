import { useQuery } from "react-query";
import { DashboardService } from "../../api";
import { convertToCurrency } from "../util/utilFunc";
import { capitalCase } from "change-case";
import Pagination from "../Pagination";
import { useState } from "react";
import { Link } from "react-router-dom";

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Orders = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 20,
  });

  const fetchOrders = useQuery(["orders", params], () =>
    DashboardService.getOrder(params.page, params.pageSize)
  );

  if (fetchOrders.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" whitespace-nowrap mb-8 px-8 pt-4 pb-8 border border-gray-500">
      <div>
        <tr className="border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4">
          <th className="py-2 text-left font-semibold table-cell flex-[2]">
            Created At
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[3]">
            Name
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[6]">
            Address
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[2]">
            Nb Product
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[2]">
            Product Total
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[2]">
            Status
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchOrders.data?.data.map((order, index) => {
          return (
            <Link to={`${order.id}`}>
              <tr
                className=" border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4 hover:bg-gray-50 cursor-pointer"
                key={index}
              >
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[2]">
                  {order.created_at}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                  {order.name}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[6]">
                  {order.address}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[2]">
                  {order.total_product}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[2]">
                  {convertToCurrency(order.total_price)}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[2]">
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
