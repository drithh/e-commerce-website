import React from 'react';
import Banner from '../components/Banner';
// import Button from "../components/button/Button";
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

  return (
    <>
      <main id="main-content" className="mt-20 min-h-[60vh]">
        <Banner />

        {/* ===== Category Section ===== */}
        <section className="border-y-gray-100 h-auto w-full  border-b-2 py-10  ">
          <div className="text-center my-6">
            <h2 className="text-3xl">Our Collections</h2>
          </div>
          <div className="wrapper max-w-7xl mx-auto">
            <div className="app-max-width app-x-padding grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.map((item, index) => (
                <div className="w-full relative">
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
        <section className="py-4">test</section>
      </main>
    </>
  );
};

export default Home;
