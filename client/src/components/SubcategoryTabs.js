import React from 'react';

const SubcategoryTabs = ({ activeCategory, activeSubcategory, onSubcategoryChange, onMouseEnter, onMouseLeave, currentCategory }) => {
  const subcategories = [
    { id: 'pre-k-2', name: 'Pre - K - 2' },
    { id: 'grades-3-4', name: 'Grades 3 - 4' },
    { id: 'grades-5-8', name: 'Grades 5 - 8' },
    { id: 'high-school', name: 'High School' }
  ];

  const durationCategories = [
    { duration: 5, label: '5 Minute Videos' },
    { duration: 10, label: '10 Minute Videos' }
  ];

  // Get the color based on active category
  const getCategoryColor = () => {
    switch (activeCategory) {
      case 'workout-sports':
        return '#28b6ea';
      case 'dance-move':
        return '#8cc63e';
      case 'yoga':
        return '#f7981e';
      case 'mindfulness':
        return '#8cc63e';
      case 'pre-school':
        return '#FFEAA7';
      case 'k-12':
        return '#DDA0DD';
      default:
        return '#FF6B35';
    }
  };

  const categoryColor = getCategoryColor();
  
  // For Mindfulness category, show only grade-level subcategories (no duration)
  const isMindfulness = activeCategory === 'mindfulness';

  return (
    <div 
      style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        zIndex: 10,
        background: categoryColor,
        borderRadius: '15px',
        padding: '1rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        minWidth: '250px',
        marginTop: '10px'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isMindfulness ? (
        // For Mindfulness: show only grade-level subcategories (no duration grouping)
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {subcategories.map((subcategory) => {
            // For Mindfulness, subcategoryId is just the grade level (no duration)
            const subcategoryId = subcategory.id;
            const isActive = activeSubcategory === subcategoryId && currentCategory === activeCategory;
            return (
              <button
                key={subcategoryId}
                onClick={() => onSubcategoryChange(subcategoryId, activeCategory)}
                style={{
                  background: isActive 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.7)',
                  color: isActive 
                    ? '#333' 
                    : '#555',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.color = '#333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.target.style.color = '#555';
                  }
                }}
              >
                {subcategory.name}
              </button>
            );
          })}
        </div>
      ) : (
        // For other categories: show duration-based subcategories
        durationCategories.map((durationCategory, durationIndex) => (
          <div key={durationCategory.duration}>
            <div style={{ 
              color: 'white', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }}>
              {durationCategory.label}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: durationIndex < durationCategories.length - 1 ? '1rem' : '0' }}>
              {subcategories.map((subcategory) => {
                const subcategoryId = `${subcategory.id}-${durationCategory.duration}min`;
                // Only highlight if this subcategory is active AND it's for the current category
                const isActive = activeSubcategory === subcategoryId && currentCategory === activeCategory;
                return (
                  <button
                    key={subcategoryId}
                    onClick={() => onSubcategoryChange(subcategoryId, activeCategory)}
                    style={{
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(255, 255, 255, 0.7)',
                      color: isActive 
                        ? '#333' 
                        : '#555',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                        e.target.style.color = '#333';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.color = '#555';
                      }
                    }}
                  >
                    {subcategory.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SubcategoryTabs;





