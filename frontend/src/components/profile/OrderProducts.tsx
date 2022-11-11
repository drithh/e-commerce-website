import { GetUserOrder } from "../../api";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { convertToCurrency } from "../util/utilFunc";
interface props {
  order: GetUserOrder;
}

const OrderProducts = ({ order }: props) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <AnimateHeight
        duration={500}
        height={showMore ? "auto" : 100}
        className=" relative my-4 border-t border-y-gray-100 py-2 transition-all  duration-500"
      >
        <div>
          {order.products.map((product) => (
            <div key={product.id} className="flex gap-x-4 py-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 object-cover"
              />
              <div className="flex w-full justify-between pl-2 pr-6">
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
                <div className="flex w-40   flex-col place-content-center border-l border-gray-100 pl-4">
                  <div>Price</div>
                  <div className="font-semibold">
                    {convertToCurrency(
                      product.details.reduce(
                        (acc, curr) => acc + curr.quantity,
                        0
                      ) * product.price
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`${
            showMore ? "hidden" : "absolute"
          } bottom-0 h-10 w-full bg-gradient-to-t from-white to-transparent`}
        ></div>
      </AnimateHeight>
      <div className="mt-4  flex w-full flex-col place-content-end ">
        <button
          className="boder-b-gray-100 mb-4 flex w-full min-w-[8rem] flex-row place-items-center justify-end gap-x-2 border-0 border-b px-1 pb-2 pr-[5.5rem] text-sm text-gray-300 outline-0 transition duration-500 ease-in-out hover:text-black hover:outline-0 hover:ring-0 focus:outline-0"
          onClick={() => setShowMore(!showMore)}
        >
          <div>{showMore ? "Show Less" : "Show More"}</div>
          <HiOutlineChevronDown
            className={`transform ${
              showMore ? "rotate-180" : "rotate-0"
            } inline-block transform text-[1.5rem] opacity-60 transition duration-500 ease-in-out `}
            aria-hidden="true"
          />
        </button>
        <div className="w-full pr-[5.5rem] text-right">
          <span>Total </span>
          <span className="font-semibold">
            {convertToCurrency(
              order.products.reduce(
                (acc, curr) =>
                  acc +
                  curr.details.reduce((acc, curr) => acc + curr.quantity, 0) *
                    curr.price,
                0
              )
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderProducts;
