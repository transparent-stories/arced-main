'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// TeamMembers Component: Displays a horizontally scrollable list of team members.
// Each team member card shows an image, name, and post.
// Props:
//   - teamMembers: An array of objects, where each object represents a team member
//                  and should have 'id', 'image' (URL), 'name', and 'post' properties.
const TeamMembers = ({ teamMembers }) => {
  const scrollContainerRef = useRef(null);

  // Function to handle horizontal scrolling of the team member cards.
  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  // Basic validation for teamMembers prop
  // If teamMembers is not an array or is empty, display a message.
  if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
    return (
      <div className="text-white text-center p-8 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-xl font-semibold mb-2">No team members to display.</p>
        <p className="text-gray-400">Please provide a valid array of team members.</p>
      </div>
    );
  }

  // Determines whether the scroll arrows should be visible.
  // Arrows are shown if there are more than 3 team members, implying content
  // might overflow and require scrolling. Adjust '3' based on desired visible items.
  const shouldShowArrows = teamMembers.length > 3;

  return (
    <div className="relative w-full overflow-hidden">
        <h3 className='text-3xl text-center mb-10'>Team Members</h3>
      <div className="relative flex items-center justify-center">
        {/* Left Scroll Arrow */}
        {shouldShowArrows && (
          <button
            onClick={() => scroll(-300)}
            className=" left-0 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden"
            aria-label="Scroll team members left"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Scrollable Container for Team Member Cards */}
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
          {/* Render each team member as a card */}
          {teamMembers.map(member => (
            <motion.div
              key={member.title}
              className="px-4 py-4 text-sm rounded-2xl shadow-md transition duration-100 ease-in-out flex flex-col items-center gap-3 hover:bg-pink text-white min-w-[200px] max-w-[300px] flex-shrink-0 overflow-wrap"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
              {/* Image with enhanced error handling */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.title}
                  className='h-auto w-52 aspect-square rounded-full object-cover mb-2 border-2 border-pink-500'
                  onError={(e) => {
                    // Log the error to console for debugging
                    console.error(`Failed to load image for ${member.name}: ${e.target.src}`);
                    // Set fallback image
                    e.target.onerror = null; // Prevent infinite loop if fallback also fails
                    e.target.src = "https://placehold.co/96x96/000000/FFFFFF?text=No+Image";
                  }}
                />
              ) : (
                // Placeholder if no image URL is provided in the data
                <img
                  src="https://placehold.co/96x96/000000/FFFFFF?text=No+Image"
                  alt="No Image Provided"
                  className='w-24 h-24 rounded-full object-cover mb-2 border-2 border-pink-500'
                />
              )}
              <h3 className="text-sm font-semibold text-center w-[80%]">{member.title || 'Unknown Member'}</h3>
              <p className="text-gray-300 text-center">{member.description || ''}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Scroll Arrow */}
        {shouldShowArrows && (
          <button
            onClick={() => scroll(300)}
            className=" right-0 z-10 p-2 bg-gray-800 bg-opacity-75 rounded-full text-white cursor-pointer hover:bg-opacity-100 transition-opacity duration-300 transform -translate-y-1/2 top-1/2 md:flex hidden"
            aria-label="Scroll team members right"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
