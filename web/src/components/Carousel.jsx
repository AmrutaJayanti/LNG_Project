import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import chatImg from '../assets/images/chat.jpg';
import funImg from '../assets/images/fun.png';
import './../styles/Carousel.css';

const carouselItems = [
  { id: 1, image: chatImg, key: 'chat', title: 'Chat with Friends' },
  { id: 2, image: funImg, key: 'games', title: 'Play Games' },
  { id: 3, image: funImg, key: 'fun', title: 'Have Fun' },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const navigateToSlide = (key) => {
    if (key === 'chat') {
      navigate('/chat');
    } else {
      navigate('/games');
    }
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-item"
        onClick={() => navigateToSlide(carouselItems[currentIndex].key)}
      >
        <img
          src={carouselItems[currentIndex].image}
          alt={carouselItems[currentIndex].title}
          className="carousel-image"
        />
        <h2 className="carousel-title">{carouselItems[currentIndex].title}</h2>
      </div>
      <div className="pagination">
        {carouselItems.map((_, index) => (
          <span
            key={index}
            className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;