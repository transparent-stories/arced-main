// ProjectList.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure AnimatePresence is imported
import ProjectCard from './Project Card/ProjectCard'; // Assuming correct path to ProjectCard

const ProjectList = ({ subCategoryName, projects }) => {
  return (
    // AnimatePresence will wrap the content that needs to animate in/out.
    // In this case, it wraps the entire content of ProjectList,
    // so when ProjectList mounts/unmounts, its content animates.
    <AnimatePresence mode="wait">
      <motion.div
        key={subCategoryName || "project-list-default"} // Crucial: A unique key for AnimatePresence to track this component
                                                      // Using subCategoryName as a key makes sense if you re-render
                                                      // the ProjectList with a new subCategory and want it to animate.
                                                      // Fallback to "project-list-default" if subCategoryName is empty.
        initial={{ opacity: 0, y: 50 }}              // Initial state: invisible, moved down
        animate={{ opacity: 1, y: 0 }}               // Animate to: fully visible, original position
        exit={{ opacity: 0, y: -50 }}               // Exit state: fade out, move up (adjust as desired for "disappearing" effect)
        transition={{ duration: 0.5 }}                // Duration of the animation
        className="w-full" // Ensure the main container takes full width if needed
      >
        <h2 className="text-4xl font-semibold text-center text-white mb-6">
          {capitalizeFirstLetter(subCategoryName)}
        </h2>
        <motion.div
          // This inner motion.div handles the horizontal scrolling container.
          // Its own initial/animate are still valid for its content's appearance if desired.
          // You could even stagger the ProjectCards here if you want.
          className="flex flex-nowrap items-center justify-start gap-4 p-4 mb-10 overflow-x-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-700
          "
          initial={{ opacity: 0 }} // Initial state for the cards container
          animate={{ opacity: 1 }} // Animate to full opacity
          transition={{ delay: 0.2, duration: 0.5 }} // Slight delay after the main component appears
        >
          {projects.map((project, index) => (
            // If you want each card to animate in individually, you'd wrap ProjectCard in motion.div
            // and apply staggered animations. For now, it animates as part of the container.
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function capitalizeFirstLetter(string) {
  if (!string) return ''; // Handle null/undefined string safely
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ProjectList;