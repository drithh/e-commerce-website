import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import GhostButton from '../components/button/GhostButton';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { SlSocialFacebook } from 'react-icons/sl';
import { SiInstagram } from 'react-icons/si';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ApiError, ProductService } from '../api';
import Button from '../components/button/Button';
import { useCart } from '../context/CartContext';
import { convertToCurrency } from '../components/util/utilFunc';
import { toast } from 'react-toastify';

const Product = () => {
  const { id } = useParams();

  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { wishlist, addWishlistItem, deleteWishlistItem } = useWishlist();
  const { role } = useAuth();
  const { addCartItem } = useCart();

  const fetchProduct = useQuery(
    ['product', id],
    () => ProductService.getProduct(id as string),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setMainImage(data.images[0] as string);
        setSize((data.size as string[])[0]);
      },
    }
  );

  if (id === undefined) {
    return <div>Error...</div>;
  }
  if (fetchProduct.isLoading) {
    return <div>Loading...</div>;
  }
  if (fetchProduct.isError) {
    return <div>Error...</div>;
  }

  const alreadyWishlisted = wishlist.data!.find(
    (item) => item.product_id === id
  );
  const handleWishlist = () => {
    if (role !== 'guest') {
      alreadyWishlisted
        ? deleteWishlistItem!.mutate({ product_id: id })
        : addWishlistItem!.mutate({ id });
    }
  };
  return (
    <main id="main-content" className="my-20 min-h-[60vh]">
      {/* ===== Breadcrumb Section ===== */}
      <div className="bg-lightgreen flex h-16 w-full items-center border-t-2 border-gray-200 bg-gray-50">
        <div className="mx-auto w-[80rem]">
          <div className="breadcrumb w=full text-left">
            <Link to="/" className="text-gray-400">
              Home
            </Link>{' '}
            /{' '}
            <Link
              to={`/products?category=${fetchProduct.data!.category_id}`}
              className="capitalize text-gray-400"
            >
              {fetchProduct.data!.category_name}
            </Link>{' '}
            / <span>{fetchProduct.data!.title}</span>
          </div>
        </div>
      </div>
      {/* ===== Main Content Section ===== */}
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <div className="imgSection flex h-full w-full md:w-1/2">
          <div className="my-4 hidden h-full w-full space-y-4 sm:block sm:w-1/4">
            {fetchProduct.data!.images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={fetchProduct.data!.title}
                className={`cursor-pointer ${
                  mainImage === image
                    ? 'border border-gray-300 opacity-100'
                    : 'opacity-50'
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
          <div className="m-0 h-full w-full sm:m-4 sm:w-3/4">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              pagination={{
                clickable: true,
              }}
              className="mySwiper sm:hidden"
            >
              <SwiperSlide>
                <img
                  className="each-slide w-full"
                  src={fetchProduct.data!.images[0] as string}
                  width={1000}
                  height={1282}
                  alt={fetchProduct.data!.title}
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="each-slide w-full"
                  src={fetchProduct.data!.images[1] as string}
                  width={1000}
                  height={1282}
                  alt={fetchProduct.data!.title}
                />
              </SwiperSlide>
            </Swiper>
            <div className="hidden h-full sm:block">
              <img
                className="w-full"
                src={mainImage}
                width={1000}
                height={1282}
                alt={fetchProduct.data!.title}
              />
            </div>
          </div>
        </div>
        <div className="infoSection flex h-auto w-full flex-col py-8 sm:pl-4 md:w-1/2">
          <h1 className="text-3xl">{fetchProduct.data!.title}</h1>
          <span className="mb-4 text-lg text-gray-400">
            {fetchProduct.data!.brand}
          </span>
          <span className="mb-2 text-xl text-gray-400">
            {convertToCurrency(fetchProduct.data!.price)}
          </span>
          <span className="mb-2 text-justify">
            {fetchProduct.data!.product_detail}
          </span>
          <span className="mb-2">
            Availability: {/* find quantity in current size */}
            {fetchProduct.data!.stock?.find((item) => item.size === size)
              ?.quantity || 0}
          </span>
          <span className="mb-2">Size: {size}</span>
          <div className="sizeContainer mb-4 flex space-x-4 text-sm">
            {fetchProduct
              .data!.size?.map((singleSize) => ({
                singleSize,
                points:
                  singleSize === 'M'
                    ? 0
                    : singleSize.length * (singleSize.includes('S') ? -1 : 1),
              }))
              .sort((a, b) => a.points - b.points)
              .map(({ singleSize }) => (
                <button
                  key={singleSize}
                  className={`${
                    size === singleSize
                      ? 'border-gray-500'
                      : 'border-gray-300 text-gray-400'
                  } flex h-8 w-8 items-center justify-center border hover:bg-gray-500 hover:text-gray-100`}
                  onClick={() => setSize(singleSize)}
                >
                  {singleSize}
                </button>
              ))}
          </div>
          <div className="addToCart mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 md:flex-col lg:flex-row">
            <div className="plusOrMinus mb-4 mr-0 flex h-12 justify-center divide-x-2 divide-gray-300 border border-gray-300 sm:mr-4 md:mr-0 lg:mr-4">
              <div
                onClick={() => setQuantity((prevState) => prevState - 1)}
                className={`${
                  quantity === 1 && 'pointer-events-none'
                } flex h-full w-full cursor-pointer items-center justify-center hover:bg-gray-500 hover:text-gray-100 sm:w-12`}
              >
                -
              </div>
              <div className="pointer-events-none flex h-full w-28 items-center justify-center sm:w-12">
                {quantity}
              </div>
              <div
                onClick={() => setQuantity((prevState) => prevState + 1)}
                className="flex h-full w-full cursor-pointer items-center justify-center hover:bg-gray-500 hover:text-gray-100 sm:w-12"
              >
                +
              </div>
            </div>
            <div className="flex h-12 w-full space-x-4">
              <Button
                value="Add to Cart"
                size="lg"
                extraClass={`flex-grow text-center whitespace-nowrap`}
                onClick={() => {
                  if (quantity > 0) {
                    addCartItem?.mutate(
                      {
                        product_id: fetchProduct.data!.id,
                        quantity,
                        size,
                      },
                      {
                        onError: (error) => {
                          toast.error((error as ApiError).body.message);
                        },
                      }
                    );
                  }
                }}
              />
              <GhostButton onClick={handleWishlist} extraClass="text-4xl">
                {alreadyWishlisted ? (
                  <HiHeart className="text-gray-500 text-4xl w-7 h-7" />
                ) : (
                  <HiOutlineHeart className="text-gray-500 text-4xl w-7 h-7" />
                )}
              </GhostButton>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <span>Share</span>
            <SlSocialFacebook className="h-4 cursor-pointer text-gray-400 hover:text-gray-500" />
            <SiInstagram className="h-4 cursor-pointer text-gray-400 hover:text-gray-500" />
          </div>
        </div>
      </div>
      {/* ===== Horizontal Divider ===== */}
      {/* <div className="border-b-2 border-gray-200"></div> */}

      {/* ===== You May Also Like Section ===== */}
      {/* <div className="recSection my-8 app-max-width app-x-padding">
        <h2 className="text-3xl mb-6">{t('you_may_also_like')}</h2>
        <Swiper
          slidesPerView={2}
          // centeredSlides={true}
          spaceBetween={10}
          loop={true}
          grabCursor={true}
          pagination={{
            clickable: true,
            type: 'bullets',
          }}
          className="mySwiper card-swiper sm:hidden"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="mb-6">
                <Card key={item.id} item={item} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
          {products.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div> */}
    </main>
  );
};
export default Product;
