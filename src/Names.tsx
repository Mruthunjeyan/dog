import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NameCard from './NameCard';
import './App.css';
import { useNavigate } from 'react-router-dom';

interface BreedList {
    [key: string]: string[];
}

const Names: React.FC = () => {
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [visibleBreeds, setVisibleBreeds] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBreedNames = async () => {
            try {
                const response = await axios.get('https://dog.ceo/api/breeds/list/all');
                const breedList: BreedList = response.data.message;
                const names: string[] = [];

                for (const breed in breedList) {
                    if (breedList[breed].length > 0) {
                        breedList[breed].forEach(subBreed => {
                            const name = `${subBreed} ${breed}`;
                            names.push(name);
                        });
                    } else {
                        names.push(breed);
                    }
                }

                setBreedNames(names);
                loadMoreBreeds(1, names);
            } catch (error) {
                console.error('Error fetching breed names:', error);
            }
        };

        fetchBreedNames();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    loadMoreBreeds(page, breedNames);
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [breedNames, page, loading]);

    const loadMoreBreeds = (currentPage: number, allBreeds: string[]) => {
        setLoading(true);
        const breedsPerPage = 10; // Adjust as needed
        const startIndex = (currentPage - 1) * breedsPerPage;
        const newBreeds = allBreeds.slice(startIndex, startIndex + breedsPerPage);
        setVisibleBreeds((prevBreeds) => [...prevBreeds, ...newBreeds]);
        setPage(currentPage + 1);
        setLoading(false);
    };

    return (
        <>
            <div className='navbar'>
                <div className='title-container'>
                    <h1 className="home-title">DOG NAMES</h1>
                </div>

                <div className='btn-container'>
                    <button className='btn' onClick={() => navigate('/')}>HOME</button>
                    <button className='btn' onClick={() => navigate('/images')}>DOG IMAGES</button>
                </div>
            </div>

            <div className="card-list">
                {visibleBreeds.map((name, index) => (
                    <NameCard key={index} name={name} />
                ))}
            </div>
            <div ref={observerRef} className="loading">
                {loading && <p>Loading more breeds...</p>}
            </div>
        </>
    );
};

export default Names;
