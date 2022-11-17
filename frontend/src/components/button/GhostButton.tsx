import { FC } from 'react';

type Props = {
  extraClass?: string;
  size?: 'sm' | 'normal' | 'lg';
  inverted?: boolean;
  noBorder?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

// eslint-disable-next-line react/display-name
const GhostButton: FC<Props> = ({
  onClick,
  size,
  extraClass,
  noBorder = false,
  inverted = true,
  children,
}) => {
  let btnSize = '';
  if (size === 'sm') {
    btnSize = 'py-2 sm:py-1 px-5';
  } else if (size === 'lg') {
    btnSize = 'py-4 sm:py-3 px-7  text-xl';
  } else {
    btnSize = 'py-3 sm:py-2 px-6';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer bg-white text-center text-xl tracking-widest text-gray-500 sm:text-base ${
        !noBorder && 'border border-gray-500'
      } ${
        inverted
          ? 'hover:bg-gray-500 hover:text-gray-100'
          : 'hover:text-gray-400'
      } ${btnSize} ${extraClass}`}
    >
      {children}
    </button>
  );
};

export default GhostButton;
