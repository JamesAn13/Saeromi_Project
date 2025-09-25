import React from 'react';
import { Link } from 'react-router-dom';
import locations from '../data/locations';
import LocationThumbnail from './LocationThumbnail';
import SaeromiNukki from '../assets/images/새로미누끼.png'; // Import Saeromi nukki image
import '../App.css'; // Import App.css for styling

function MainScreen() {
  return (
    <div className="main-screen-container">
      <h1 className="main-title">새로미와 함께 떠나는 강서구 시간여행</h1>
      
      <div className="saeromi-animation-container">
        <p className="saeromi-dialog">나와 함께 강서구의 시간을 여행해 볼까?</p>
        <img src={SaeromiNukki} alt="새로미 캐릭터" className="saeromi-img" />
      </div>

      <div className="thumbnail-grid">
        {locations.map((location, index) => (
          <Link 
            to={`/game/${location.id}`} 
            key={location.id} 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <LocationThumbnail location={location} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MainScreen;
