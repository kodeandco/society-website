import React from 'react';
import './Button.css';

export default function Button({ text, onClick, type = "button", variant = "primary" }) {
  return (
    <button 
      className={`btn_container ${variant}`} 
      onClick={onClick} 
      type={type}
    >
      {text}
    </button>
  );
}
