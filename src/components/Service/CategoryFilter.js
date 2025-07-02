// CategoryFilter.js
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategoryFilter = ({ featured_image, categories, handleCategoryFilter, activeCategory }) => {
  const scrollContainerRef = useRef(null);

  const getButtonClasses = (categoryId) => {
    const baseClasses = "px-4 py-4 text-sm rounded-2xl shadow-md transition duration-100 ease-in-out cursor-pointer whitespace-nowrap sm:px-2 md:px-4 min-w-[300px] max-w-[500px] flex flex-col items-center gap-5";
    const activeClasses = "bg-pink text-white hover:bg-pink";
    const inactiveClasses = "text-white hover:bg-pink";

    return `${baseClasses} ${activeCategory === categoryId ? activeClasses : inactiveClasses}`;
  };

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  // Determine if buttons should be visible
  // We need to account for the "All Projects" button as well.
  // So, if categories.length + 1 (for "All Projects") is <= 3, hide arrows.
  const shouldShowArrows = categories.length + 1 > 3; 
  // You might want to adjust '3' based on how many items fit without scrolling
  // at your 'min-w-[300px]' and 'gap-4' settings on different screen sizes.
  // A more robust solution might involve checking scrollWidth vs clientWidth.

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Left Arrow - Conditionally rendered */}
        {shouldShowArrows && (
          <button
            onClick={() => scroll(-300)}
            className="absolute left-0 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden"
            aria-label="Scroll categories left"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        <motion.div
          ref={scrollContainerRef}
          className={`flex flex-nowrap items-center ${!shouldShowArrows ? "justify-center" : "justify-start"} gap-4 p-4 mb-10 overflow-x-auto w-full
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-700
            [&::-webkit-scrollbar-thumb]:rounded-full
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {/* "All" button first */}
          <motion.button
            onClick={() => handleCategoryFilter('all')}
            className={getButtonClasses('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          >
            {featured_image &&
              <Image
                src={featured_image}
                width={300}
                height={500}
                className='aspect-video rounded-xl object-cover'
                alt="All Projects"
              />
            }
            All Projects
          </motion.button>

          {/* Render the rest of the category buttons */}
          {categories.map(category => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={getButtonClasses(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
              {category?.acf?.featured_image &&
                <Image
                  src={category.acf.featured_image}
                  width={300}
                  height={500}
                  className='aspect-video rounded-xl object-cover'
                  alt={category.name}
                />
              }
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Right Arrow - Conditionally rendered */}
        {shouldShowArrows && (
          <button
            onClick={() => scroll(300)}
            className="absolute right-0 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden"
            aria-label="Scroll categories right"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;