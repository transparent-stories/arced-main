// ProjectList.js
import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './Project Card/ProjectCard'

const ProjectList = ({ projects }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} /> // Use a wrapper ProjectCard component
      ))}
    </motion.div>
  );
};

export default ProjectList;