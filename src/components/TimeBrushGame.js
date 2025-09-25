import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import locations from '../data/locations';
import SaeromiCursor from '../assets/images/새로미.png';
import SaeromiNukki from '../assets/images/새로미누끼.png'; // Import Saeromi nukki image
import '../App.css';

const BRUSH_RADIUS = 35;
const COMPLETION_THRESHOLD = 0.8; // 80%

function TimeBrushGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const backgroundCanvasRef = useRef(null);
  const foregroundCanvasRef = useRef(null);
  const frameRef = useRef(null); // Ref for the canvas container

  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = locations.find(loc => loc.id === parseInt(id));

  const pastImageRef = useRef(new Image());
  const presentImageRef = useRef(new Image());

  const drawImages = useCallback(() => {
    if (!location || !frameRef.current) return;

    const frameWidth = frameRef.current.clientWidth;
    const frameHeight = frameRef.current.clientHeight;

    [backgroundCanvasRef, foregroundCanvasRef].forEach(ref => {
      if (ref.current) {
        ref.current.width = frameWidth;
        ref.current.height = frameHeight;
      }
    });

    const bgCtx = backgroundCanvasRef.current.getContext('2d');
    const fgCtx = foregroundCanvasRef.current.getContext('2d');

    bgCtx.drawImage(presentImageRef.current, 0, 0, frameWidth, frameHeight);
    fgCtx.drawImage(pastImageRef.current, 0, 0, frameWidth, frameHeight);
  }, [location]);

  useEffect(() => {
    if (!location) {
      setError('Location data not found.');
      setIsLoading(false);
      return;
    }

    let imagesLoadedCount = 0;
    const onImageLoad = () => {
      imagesLoadedCount++;
      if (imagesLoadedCount === 2) {
        setIsLoading(false);
        drawImages();
      }
    };

    const onImageError = (e) => {
      setError(`Failed to load image: ${e.target.src}`);
      setIsLoading(false);
    };

    pastImageRef.current.onload = onImageLoad;
    pastImageRef.current.onerror = onImageError;
    pastImageRef.current.src = location.pastImage;
    pastImageRef.current.crossOrigin = "anonymous";

    presentImageRef.current.onload = onImageLoad;
    presentImageRef.current.onerror = onImageError;
    presentImageRef.current.src = location.presentImage;
    presentImageRef.current.crossOrigin = "anonymous";

    window.addEventListener('resize', drawImages);
    return () => window.removeEventListener('resize', drawImages);
  }, [id, location, drawImages]);

  const erase = (e) => {
    const canvas = foregroundCanvasRef.current;
    if (!canvas || !isDrawing) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const { x, y } = { x: clientX - rect.left, y: clientY - rect.top };

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2, false);
    ctx.fill();

    // Update progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        transparentPixels++;
      }
    }
    const newProgress = transparentPixels / totalPixels;
    setProgress(newProgress);

    if (newProgress >= COMPLETION_THRESHOLD) {
      setTimeout(() => navigate(`/complete/${id}`), 500);
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!location) return <div className="error-message">Location not found!</div>;

  return (
    <div className="game-screen-container">
      <header className="game-header">
        <Link to="/" className="back-button">◀ 뒤로가기</Link>
      </header>

      <main className="game-content">
        <h1 className="game-title">{location.name}</h1>
        <p className="game-description">{location.description}</p>

        <div
          ref={frameRef}
          className="canvas-frame"
          style={{ cursor: `url(${SaeromiCursor}) ${BRUSH_RADIUS} ${BRUSH_RADIUS}, auto` }}
          onMouseDown={startDrawing}
          onMouseMove={erase}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={erase}
          onTouchEnd={stopDrawing}
        >
          {isLoading && <div className="loading-overlay">Loading...</div>}
          <canvas ref={backgroundCanvasRef} className="game-canvas" />
          <canvas ref={foregroundCanvasRef} className="game-canvas" />
        </div>
      </main>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress * 100}%` }}
        >
          {`${Math.round(progress * 100)}%`}
        </div>
      </div>

      <div className="saeromi-animation-container">
        <p className="saeromi-dialog">마우스를 문질러서 현재 모습을 찾아봐!</p>
        <img src={SaeromiNukki} alt="새로미 캐릭터" className="saeromi-img" />
      </div>
    </div>
  );
}

export default TimeBrushGame;