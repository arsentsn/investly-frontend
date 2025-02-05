import React, { useState } from 'react';
import logo from './logo.svg';
import profilePic from './profile-pic.jpg';
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

const user = "bro"

function Header() {
  return (
    <div className="header">
      <Logo />
      <Profile />
    </div>
  )
}

function Profile() {
  return (
    <div className="profile">
      <a className="profile-link">{user}</a>
      <img src={profilePic} className="profile-pic" alt="profile-pic" />
    </div>
  )
}

function WelcomeMsg() {
  return (
    <>
      <h1 className="welcome-header">Welcome {user}</h1>
      <p class="welcome-msg">Select a category below and enter your input</p>
    </>
  )
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
          I want to buy
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
          Show me a chart of...
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
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  }
  return (
    <div className="right">
      <div className="input-wrapper">
        <textarea
          className="text-area"
          placeholder="Message investly"
          disabled={isDisabled}
          value={text}
          onChange={handleTextChange}
        />
        <button className="submit-button"
          disabled={isDisabled || text.trim() === ""}>
          ➤
        </button>
      </div>
    </div>
  )
}

export default App;