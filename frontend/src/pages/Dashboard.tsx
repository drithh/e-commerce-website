import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SlGraph } from 'react-icons/sl';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { BsBookmark } from 'react-icons/bs';
import { IoShirtOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
const Home = () => {
  return (
    <>
      {/* ===== Head Section ===== */}
      <Header />

      <main
        id="main-content"
        className=" mt-20 min-h-[60vh] flex  border-gray-400 border-y-2"
      >
        {/* ===== Side Panel Section ===== */}
        <section className="side-panel w-52 pl-2 border-r-2 border-gray-400 inset-0 flex gap-y-[2px] flex-col  pt-4 font-medium">
          <div className="pl-4 hover:text-gray-500 cursor-pointer  flex gap-x-3 place-items-center py-4">
            <span className="text-xl">
              <SlGraph />
            </span>
            Dashboard
          </div>
          <div className="pl-4 hover:text-gray-500 cursor-pointer  flex gap-x-3 place-items-center py-4">
            <span className="text-xl">
              <MdOutlineAttachMoney />
            </span>
            Orders
          </div>
          <div className="pl-4 hover:text-gray-500 cursor-pointer  flex gap-x-3 place-items-center py-4">
            <span className="text-xl">
              <IoShirtOutline />
            </span>
            Products
          </div>
          <div className="pl-4 hover:text-gray-500 cursor-pointer  flex gap-x-3 place-items-center py-4">
            <span className="text-xl">
              <BsBookmark />
            </span>
            Categories
          </div>
          <div className="pl-4 hover:text-gray-500 cursor-pointer  flex gap-x-3 place-items-center py-4">
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

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export default Home;
