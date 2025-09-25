import React from 'react';
import '../App.css'; // Import App.css for styling

function LocationThumbnail({ location }) {
  return (
    <div className="location-thumbnail">
      <img src={location.thumbnail} alt={location.name} className="thumbnail-image" />
      <div className="thumbnail-overlay">
        <span className="thumbnail-name">{location.name}</span>
      </div>
    </div>
  );
}

export default LocationThumbnail;
