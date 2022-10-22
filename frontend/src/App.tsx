import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App font-poppins relative ">
      <BrowserRouter>
        <Header />
        <div className=" min-h-screen">
          <Banner />
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
