import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsBoxSeam } from 'react-icons/bs';
import { TfiMoney } from 'react-icons/tfi';
import { DashboardService } from '../../api';
import { useQuery } from 'react-query';
import { convertToCurrency } from '../util/utilFunc';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
} from 'recharts';
import { useState } from 'react';
import { capitalCase } from 'change-case';
const pluralize = require('pluralize');

const Dashboard = () => {
  const fetchDashboard = useQuery('dashboard', () =>
    DashboardService.getDashboard()
  );
  const fetchSales = useQuery('sales', () => DashboardService.getSales());

  const [activeIndex, setActiveIndex] = useState(0);

  if (fetchDashboard.isLoading || fetchSales.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex place-content-between w-full gap-x-4">
        <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
          <AiOutlineUserAdd className="text-3xl" />
          <div className="w-full flex place-items-center flex-col">
            <div>
              <p className="text-xl">Total User</p>
              <p className="text-gray-400">
                {fetchSales.data?.data.total_user}
              </p>
            </div>
          </div>
        </div>
        <div className=" p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
          <BsBoxSeam className="text-3xl" />
          <div className="w-full flex place-items-center flex-col">
            <div>
              <p className="text-xl">Total Order</p>
              <p className="text-gray-400">
                {fetchSales.data?.data.total_order}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6  gap-x-4 w-full border-2 flex place-content-between place-items-center border-gray-400">
          <TfiMoney className="text-3xl" />
          <div className="w-full flex place-items-center flex-col">
            <div>
              <p className="text-xl">Total Sale</p>
              <p className="text-gray-400">
                {convertToCurrency(fetchSales.data?.data.total_sales || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className="h-96 p-4 w-[65%] border-gray-400 border-2 mt-5">
          <h1 className="text-xl font-bold text-center">Income Per Month </h1>
          <p className="text-lg text-gray-400 text-center">
            Per thousand Rupiah
          </p>
          <ResponsiveContainer width="97%" height="84%">
            <LineChart
              data={fetchDashboard.data?.income_per_month}
              className="mx-1 mt-2"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="natural"
                dataKey="income"
                stroke="#4b5563"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-96 p-4 w-[35%] border-gray-400 border-2 mt-5">
          <h1 className="text-xl font-bold text-center">
            Total Order Per Category{' '}
          </h1>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={RenderPieChart}
                data={fetchDashboard.data?.total_order_per_category}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={120}
                className="fill-gray-400"
                dataKey="total_order"
                onMouseEnter={(data, index) => setActiveIndex(index)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const RenderPieChart = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-4} textAnchor="middle" className="fill-gray-700">
        {capitalCase(pluralize.singular(payload.title))}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" className="fill-gray-700">
        {payload.total_order} Orders
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

export default Dashboard;
