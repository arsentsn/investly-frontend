import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <p>I'm just a piece of text</p>
      <Logo />
      <InputBox />
    </div>
  );
}

function Logo() {
  return (
    <img src={logo} className="logo" alt="logo" />
  )
}

function InputBox() {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <div className="input-container">
      <InputCategories
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <InputText isDisabled={!selectedOption} />
    </div>
  );
}

function InputCategories({ selectedOption, setSelectedOption }) {
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="left">
      <div>
        <input
          className="radio-input"
          type="radio"
          id="buy"
          name="category"
          value="buy"
          checked={selectedOption === 'buy'}
          onChange={handleOptionChange}
        />
        <label className="radio-input-label" htmlFor="buy">
          I want to buy stocks
        </label>
      </div>
      <div>
        <input
          className="radio-input"
          type="radio"
          id="pivot"
          name="category"
          value="pivot"
          checked={selectedOption === 'pivot'}
          onChange={handleOptionChange}
        />
        <label className="radio-input-label" htmlFor="pivot">
          I want to pivot
        </label>
      </div>
      <div>
        <input
          className="radio-input"
          type="radio"
          id="chart"
          name="category"
          value="chart"
          checked={selectedOption === 'chart'}
          onChange={handleOptionChange}
        />
        <label className="radio-input-label" htmlFor="chart">
          Show me a chart of my profits
        </label>
      </div>
      <div>
        <input
          className="radio-input"
          type="radio"
          id="other"
          name="category"
          value="other"
          checked={selectedOption === 'other'}
          onChange={handleOptionChange}
        />
        <label className="radio-input-label" htmlFor="other">
          ...
        </label>
      </div>
    </div>
  );
}

function InputText({ isDisabled }) {
  return (
    <div className="right">
      <textarea
        className="text-area"
        placeholder="Message investly"
        disabled={isDisabled}
      />
    </div>
  )
}

export default App;