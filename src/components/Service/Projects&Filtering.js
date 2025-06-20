// ProjectsnFiltering.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

import useProjectsData from '../../hooks/useProjectData'; // Adjust path if necessary
import CategoryFilter from './CategoryFilter';
import ProjectList from './ProjectList';
import { EmptyState, ErrorState, LoadingState } from '../Global/States';

const ProjectsnFiltering = ({ featured_image, content, title, ids }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, error, projects, categories } = useProjectsData(ids);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // Stores the category ID or 'all'

  // Effect to read category from URL on initial load or URL change
  useEffect(() => {
    // Only proceed if projects and categories data are available
    if (projects.length === 0 || categories.length === 0) return;

    const categorySlugFromUrl = searchParams.get('category'); // Get 'category' parameter from URL

    if (categorySlugFromUrl) {
      // Find the category by matching its dynamically generated slug or an existing 'slug' property
      const foundCategory = categories.find(
        (cat) => slugify(cat.name) === categorySlugFromUrl || cat.slug === categorySlugFromUrl
      );

      if (foundCategory) {
        setActiveCategory(foundCategory.id);
        setFilteredProjects(
          projects.filter((project) => project.categories.includes(foundCategory.id))
        );
      } else if (categorySlugFromUrl === 'all-projects' || categorySlugFromUrl === 'all') {
        // Handle 'all-projects' or 'all' slug for the "All Projects" view
        setActiveCategory('all');
        setFilteredProjects(projects);
      } else {
        // If an invalid category slug is in the URL, clear it
        router.replace(location.pathname, { scroll: false }); // Use replace and prevent scroll
        setActiveCategory(null);
        setFilteredProjects(projects);
      }
    } else {
      // If no category param, default to showing all projects
      setActiveCategory(null);
      setFilteredProjects(projects);
    }
  }, [projects, categories, searchParams, router]);


  // Memoized function for updating URL and state
  const handleCategoryFilter = useCallback((categoryId) => {
    setActiveCategory(categoryId); // activeCategory still holds the ID

    const currentPath = location.pathname;
    const newParams = new URLSearchParams(searchParams.toString());

    if (categoryId && categoryId !== 'all') {
      // Find the category name based on the categoryId
      const categoryName = categories.find(cat => cat.id === categoryId)?.name;

      if (categoryName) {
        // Generate the URL-friendly slug from the category name
        const categorySlug = slugify(categoryName);
        newParams.set('category', categorySlug);
      } else {
        // Fallback: if no name found, remove the parameter
        newParams.delete('category');
      }
    } else {
      // If categoryId is 'all' or null, remove the parameter
      newParams.delete('category');
      // Uncomment the line below if you want "all-projects" in the URL for the "all" state
      // newParams.set('category', 'all-projects');
    }

    // Update URL with new parameters, preventing scroll to top
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

    // Filter projects based on the new category ID
    setFilteredProjects(
      categoryId === 'all'
        ? projects
        : projects.filter((project) => project.categories.includes(categoryId))
    );
  }, [projects, categories, searchParams, router]);


  // Handle back button (clears URL parameter and resets state)
  const handleBackButton = useCallback(() => {
    setActiveCategory(null); // Set activeCategory to null to show CategoryFilter
    const currentPath = location.pathname;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('category'); // Remove the category parameter

    // Update URL, preventing scroll to top
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

    setFilteredProjects(projects); // Reset filtered projects to all
  }, [searchParams, router, projects]);


  if (loading) return <LoadingState message="Loading projects and categories..." height="100vh" />;
  if (error) return <EmptyState message={error} height="100vh" />;
  // if (!loading && !error && filteredProjects.length === 0)
  //   return <EmptyState message="No projects available" height="100vh" />;

  // Find the active subcategory name based on activeCategory ID
  const activeSubCategoryName =
    activeCategory === 'all'
      ? 'All Projects'
      : categories.find((cat) => cat.id === activeCategory)?.name || '';

  return (
    <div className="max-w-7xl bg-[url(/service/bg-2.jpg)] bg-black bg-opacity-70 bg-cover bg-blend-overlay mx-auto px-4 py-8 flex flex-col">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center text-white">{title}</h2>
        <div
          className="text-gray-300 overflow-hidden my-10 text-center"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* {
        !activeCategory ? (
          <CategoryFilter
            featured_image={featured_image}
            categories={categories}
            handleCategoryFilter={handleCategoryFilter}
            activeCategory={activeCategory}
          />
        ) : (
          <div className="w-full flex justify-center">
            <motion.button
              onClick={handleBackButton}
              className="flex items-center text-white text-lg px-6 py-3 rounded-3xl bg-pink hover:bg-pink transition-colors duration-300 shadow-lg mb-6 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Categories
            </motion.button>
          </div>
        )
      } */}

      <AnimatePresence mode="wait"> {/* Use mode="wait" to ensure one animation finishes before the next starts */}
          {!activeCategory ? (
              <motion.div
                  key="category-filter" // Unique key for AnimatePresence
                  initial={{ opacity: 0, y: -20 }} // Start slightly above and invisible
                  animate={{ opacity: 1, y: 0 }} // Animate to fully visible and in place
                  exit={{ opacity: 0, y: -20 }} // Fade out and slide up when exiting
                  transition={{ duration: 0.3 }} // Animation duration
                  className="w-full" // Ensure it takes full width if needed for layout
              >
                  <CategoryFilter
                      featured_image={featured_image}
                      categories={categories}
                      handleCategoryFilter={handleCategoryFilter}
                      activeCategory={activeCategory}
                  />
              </motion.div>
          ) : (
              <motion.div
                  key="back-button" // Unique key for AnimatePresence
                  initial={{ opacity: 0, y: 20 }} // Start slightly below and invisible
                  animate={{ opacity: 1, y: 0 }} // Animate to fully visible and in place
                  exit={{ opacity: 0, y: 20 }} // Fade out and slide down (if it were to disappear)
                  transition={{ duration: 0.3 }} // Animation duration
                  className="w-full flex justify-center"
              >
                  <motion.button
                      onClick={handleBackButton}
                      className="flex items-center text-white text-lg px-6 py-3 rounded-3xl bg-pink hover:bg-pink transition-colors duration-300 shadow-lg mb-6 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                  >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                      >
                          <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                      </svg>
                      Back to Categories
                  </motion.button>
              </motion.div>
          )}
        </AnimatePresence>
      {activeCategory && <ProjectList subCategoryName={activeSubCategoryName} projects={filteredProjects} />}
    </div>
  );
};

// Helper function to slugify a string for URL-friendly names
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (e.g., é -> e)
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace from both ends
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

export default ProjectsnFiltering;