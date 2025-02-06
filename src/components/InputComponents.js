import React, { useState, useRef, useEffect } from 'react';

export function InputBox() {
    const [selectedOption, setSelectedOption] = useState('');
    const textareaRef = useRef(null);

    const handleOptionChange = (newOption) => {
        if (selectedOption === newOption) {
            setSelectedOption('');
        } else {
            setSelectedOption(newOption);
        }
    };

    useEffect(() => {
        if (selectedOption && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [selectedOption]);

    return (
        <>
            <div className={`categories-container ${selectedOption ? 'category-selected' : ''}`}>
                <InputCategories
                    selectedOption={selectedOption}
                    onOptionChange={handleOptionChange}
                />
            </div>
            <div className={`input-container ${selectedOption ? 'category-selected' : ''}`}>

                <InputText isDisabled={!selectedOption} textareaRef={textareaRef} />

            </div>
        </>
    );
}


export function InputCategories({ selectedOption, onOptionChange }) {
    const categories = [
        { id: 'buy', label: 'I want to buy' },
        { id: 'pivot', label: 'I want to pivot' },
        { id: 'chart', label: 'Show me a chart of...' },
        { id: 'other', label: '...' }
    ];

    return (
        <div className="categories-row">
            {categories.map(category => (
                <button
                    key={category.id}
                    className={`category-button ${selectedOption === category.id ? 'selected' : ''}`}
                    onClick={() => onOptionChange(category.id)}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}

export function InputText({ isDisabled, textareaRef }) {
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
    }

    return (
        <div className="input-wrapper">
            <textarea
                ref={textareaRef}
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
    )
}

