import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/css/HomePage.css';

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Example: Adjust the path and method of importing images as needed.
  const images = require.context('../assets/images/home-page-slide-show', true, /\.jpg$/).keys().map((path) => require.context('../assets/images/home-page-slide-show', true)(path));

  return (
    <div className="home-page">
      <h1 className="header">MAS-VOLUNTEER-TECH-HUB</h1>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img className="half-screen-image" src={img} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomePage;