import React, { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export function InputBox({ onSendMessage }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const textareaRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    // Initialize WebSocket connection
    useEffect(() => {
        const socket = new SockJS('http://localhost:8086/ws');
        const stomp = Stomp.over(socket);

        stomp.connect({}, (frame) => {
            console.log('Connected to WebSocket:', frame);
            setStompClient(stomp);

            // Subscribe to the messages topic
            stomp.subscribe('/topic/messages', (messageOutput) => {
                const response = JSON.parse(messageOutput.body);
                console.log("Received from server:", response);
                // Handle the response if needed
            });
        });

        // Cleanup on unmount
        return () => {
            if (stomp) {
                stomp.disconnect();
            }
        };
    }, []);

    const handleOptionChange = (newOption, newLabel) => {
        if (selectedOption === newOption) {
            setSelectedOption('');
            setSelectedLabel('');
        } else {
            setSelectedOption(newOption);
            setSelectedLabel(newLabel);
        }
    };

    // Modified to use WebSocket
    const handleSendMessage = (text) => {
        if (stompClient && stompClient.connected) {
            const message = {
                maskId: selectedOption,
                textPrompt: text
            };
            stompClient.send("/app/send", {}, JSON.stringify(message));
            console.log("Message sent:", message);
            onSendMessage(text, selectedLabel); // Update UI
        } else {
            console.error("WebSocket connection not established");
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
                    onSendMessage={handleSendMessage}
                />
            </div>
        </>
    );
}


export function InputCategories({ selectedOption, onOptionChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                console.log('Fetching categories...'); // Debug log
                const response = await fetch('http://localhost:8086/getmasks');
                console.log('Response status:', response.status); // Debug log
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched data:', data); // Debug log
                setCategories(data);
            } catch (err) {
                console.error('Error details:', err); // More detailed error logging
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        console.log('Showing loading state'); // Debug log
        return <div>Loading categories...</div>;
    }
    
    if (error) {
        console.log('Showing error state:', error); // Debug log
        return <div>Error loading categories: {error}</div>;
    }

    console.log('Rendering categories:', categories); // Debug log

    return (
        <div className="categories-row">
            {categories.map(mask => (
                <button
                    key={mask.id}
                    className={`category-button ${selectedOption === mask.id ? 'selected' : ''}`}
                    onClick={() => onOptionChange(mask.id, mask.label)}
                >
                    {mask.label}
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