import React from 'react';
import logo from '../static/logo.png';
import profilePic from '../static/profile-pic.jpg';
import { user } from '../constants/userConstants.js'

export function Header() {
    return (
        <div className="header">
            <Logo />
            <Profile />
        </div>
    );
}

export function Profile() {
    return (
        <div className="profile">
            <a className="profile-link">{user}</a>
            <img src={profilePic} className="profile-pic" alt="profile-pic" />
        </div>
    );
}

export function Logo() {
    return (
        <img src={logo} className="logo" alt="logo" />
    );
}