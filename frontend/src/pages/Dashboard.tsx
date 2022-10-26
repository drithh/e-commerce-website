import React from 'react';

import { SlGraph } from 'react-icons/sl';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { BsBookmark } from 'react-icons/bs';
import { IoShirtOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
const Home = () => {
  return (
    <>
      <main
        id="main-content"
        className=" mt-20 flex min-h-[60vh]  border-y-2 border-gray-400"
      >
        {/* ===== Side Panel Section ===== */}
        <section className="side-panel inset-0 flex w-52 flex-col gap-y-[2px] border-r-2 border-gray-400 pl-2  pt-4 font-medium">
          <div className="flex cursor-pointer place-items-center  gap-x-3 py-4 pl-4 hover:text-gray-500">
            <span className="text-xl">
              <SlGraph />
            </span>
            Dashboard
          </div>
          <div className="flex cursor-pointer place-items-center  gap-x-3 py-4 pl-4 hover:text-gray-500">
            <span className="text-xl">
              <MdOutlineAttachMoney />
            </span>
            Orders
          </div>
          <div className="flex cursor-pointer place-items-center  gap-x-3 py-4 pl-4 hover:text-gray-500">
            <span className="text-xl">
              <IoShirtOutline />
            </span>
            Products
          </div>
          <div className="flex cursor-pointer place-items-center  gap-x-3 py-4 pl-4 hover:text-gray-500">
            <span className="text-xl">
              <BsBookmark />
            </span>
            Categories
          </div>
          <div className="flex cursor-pointer place-items-center  gap-x-3 py-4 pl-4 hover:text-gray-500">
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            Customers
          </div>
        </section>
        <section>
          test
          <div></div>
        </section>
      </main>
    </>
  );
};

export default Home;
