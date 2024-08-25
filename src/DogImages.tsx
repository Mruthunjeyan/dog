// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from './Card';
// import './App.css';
// import { useNavigate } from 'react-router-dom'; 

// interface BreedList {
//     [key: string]: string[];
// }
// interface BreedData {
//     name: string;
//     imageUrl: string;
// }

// const DogImages: React.FC = () => {
//     const [breeds, setBreeds] = useState<BreedData[]>([]);
//     const navigate = useNavigate();
//     useEffect(() => {
//         const fetchBreeds = async () => {
//             try {
//                 const response = await axios.get('https://dog.ceo/api/breeds/list/all');
//                 const breedList: BreedList = response.data.message;
//                 const breedDataPromises: Promise<BreedData>[] = [];

//                 for (const breed in breedList) {
//                     if (breedList[breed].length > 0) {
//                         breedList[breed].forEach(subBreed => {
//                             const name = `${subBreed} ${breed}`;
//                             const imageUrlPromise = axios.get(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`)
//                                 .then(res => ({
//                                     name,
//                                     imageUrl: res.data.message
//                                 }));
//                             breedDataPromises.push(imageUrlPromise);
//                         });
//                     } else {
//                         const name = breed;
//                         const imageUrlPromise = axios.get(`https://dog.ceo/api/breed/${breed}/images/random`)
//                             .then(res => ({
//                                 name,
//                                 imageUrl: res.data.message
//                             }));
//                         breedDataPromises.push(imageUrlPromise);
//                     }
//                 }

//                 const breedData = await Promise.all(breedDataPromises);
//                 setBreeds(breedData);
//             } catch (error) {
//                 console.error('Error fetching breeds:', error);
//             }
//         };

//         fetchBreeds();
//     }, []);

//     return (
//         <>
//       <div className='navbar'>
//         <div className='title-container'>
//             <h1 className="home-title">DOG IMAGES</h1>
//         </div>
//         <div className='btn-container'>
//             <button className='btn' onClick={() => navigate('/')}>HOME</button>
//             <button className='btn' onClick={() => navigate('/name')}>DOG NAMES</button>
//         </div>
//       </div>
//       <div className="card-list">
//                 {breeds.map((breed, index) => (
//                     <Card key={index} title={breed.name} imageUrl={breed.imageUrl} />
//                 ))}
//             </div>
//         </>
//     );
// };

// export default DogImages;


















import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import './App.css';
import { useNavigate } from 'react-router-dom'; 

interface BreedList {
    [key: string]: string[];
}

interface BreedData {
    name: string;
    imageUrl: string;
}

const DogImages: React.FC = () => {
    const [breeds, setBreeds] = useState<BreedData[]>([]);
    const [visibleBreeds, setVisibleBreeds] = useState<BreedData[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await axios.get('https://dog.ceo/api/breeds/list/all');
                const breedList: BreedList = response.data.message;
                const breedDataPromises: Promise<BreedData>[] = [];

                for (const breed in breedList) {
                    if (breedList[breed].length > 0) {
                        breedList[breed].forEach(subBreed => {
                            const name = `${subBreed} ${breed}`;
                            const imageUrlPromise = axios.get(`https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`)
                                .then(res => ({
                                    name,
                                    imageUrl: res.data.message
                                }));
                            breedDataPromises.push(imageUrlPromise);
                        });
                    } else {
                        const name = breed;
                        const imageUrlPromise = axios.get(`https://dog.ceo/api/breed/${breed}/images/random`)
                            .then(res => ({
                                name,
                                imageUrl: res.data.message
                            }));
                        breedDataPromises.push(imageUrlPromise);
                    }
                }

                const breedData = await Promise.all(breedDataPromises);
                setBreeds(breedData);
                loadMoreBreeds(1, breedData);
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        fetchBreeds();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    loadMoreBreeds(page, breeds);
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
    }, [breeds, page, loading]);

    const loadMoreBreeds = (currentPage: number, allBreeds: BreedData[]) => {
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
                    <h1 className="home-title">DOG IMAGES</h1>
                </div>
                <div className='btn-container'>
                    <button className='btn' onClick={() => navigate('/')}>HOME</button>
                    <button className='btn' onClick={() => navigate('/name')}>DOG NAMES</button>
                </div>
            </div>
            <div className="card-list">
                {visibleBreeds.map((breed, index) => (
                    <Card key={index} title={breed.name} imageUrl={breed.imageUrl} />
                ))}
            </div>
            <div ref={observerRef} className="loading">
                {loading && <p>Loading more breeds...</p>}
            </div>
        </>
    );
};

export default DogImages;
