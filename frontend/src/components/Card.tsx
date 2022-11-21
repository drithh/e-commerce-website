import { FC, useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import { BestSeller, Product } from '../api';
import { convertToCurrency } from '../components/util/utilFunc';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface Props {
  item: BestSeller | Product;
}

const Card: FC<Props> = ({ item }) => {
  const { wishlist, addWishlistItem, deleteWishlistItem } = useWishlist();
  const { role } = useAuth();

  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);

  const { id, title, price, images } = item;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted = wishlist.data.find(
    (item) => item.product_id === id
  );
  const handleWishlist = () => {
    if (role !== 'guest') {
      alreadyWishlisted != null
        ? deleteWishlistItem!.mutate({ product_id: id })
        : addWishlistItem!.mutate({ id });
    }
  };

  return (
    <div className="w-60">
      <div
        className="group relative mb-1 overflow-hidden"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={itemLink} tabIndex={-1}>
          <img
            src={images[0]}
            alt={title}
            loading="lazy"
            className={`${
              isHovered ? 'hidden' : 'animate__fadeIn'
            } animate__animated h-80  object-cover`}
          />
          <img
            className={`${
              !isHovered ? 'hidden' : ''
            } h-80 transform object-cover transition-transform duration-1000 hover:scale-110`}
            src={images[1] || images[0]}
            alt={title}
          />
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full p-1 text-2xl"
          aria-label="Wishlist "
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted != null ? (
            <HiHeart className="text-red-500" />
          ) : (
            <HiOutlineHeart className="text-gray-500" />
          )}
        </button>
        <Link
          to={itemLink}
          className="absolute left-0 right-1/2 z-10 mx-auto translate-x-1/2 transform whitespace-nowrap bg-white px-4 py-2 font-lato font-semibold text-gray-700 transition-all  duration-500 hover:bg-gray-500 hover:text-gray-100 focus:bottom-8 focus:duration-75 group-hover:bottom-8 sm:block md:-bottom-10"
        >
          See Details
        </Link>
      </div>

      <div className="content font-lato">
        <Link
          to={itemLink}
          className="mb-1 block truncate text-base text-gray-700 no-underline sm:text-lg "
        >
          {title}
        </Link>
        <div className="text-gray-400">{convertToCurrency(price)}</div>
        <Link to={itemLink} className="text-sm font-bold uppercase sm:hidden">
          See Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
