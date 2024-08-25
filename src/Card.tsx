import React from 'react';
import './App.css';

interface CardProps {
    title: string;
    imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, imageUrl}) => {
    return (
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <img src={imageUrl} alt={title} className="card-image" />
        </div>
    );
};

export default Card;
