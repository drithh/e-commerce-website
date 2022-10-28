import React from 'react';
import Banner from '../components/Banner';
import Card from '../components/Card';
import LinkButton from '../components/button/LinkButton';
import OverlayContainer from '../components/OverlayContainer';

const Home = () => {
  const data = [
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
    {
      imgSrc: '/img/banner_minipage2.webp',
      imgAlt: 'Hat Collection',
      title: 'Hat Collection',
    },
    {
      imgSrc: '/img/banner_minipage3.webp',
      imgAlt: 'Shoes Collection',
      title: 'Shoes Collection',
    },
  ];

  const currentItems = [
    {
      id: 1,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
    {
      id: 2,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
    {
      id: 3,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
    {
      id: 4,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
    {
      id: 5,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
    {
      id: 6,
      name: 'item1',
      price: 1000,
      img1: '/img/banner_minipage3.webp',
      img2: '/img/banner_minipage2.webp',
    },
  ];

  return (
    <>
      <main id="main-content" className="min-h-[60vh]">
        <Banner />

        {/* ===== Category Section ===== */}
        <section className="h-auto w-full border-b-2  border-y-gray-100 py-10  ">
          <div className="my-6 text-center">
            <h2 className="text-3xl">Our Collections</h2>
          </div>
          <div className="wrapper mx-auto max-w-7xl">
            <div className="app-max-width app-x-padding grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((item, index) => (
                <div className="relative w-full" key={index}>
                  <OverlayContainer imgSrc={item.imgSrc} imgAlt={item.imgAlt}>
                    <LinkButton
                      href="/product-category/women"
                      extraClass="absolute bottom-[10%] z-20"
                    >
                      {item.title}
                    </LinkButton>
                  </OverlayContainer>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Best Selling Section ===== */}
        <section className=" mt-16 mb-20  h-full w-full">
          <div className="wrapper mx-auto flex max-w-7xl flex-col justify-center ">
            <div className="flex justify-center">
              <div className="mb-8 w-3/4 text-center sm:w-1/2 md:w-1/3">
                <h2 className="mb-4 text-3xl">Best Selling</h2>
                <span>
                  Here are some of our best selling products. Explore yourself
                  in the latest trends.
                </span>
              </div>
            </div>
            <div className="app-x-padding mb-10 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 lg:gap-x-12">
              {currentItems.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
