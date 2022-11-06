import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import GhostButton from '../components/button/GhostButton';
import Heart from '../assets/icons/Heart';
import HeartSolid from '../assets/icons/HeartSolid';
import { SlSocialFacebook } from 'react-icons/sl';
import { SiInstagram } from 'react-icons/si';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductService } from '../api';
import Button from '../components/button/Button';

const Product = () => {
  const { id } = useParams();

  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { wishlist, addWishlistItem, deleteWishlistItem } = useWishlist();
  const { role } = useAuth();

  const fetchProduct = useQuery(
    ['product', id],
    () => ProductService.getProduct(id as string),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => setMainImage(data.images[0] as string),
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
    <main id="main-content" className="min-h-[60vh] my-20">
      {/* ===== Breadcrumb Section ===== */}
      <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray-200 bg-gray-50">
        <div className="w-[80rem] mx-auto">
          <div className="breadcrumb w=full text-left">
            <Link to="/" className="text-gray-400">
              Home
            </Link>{' '}
            /{' '}
            <Link
              to={`/products?category=${fetchProduct.data!.category_id}`}
              className="text-gray-400 capitalize"
            >
              {fetchProduct.data!.category_name}
            </Link>{' '}
            / <span>{fetchProduct.data!.title}</span>
          </div>
        </div>
      </div>
      {/* ===== Main Content Section ===== */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <div className="imgSection w-full md:w-1/2 h-full flex">
          <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
            <img
              className={`cursor-pointer ${
                mainImage === fetchProduct.data!.images[0]
                  ? 'opacity-100 border border-gray-300'
                  : 'opacity-50'
              }`}
              onClick={() => setMainImage(fetchProduct.data!.images[0])}
              src={fetchProduct.data!.images[0] as string}
              alt={fetchProduct.data!.title}
              width={1000}
              height={1282}
            />
            <img
              className={`cursor-pointer ${
                mainImage === fetchProduct.data!.images[1]
                  ? 'opacity-100 border border-gray-300'
                  : 'opacity-50'
              }`}
              onClick={() => setMainImage(fetchProduct.data!.images[1])}
              src={fetchProduct.data!.images[1] as string}
              alt={fetchProduct.data!.title}
              width={1000}
              height={1282}
            />
          </div>
          <div className="w-full sm:w-3/4 h-full m-0 sm:m-4">
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
            <div className="hidden sm:block h-full">
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
        <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
          <h1 className="text-3xl mb-4">{fetchProduct.data!.title}</h1>
          <span className="text-2xl text-gray-400 mb-2">
            $ {fetchProduct.data!.price}
          </span>
          <span className="mb-2 text-justify">
            {fetchProduct.data!.product_detail}
          </span>
          <span className="mb-2">
            Availability: {/* find quantity in current size */}
            {
              fetchProduct.data!.stock.find((item) => item.size === size)
                ?.quantity
            }
          </span>
          <span className="mb-2">Size: {size}</span>
          <div className="sizeContainer flex space-x-4 text-sm mb-4">
            {fetchProduct.data!.size.map((singleSize: string) => (
              <button
                key={singleSize}
                className={`${
                  size === singleSize
                    ? 'border-gray-500'
                    : 'border-gray-300 text-gray-400'
                } w-8 h-8 flex items-center justify-center border hover:bg-gray-500 hover:text-gray-100`}
                onClick={() => setSize(singleSize)}
              >
                {singleSize}
              </button>
            ))}
          </div>
          <div className="addToCart flex flex-col sm:flex-row md:flex-col lg:flex-row space-y-4 sm:space-y-0 mb-4">
            <div className="plusOrMinus h-12 flex border justify-center border-gray-300 divide-x-2 divide-gray-300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
              <div
                onClick={() => setQuantity((prevState) => prevState - 1)}
                className={`${
                  quantity === 1 && 'pointer-events-none'
                } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray-500 hover:text-gray-100`}
              >
                -
              </div>
              <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">
                {quantity}
              </div>
              <div
                onClick={() => setQuantity((prevState) => prevState + 1)}
                className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray-500 hover:text-gray-100"
              >
                +
              </div>
            </div>
            <div className="flex h-12 space-x-4 w-full">
              <Button
                value="Add to Cart"
                size="lg"
                extraClass={`flex-grow text-center whitespace-nowrap`}
                // onClick={() => addItem!(currentItem)}
              />
              <GhostButton onClick={handleWishlist}>
                {alreadyWishlisted ? <HeartSolid /> : <Heart />}
              </GhostButton>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
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
