// ProjectsnFiltering.js
'use client';
import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import useProjectsData from '../../hooks/useProjectData'; // Adjust path if necessary
import CategoryFilter from './CategoryFilter';
import ProjectList from './ProjectList';
import { EmptyState, ErrorState, LoadingState } from '../Global/States';

const ProjectsnFiltering = ({ title, ids }) => {
  const { loading, error, projects, categories } = useProjectsData(ids);
  const [filteredProjects, setFilteredProjects] = useState([]); // Initialize as empty array
  const [activeCategory, setActiveCategory] = useState('all');

  // Add a useEffect to update filteredProjects when 'projects' changes
  useEffect(() => {
    setFilteredProjects(projects);
    setActiveCategory('all');
  }, [projects]); 

  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    setFilteredProjects(categoryId === 'all' ? projects : projects.filter(project => project.categories.includes(categoryId)));
  };

  if (loading) return <LoadingState message="Loading projects and categories..." height="100vh" />;
  if (error) return <ErrorState message={error} height="100vh" />;
  // Check if filteredProjects is empty only AFTER loading and error are handled
  // and only if there's no error (meaning data *should* have been fetched)
  if (!loading && !error && filteredProjects.length === 0) return <EmptyState message="No projects available" height="100vh" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-white">{title} PROJECTS</h2>
        {/* <p className="text-gray-600 overflow-hidden my-10 text-center text-sm">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </p> */}
      </section>
      
      {/* <CategoryFilter pillar={title} categories={categories} handleCategoryFilter={handleCategoryFilter} activeCategory={activeCategory}  /> */}
      {/* <ProjectList projects={filteredProjects} /> */}
    </div>
  );
};

export default ProjectsnFiltering;