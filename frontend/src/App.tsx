import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';

function App() {
  return (
    <div className="App font-poppins relative bg-red-200 min-h-[200vh]">
      <BrowserRouter>
        <Header />
        <Banner />
      </BrowserRouter>
    </div>
  );
}

export default App;
