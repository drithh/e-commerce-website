import { AiOutlineUserAdd } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { TfiMoney } from "react-icons/tfi";
const Dashboard = () => {
  return (
    <div className="flex place-content-between w-full gap-x-4">
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <AiOutlineUserAdd className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total Users</p>
            <p className="text-gray-400">200</p>
          </div>
        </div>
      </div>
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <BsBoxSeam className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total Orders</p>
            <p className="text-gray-400">200</p>
          </div>
        </div>
      </div>
      <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
        <TfiMoney className="text-3xl" />
        <div className="w-full flex place-items-center flex-col">
          <div>
            <p className="text-xl">Total Sales</p>
            <p className="text-gray-400">200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
