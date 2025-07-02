// ProjectList.js
import React, { useRef } from 'react'; // Import useRef
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './Project Card/ProjectCard';
import { EmptyState } from '../Global/States';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProjectList = ({ subCategoryName, projects }) => {
  const scrollContainerRef = useRef(null); // Create a ref for the scrollable container

  if (projects.length === 0)
    return <EmptyState message="No projects available" height="100vh" />;

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  // Determine if buttons should be visible
  // Hide arrows if the number of projects is 3 or less
  const shouldShowArrows = projects.length > 3; 
  // Similar to the CategoryFilter, you might need to adjust '3'
  // based on how many ProjectCards typically fit in the viewport
  // given their fixed widths and gap.

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={subCategoryName || 'project-list-default'}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full relative" // Add relative positioning for arrow absolute positioning
      >
        <h2 className="text-4xl font-semibold text-center text-white mb-6">
          {capitalizeFirstLetter(subCategoryName)}
        </h2>
        <div className="relative flex items-center"> {/* Wrapper for scroll arrows and content */}
          {/* Left Arrow - Conditionally rendered */}
          {shouldShowArrows && (
            <button
              onClick={() => scroll(-300)} // Scroll left by 300px
              className="absolute left-2 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden" // Hide on small screens if desired
              aria-label="Scroll left"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          <motion.div
            ref={scrollContainerRef}
            className={`flex flex-nowrap items-center gap-4 p-4 mb-10 overflow-x-auto w-full h-auto
              ${!shouldShowArrows ? 'justify-center' : ''}
              [&::-webkit-scrollbar]:h-2 // Changed to h-2 for horizontal scrollbar height
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-gray-700
              [&::-webkit-scrollbar-thumb]:rounded-full
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>

          {/* Right Arrow - Conditionally rendered */}
          {shouldShowArrows && (
            <button
              onClick={() => scroll(300)} // Scroll right by 300px
              className="absolute right-2 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden" // Hide on small screens if desired
              aria-label="Scroll right"
            >
              <FaChevronRight size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ProjectList;