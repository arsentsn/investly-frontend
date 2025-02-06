import React, { useState, useRef, useEffect } from 'react';

export function InputBox({ onSendMessage }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const textareaRef = useRef(null);

    const handleOptionChange = (newOption, newLabel) => {
        if (selectedOption === newOption) {
            setSelectedOption('');
            setSelectedLabel('');
        } else {
            setSelectedOption(newOption);
            setSelectedLabel(newLabel);
        }
    };

    useEffect(() => {
        if (selectedOption && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [selectedOption]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const ignoredKeys = ['Enter', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'];
            if (!ignoredKeys.includes(event.key) && textareaRef.current && !textareaRef.current.disabled) {
                textareaRef.current.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <div className={`categories-container ${selectedOption ? 'category-selected' : ''}`}>
                <InputCategories
                    selectedOption={selectedOption}
                    onOptionChange={handleOptionChange}
                />
            </div>
            <div className={`input-container ${selectedOption ? 'category-selected' : ''}`}>
                <InputText
                    isDisabled={!selectedOption}
                    textareaRef={textareaRef}
                    onSendMessage={(text) => onSendMessage(text, selectedLabel)}
                />
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
                    onClick={() => onOptionChange(category.id, category.label)}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}


export function InputText({ isDisabled, textareaRef, onSendMessage }) {
    const [text, setText] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
    }

    const handleSubmit = () => {
        if (text.trim() !== "") {
            onSendMessage(text);
            setText('');
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default to avoid newline
            handleSubmit();
        }
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
                onKeyPress={handleKeyPress}
            />
            <button
                className="submit-button"
                disabled={isDisabled || text.trim() === ""}
                onClick={handleSubmit}
            >
                ➤
            </button>
        </div>
    )
}