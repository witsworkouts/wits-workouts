import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

const ScrollingBanner = () => {
  const [banner, setBanner] = useState({
    text: 'Coach Connect 2025-2026, Coach Camps, Coach Summit (Spring)',
    color: '#28b6ea',
    hyperlink: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axiosInstance.get('/api/banner');
        setBanner(res.data);
      } catch (error) {
        console.error('Error fetching banner:', error);
        // Use default banner on error
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading || !banner.isActive) {
    return null;
  }

  return (
    <div
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        background: banner.color,
        color: 'white',
        padding: '12px 0',
        marginBottom: '2rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'scroll 10s linear infinite',
          willChange: 'transform',
          width: 'fit-content'
        }}
      >
        {[...Array(6)].map((_, index) => (
          <span 
            key={index}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '0 50px',
              display: 'inline-block',
              flexShrink: 0
            }}
          >
            {banner.hyperlink ? (
              <a
                href={banner.hyperlink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                {banner.text}
              </a>
            ) : (
              banner.text
            )}
          </span>
        ))}
      </div>
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-16.666%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ScrollingBanner;

