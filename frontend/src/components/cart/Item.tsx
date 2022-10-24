import React, { FC } from 'react';
import { roundDecimal } from '../util/utilFunc';

type Props = {
  img: string;
  name: string;
  price: number;
  qty: number;
  onAdd?: () => void;
  onRemove?: () => void;
  onDelete?: () => void;
};

const Item: FC<Props> = ({
  img,
  name,
  price,
  qty,
  onAdd,
  onRemove,
  onDelete,
}) => {
  return (
    <div className="item flex bg-white my-4 border-b-2 pb-4 border-gray-200">
      <img className="w-2/12" src={img} alt={name} width={70} height={104} />
      <div className="midPart mx-4 flex-grow">
        <span>{name}</span>
        <div className="plusOrMinus w-2/6 mt-4 flex border border-gray-300 divide-x-2 divide-gray-300">
          <div
            onClick={onRemove}
            className="h-full w-12 flex justify-center items-center cursor-pointer hover:bg-gray-500 hover:text-gray-100"
          >
            -
          </div>
          <div className="h-full w-12 flex justify-center items-center pointer-events-none">
            {qty}
          </div>
          <div
            onClick={onAdd}
            className="h-full w-12 flex justify-center items-center cursor-pointer hover:bg-gray-500 hover:text-gray-100"
          >
            +
          </div>
        </div>
      </div>
      <div className="lastPart flex flex-col items-end">
        <button
          onClick={onDelete}
          type="button"
          className="outline-none text-gray-300 hover:text-gray-500 focus:outline-none text-xl mb-3"
        >
          &#10005;
        </button>
        <span>$ {roundDecimal(price)}</span>
      </div>
    </div>
  );
};

export default Item;
