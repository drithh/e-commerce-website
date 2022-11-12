import { AiOutlineUserAdd } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { TfiMoney } from "react-icons/tfi";
import { DashboardService } from "../../api";
import { SalesService } from "../../api";
import { useQuery } from "react-query";
import { convertToCurrency } from "../util/utilFunc";
const Dashboard = () => {
  const fetchDashboard = useQuery("dashboard", () =>
    DashboardService.getDashboard()
  );
  const fetchSales = useQuery("sales", () => SalesService.getSales());
  if (fetchDashboard.isLoading || fetchSales.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex place-content-between w-full gap-x-4">
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <AiOutlineUserAdd className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total User</p>
            <p className="text-gray-400">{fetchDashboard.data?.total_user}</p>
          </div>
        </div>
      </div>
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <BsBoxSeam className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total Order</p>
            <p className="text-gray-400">{fetchDashboard.data?.total_order}</p>
          </div>
        </div>
      </div>
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <TfiMoney className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total Sale</p>
            <p className="text-gray-400">
              {convertToCurrency(fetchSales.data?.data.total || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
