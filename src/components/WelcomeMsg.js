import React from 'react';
import { user } from '../constants/userConstants.js'

function WelcomeMsg() {
    return (
        <>
            <h1 className="welcome-header">Welcome {user}</h1>
            <p className="welcome-msg">Select a category below and enter your input</p>
        </>
    );
}

export default WelcomeMsg;