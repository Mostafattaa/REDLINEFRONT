import { useState, useRef, useEffect } from 'react';

export function Carousel({ children }) {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const carouselRef = useRef(null);

  const checkScroll = () => {
    const container = carouselRef.current;
    if (!container) return;

    setShowLeftButton(container.scrollLeft > 10);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10
    );
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 -ml-4"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        onScroll={checkScroll}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 -mr-4"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
