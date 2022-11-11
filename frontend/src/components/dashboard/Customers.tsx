import { useState } from "react";
import { useQuery } from "react-query";
import { DashboardService } from "../../api";
import Pagination from "../Pagination";
import { convertToCurrency } from "../util/utilFunc";

interface DefaultParams {
  page: number;
  pageSize: number;
}

const Customers = () => {
  const [params, setParams] = useState<DefaultParams>({
    page: 1,
    pageSize: 15,
  });
  const fetchCustomers = useQuery(["customers", params], () =>
    DashboardService.getCustomer(params.page, params.pageSize)
  );

  if (fetchCustomers.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full whitespace-nowrap px-8 pt-4 pb-8 border border-gray-500">
      <div>
        <tr className="border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4">
          <th className="py-2 text-left font-semibold table-cell flex-[5]">
            Name
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[4]">
            Email
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[3]">
            Total Order
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[3]">
            Total Spent
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-[3]">
            Last Order
          </th>
        </tr>
      </div>
      <div className="mb-8">
        {fetchCustomers.data?.data.map((customer) => {
          return (
            <tr
              className=" border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4 hover:bg-gray-50 cursor-pointer"
              key={customer.id}
            >
              <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[5]">
                {customer.name}
              </td>
              <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[4]">
                {customer.email}
              </td>
              <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                {customer.total_order}
              </td>
              <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                {convertToCurrency(customer.total_spent)}
              </td>
              <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-[3]">
                {customer.last_order}
              </td>
            </tr>
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
