import React, { useRef, useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HorizontalVideoGrid = ({ videos, onVideoClick }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [videos]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No videos found for this category.</p>
      </div>
    );
  }

  return (
    <div className="horizontal-video-container">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          className="scroll-arrow scroll-arrow-left"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Video Grid Container */}
      <div 
        ref={scrollContainerRef}
        className="horizontal-video-grid"
      >
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            onClick={() => onVideoClick(video._id)}
          />
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          className="scroll-arrow scroll-arrow-right"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default HorizontalVideoGrid;

