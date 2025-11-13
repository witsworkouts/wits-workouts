import React, { useState, useRef, useEffect } from 'react';
import SubcategoryTabs from './SubcategoryTabs';

const CategoryTabs = ({ categories, currentCategory, onCategoryChange, activeSubcategory, onSubcategoryChange }) => {
  const [showSubcategories, setShowSubcategories] = useState(null);
  const hoverTimeoutRef = useRef(null);
  
  // Detect if device is touch-enabled
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };
  
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#FF6B35';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const handleCategoryClick = (categoryId, e) => {
    // For touch devices, toggle dropdown on click (only for categories with subcategories)
    if (isTouchDevice() && e) {
      e.stopPropagation();
      // Only toggle dropdown for categories that have subcategories (not 'featured' or 'saved')
      if (categoryId !== 'featured' && categoryId !== 'saved') {
        // If clicking the same category and dropdown is open, close it
        if (showSubcategories === categoryId) {
          setShowSubcategories(null);
        } else {
          // Open dropdown for this category
          setShowSubcategories(categoryId);
        }
      }
    }
    // Always change the category
    onCategoryChange(categoryId);
  };

  const handleCategoryHover = (categoryId) => {
    // Only handle hover for non-touch devices - double check to prevent any hover on mobile
    if (!isTouchDevice()) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowSubcategories(categoryId);
    } else {
      // On touch devices, ensure dropdown doesn't open via hover
      // Only allow opening via click
      return;
    }
  };

  const handleCategoryLeave = () => {
    // Only handle leave for non-touch devices
    if (!isTouchDevice()) {
      // Add a small delay before hiding to allow moving to subcategory dropdown
      hoverTimeoutRef.current = setTimeout(() => {
        setShowSubcategories(null);
      }, 150);
    } else {
      // On touch devices, don't close on mouse leave
      // Only close via click or click outside
      return;
    }
  };

  // Close dropdown when clicking outside on touch devices
  useEffect(() => {
    if (!isTouchDevice() || !showSubcategories) return;

    const handleClickOutside = (event) => {
      // Check if click is outside the category tabs container and not on a category button
      const categoryTabsElement = event.target.closest('.category-tabs');
      const categoryButton = event.target.closest('.category-tab');
      
      // Only close if clicking outside the category tabs area
      if (!categoryTabsElement) {
        setShowSubcategories(null);
      }
    };

    // Use a small delay to avoid conflicts with the click handler
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSubcategories]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="category-tabs">
      {/* Featured tab */}
      <button
        className={`category-tab ${currentCategory === 'featured' ? 'active' : ''}`}
        style={{
          background: currentCategory === 'featured' 
            ? 'linear-gradient(45deg, #FF6B35, #f7981e)' 
            : 'linear-gradient(45deg, #FF6B35, #f7981e)',
          border: currentCategory === 'featured' ? 'none' : '1px solid #FF6B35',
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={!isTouchDevice() ? (e) => {
          if (currentCategory !== 'featured') {
            e.target.style.background = 'linear-gradient(45deg, #FF6B35, #f7981e)';
            e.target.style.borderColor = '#FF6B35';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px #FF6B3540';
          }
        } : undefined}
        onMouseLeave={!isTouchDevice() ? (e) => {
          if (currentCategory !== 'featured') {
            e.target.style.background = 'linear-gradient(45deg, #FF6B35, #f7981e)';
            e.target.style.borderColor = '#FF6B35';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        } : undefined}
        onClick={(e) => handleCategoryClick('featured', e)}
      >
        Featured Videos
      </button>

      {/* Category tabs */}
      {categories.map((category) => (
        <div 
          key={category.id} 
          style={{ position: 'relative' }}
          onMouseEnter={!isTouchDevice() ? () => handleCategoryHover(category.id) : undefined}
          onMouseLeave={!isTouchDevice() ? handleCategoryLeave : undefined}
        >
          <button
            className={`category-tab ${currentCategory === category.id ? 'active' : ''}`}
            data-category-id={category.id}
            style={{
              background: currentCategory === category.id 
                ? `linear-gradient(45deg, ${category.color}, ${category.color})` 
                : `linear-gradient(45deg, ${category.color}, ${category.color})`,
              border: currentCategory === category.id ? 'none' : `1px solid ${category.color}`,
              position: 'relative',
              color: currentCategory === category.id ? 'white' : 'white',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={!isTouchDevice() ? (e) => {
              if (currentCategory !== category.id) {
                e.target.style.background = `linear-gradient(45deg, ${category.color}, ${category.color})`;
                e.target.style.borderColor = category.color;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 4px 15px ${category.color}40`;
              }
            } : undefined}
            onMouseLeave={!isTouchDevice() ? (e) => {
              if (currentCategory !== category.id) {
                e.target.style.background = `linear-gradient(45deg, ${category.color}, ${category.color})`;
                e.target.style.borderColor = category.color;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            } : undefined}
            onClick={(e) => handleCategoryClick(category.id, e)}
          >
            {category.name}
            {/* Dropdown indicator */}
            <span style={{ 
              marginLeft: '0.5rem', 
              fontSize: '0.8rem',
              transform: showSubcategories === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              display: 'inline-block',
              color: 'white'
            }}>
              ▼
            </span>
          </button>
          
          {/* Subcategory dropdown */}
          {showSubcategories === category.id && (
            <SubcategoryTabs
              activeCategory={category.id}
              activeSubcategory={activeSubcategory}
              onSubcategoryChange={onSubcategoryChange}
              currentCategory={currentCategory}
              onMouseEnter={!isTouchDevice() ? () => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current);
                }
              } : undefined}
              onMouseLeave={!isTouchDevice() ? handleCategoryLeave : undefined}
            />
          )}
        </div>
      ))}

      {/* Saved Videos tab */}
      <button
        className={`category-tab ${currentCategory === 'saved' ? 'active' : ''}`}
        style={{
          background: currentCategory === 'saved' 
            ? 'linear-gradient(45deg, #28b6ea, #28b6ea)' 
            : 'linear-gradient(45deg, #28b6ea, #28b6ea)',
          border: currentCategory === 'saved' ? 'none' : '1px solid #28b6ea',
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={!isTouchDevice() ? (e) => {
          if (currentCategory !== 'saved') {
            e.target.style.background = 'linear-gradient(45deg, #28b6ea, #28b6ea)';
            e.target.style.borderColor = '#28b6ea';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px #28b6ea40';
          }
        } : undefined}
        onMouseLeave={!isTouchDevice() ? (e) => {
          if (currentCategory !== 'saved') {
            e.target.style.background = 'linear-gradient(45deg, #28b6ea, #28b6ea)';
            e.target.style.borderColor = '#28b6ea';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        } : undefined}
        onClick={(e) => handleCategoryClick('saved', e)}
      >
        Saved Videos
      </button>
    </div>
  );
};

export default CategoryTabs; 