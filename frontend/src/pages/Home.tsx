import React from 'react';
import Banner from '../components/Banner';
// import Button from "../components/button/Button";
import LinkButton from '../components/button/LinkButton';
import OverlayContainer from '../components/OverlayContainer';

const Home = () => {
  return (
    <>
      <main id="main-content" className="mt-20 min-h-[60vh]">
        <Banner />

        {/* ===== Category Section ===== */}
        <section className="border-gray100 h-auto w-full border border-b-2 py-10">
          <div className="app-max-width app-x-padding grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="w-full sm:col-span-2 lg:col-span-2">
              <OverlayContainer
                imgSrc="/img/banner_minipage1.webp"
                imgAlt="New Arrivals"
              >
                <LinkButton
                  href="/product-category/new-arrivals"
                  extraClass="absolute bottom-10-per sm:right-10-per z-20"
                >
                  New Arrivals
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer
                imgSrc="/img/banner_minipage2.webp"
                imgAlt="Women Collection"
              >
                <LinkButton
                  href="/product-category/women"
                  extraClass="absolute bottom-10-per z-20"
                >
                  Women Collection
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer
                imgSrc="/img/banner_minipage3.webp"
                imgAlt="Men Collection"
              >
                <LinkButton
                  href="/product-category/men"
                  extraClass="absolute bottom-10-per z-20"
                >
                  Men Collection
                </LinkButton>
              </OverlayContainer>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
