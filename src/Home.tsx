import React from 'react';
import { useNavigate } from 'react-router-dom';
import dogImage from './dog2.svg';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <>
      <div className='navbar'>

            <div className='title-container'>
                <h1 className="home-title">Home</h1>
            </div>

            <div className='btn-container'>
                <button className='btn' onClick={() => handleNavigate('/name')}>Names</button>
                <button className='btn' onClick={() => handleNavigate('/images')}>Dog Images</button>
            </div>

      </div>

      <div className='img-container'>
        <img className="dog-img" src={dogImage} alt="Dog" />
      </div>     
      
      </>
    );
};

export default Home;
