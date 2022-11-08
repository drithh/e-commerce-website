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
    <div className="item my-4 flex border-b-2 border-gray-200 bg-white pb-4">
      <img className="w-2/12" src={img} alt={name} width={70} height={104} />
      <div className="midPart mx-4 flex-grow">
        <span>{name}</span>
        <div className="plusOrMinus mt-4 flex w-2/6 divide-x-2 divide-gray-300 border border-gray-300">
          <div
            onClick={onRemove}
            className="flex h-full w-12 cursor-pointer items-center justify-center hover:bg-gray-500 hover:text-gray-100"
          >
            -
          </div>
          <div className="pointer-events-none flex h-full w-12 items-center justify-center">
            {qty}
          </div>
          <div
            onClick={onAdd}
            className="flex h-full w-12 cursor-pointer items-center justify-center hover:bg-gray-500 hover:text-gray-100"
          >
            +
          </div>
        </div>
      </div>
      <div className="lastPart flex flex-col items-end">
        <button
          onClick={onDelete}
          type="button"
          className="mb-3 text-xl text-gray-300 outline-none hover:text-gray-500 focus:outline-none"
        >
          &#10005;
        </button>
        <span>Rp{roundDecimal(price)}</span>
      </div>
    </div>
  );
};

export default Item;
