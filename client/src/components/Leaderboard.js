import React from 'react';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

const Leaderboard = ({ leaderboard }) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy style={{ color: '#FFD700', fontSize: '1.2rem' }} />;
      case 1:
        return <FaMedal style={{ color: '#C0C0C0', fontSize: '1.2rem' }} />;
      case 2:
        return <FaAward style={{ color: '#CD7F32', fontSize: '1.2rem' }} />;
      default:
        return <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{index + 1}</span>;
    }
  };

  return (
    <div className="leaderboard">
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        🏆 Leaderboard
      </h3>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
        Top {leaderboard.length > 0 ? Math.min(leaderboard.length, 10) : 10} Users
      </p>
      
      {leaderboard.length > 0 ? (
        leaderboard.map((user, index) => (
          <div key={user._id} className="leaderboard-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {getRankIcon(index)}
              <div>
                <div style={{ fontWeight: '600' }}>{user.username}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user.schoolName}
                </div>
              </div>
            </div>
            <div style={{ fontWeight: 'bold', color: '#FF6B35' }}>
              {user.totalViews} views
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
          No data available
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 