import { FC } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  extraClass?: string;
  href: string;
  aria_label?: string;
  size?: 'sm' | 'normal' | 'xl';
  inverted?: boolean;
  noBorder?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
};

const LinkButton: FC<Props> = ({
  href,
  extraClass,
  size,
  aria_label,
  children,
  noBorder = true,
  inverted = true,
}) => {
  let btnSize = '';
  if (size === 'sm') {
    btnSize = 'py-2 sm:py-1 px-5';
  } else if (size === 'xl') {
    btnSize = 'py-4 sm:py-3 px-7  text-xl';
  } else {
    btnSize = 'py-3 sm:py-2 px-6';
  }

  return (
    <Link
      to={href}
      role="button"
      aria-label={aria_label}
      className={`cursor-pointe group inline-block bg-white text-center ${
        inverted
          ? 'hover:bg-gray-500 hover:text-gray-100'
          : 'hover:text-gray-400'
      } ${!noBorder && 'border border-gray-500'} ${btnSize} ${extraClass}`}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
