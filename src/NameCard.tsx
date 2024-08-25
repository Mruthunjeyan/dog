import React from 'react';
import './App.css';

interface NameCardProps {
    name: string;
}

const NameCard: React.FC<NameCardProps> = ({ name }) => {
    return (
        <div className="name-card">
            <h3 className="name-card-title">{name}</h3>
        </div>
    );
};
export default NameCard;
