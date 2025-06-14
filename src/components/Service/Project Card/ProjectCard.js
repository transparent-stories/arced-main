// ProjectCard.js
'use client'; // Important for client-side interactivity
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // AnimatePresence is no longer needed here
import ImageCarousel from './ImageCarousel'; // Make sure the path is correct

// New internal component for each Project Card
const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if image_carousel data exists and has items
  const hasImages = project.acf?.image_carousel && project.acf.image_carousel.length > 0;

  return (
    <motion.div
      className="hover:bg-sky hover:bg-opacity-10 p-6 border border-sky border-opacity-10 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden" // Added shadow-md and hover:shadow-lg
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }} // Subtle scale on hover
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}

      data-aos="fade-up" data-aos-duration="600"
    >
      {/* Image Carousel - always visible if images exist */}
      {hasImages && (
        <div className="mb-4"> {/* Add margin-bottom to separate from text content */}
          <ImageCarousel title={project.title.rendered} images={project.acf.image_carousel} autoPlayOnHover={isHovered} />
        </div>
      )}

      {/* Project details - always visible */}
      {/* Removed the conditional rendering that was switching between carousel and content */}
      <div className="py-5 flex flex-col items-center h-full"> {/* Ensure content takes full height */}
        {/* Removed project.acf?.main_image?.url as per your previous instruction */}
        <h3 className="text-xl opacity-85 font-semibold mb-2 text-center">{project.title.rendered}</h3>
        <div
          className="text-gray-600 overflow-hidden text-center text-sm" // Add overflow hidden to prevent content bleed
          dangerouslySetInnerHTML={{ __html: project.acf.description }}
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;