import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import locations from '../data/locations';
import '../App.css';
import SaeromiVideo from '../assets/videos/새로미_캐릭터_영상_생성.mp4';

function CompletionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = locations.find(loc => loc.id === parseInt(id));

  if (!location) {
    return <div className="error-message">Location not found!</div>;
  }

  const handleNextLocation = () => {
    const currentIndex = locations.findIndex(loc => loc.id === parseInt(id));
    const nextIndex = (currentIndex + 1) % locations.length;
    navigate(`/game/${locations[nextIndex].id}`);
  };

  return (
    <div className="game-screen-container completion-background">
      <header className="game-header">
        <Link to="/" className="back-button">◀ 메인으로</Link>
      </header>

      <main className="game-content">
        <h1 className="game-title">✨ 이렇게 변했어요! ✨</h1>
        <p className="game-description">{location.name}의 현재 모습을 확인했습니다.</p>

        <div className="canvas-frame completion-frame">
          <div className="completion-content-wrapper">
            <img src={location.presentImage} alt={`${location.name} 현재 모습`} className="completion-present-image" />
            <div className="completion-video-wrapper">
              <video src={SaeromiVideo} autoPlay loop muted width="200" />
              <p>나와 함께 시간여행을 해줘서 고마워!</p>
            </div>
          </div>
        </div>
      </main>

      <div className="completion-buttons-container">
        <button onClick={handleNextLocation} className="back-button">다음 장소로</button>
        <Link to="/" className="back-button">홈으로 가기</Link>
      </div>
    </div>
  );
}

export default CompletionScreen;