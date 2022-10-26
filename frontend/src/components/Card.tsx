import { FC, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useTranslations } from 'next-intl';
import { Link } from 'react-router-dom';
import Heart from '../assets/icons/Heart';
// import styles from './Card.module.css';
import HeartSolid from '../assets/icons/HeartSolid';
import { itemType } from '../context/cart/cart-types';
import { useCart } from '../context/cart/CartProvider';
import { useWishlist } from '../context/wishlist/WishlistProvider';

type Props = {
  item: itemType;
};

const Card: FC<Props> = ({ item }) => {
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);

  const { id, name, price, img1, img2 } = item;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(item) : addToWishlist!(item);
  };

  return (
    <div className="w-full">
      <div className="relative mb-1 overflow-hidden group">
        <Link
          to={itemLink}
          tabIndex={-1}
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isHovered && <img src={img1 as string} alt={name} />}
          {isHovered && (
            <img
              className="transform transition-transform duration-1000 hover:scale-110"
              src={img2 as string}
              alt={name}
            />
          )}
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full p-1"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        <button
          type="button"
          onClick={() => addOne!(item)}
          className="absolute font-lato left-0 right-1/2 z-10 mx-auto translate-x-1/2 transform whitespace-nowrap bg-white px-4 py-2 group-hover:bottom-8 font-semibold text-gray-400  transition-all duration-500 hover:bg-gray-500 hover:text-gray-100 focus:bottom-8 focus:duration-75 sm:block md:-bottom-10"
        >
          Add to cart
        </button>
      </div>

      <div className="content">
        <Link
          to={itemLink}
          className="mb-1 block truncate text-xs text-gray-500 no-underline sm:text-base"
        >
          {name}
        </Link>
        <div className="text-gray-400">$ {price}</div>
        <button
          type="button"
          onClick={() => addOne!(item)}
          className="text-sm font-bold uppercase sm:hidden"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Card;
