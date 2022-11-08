import { GetUserOrder } from '../../api';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { useState } from 'react';
import AnimateHeight from 'react-animate-height';

interface props {
  order: GetUserOrder;
}

const OrderProducts = ({ order }: props) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <AnimateHeight
        duration={500}
        height={showMore ? 'auto' : 100}
        className=" py-2 my-4 border-t border-y-gray-100 transition-all duration-500  relative"
      >
        <div>
          {order.products.map((product) => (
            <div key={product.id} className="flex gap-x-4 py-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex justify-between w-full pl-2 pr-6">
                <div className="left-product">
                  <span className="font-semibold">{product.name}</span>
                  {product.details.map((detail, index) => (
                    <div key={index}>
                      <span className="text-gray-300">
                        Size: {detail.size}, Quantity: {detail.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-l border-gray-100   w-40 pl-4 place-content-center flex flex-col">
                  <div>Price</div>
                  <div className="font-semibold">
                    Rp.
                    {product.details.reduce(
                      (acc, curr) => acc + curr.quantity,
                      0
                    ) * product.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            showMore ? 'hidden' : 'absolute'
          } bottom-0 w-full h-10 bg-gradient-to-t from-white to-transparent`}
        ></div>
      </AnimateHeight>
      <div className="flex  place-content-end flex-col w-full mt-4 ">
        <button
          className="flex min-w-[8rem] text-sm flex-row place-items-center justify-end gap-x-2 border-0 px-1 pb-2 text-gray-300 outline-0 transition duration-500 ease-in-out hover:text-black hover:outline-0 hover:ring-0 focus:outline-0 w-full border-b boder-b-gray-100 pr-[5.5rem] mb-4"
          onClick={() => setShowMore(!showMore)}
        >
          <div>{showMore ? 'Show Less' : 'Show More'}</div>
          <HiOutlineChevronDown
            className={`transform ${
              showMore ? 'rotate-180' : 'rotate-0'
            } transition duration-500 ease-in-out inline-block transform text-[1.5rem] opacity-60 `}
            aria-hidden="true"
          />
        </button>
        <div className="w-full text-right pr-[5.5rem]">
          <span>Total </span>
          <span className="font-semibold">
            Rp.
            {order.products.reduce(
              (acc, curr) =>
                acc +
                curr.details.reduce((acc, curr) => acc + curr.quantity, 0) *
                  curr.price,
              0
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderProducts;
