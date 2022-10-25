import React from 'react';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      {/* ===== Head Section ===== */}
      <Header />
      <main id="main-content" className="mt-20 min-h-[60vh]">
        <Banner />
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export default Home;
