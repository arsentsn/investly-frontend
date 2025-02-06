import React from 'react';
import { Header } from './components/HeaderComponents';
import WelcomeMsg from './components/WelcomeMsg';
import { InputBox } from './components/InputComponents';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <WelcomeMsg />
      <InputBox />
    </div>
  );
}

let user = "bro";

export default App;