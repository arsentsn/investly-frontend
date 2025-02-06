import React, { useState } from 'react';

export function InputBox() {
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

export function InputCategories({ selectedOption, setSelectedOption }) {
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

export function InputText({ isDisabled }) {
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