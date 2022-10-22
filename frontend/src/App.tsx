import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App font-poppins relative ">
      <BrowserRouter>
        <Header />
        <Home />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
