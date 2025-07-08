// ProjectsnFiltering.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Helper function to slugify a string - memoized with useCallback for stability
  const slugify = useCallback((text) => {
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
  }, []); // Empty dependency array means this function is created once

  // Effect to manage active category, filtered projects, and URL synchronization
  useEffect(() => {
    // If projects data is not yet available, don't attempt to filter or set state.
    // This also covers initial loading and cases where `useProjectsData` might return an empty `projects` array initially.
    if (projects.length === 0) {
      // Ensure state is cleared or reflects loading status
      if (filteredProjects.length !== 0) setFilteredProjects([]);
      if (activeCategory !== null) setActiveCategory(null);
      return;
    }

    const categorySlugFromUrl = searchParams.get('category');
    let newActiveCategory = 'all'; // Default active category to 'all'
    let newFilteredProjects = projects; // Default filtered projects to all projects

    let shouldUpdateUrl = false; // Flag to indicate if router.replace is needed
    let targetUrlParams = new URLSearchParams(searchParams.toString()); // Start with current URL params

    // Logic to determine the target active category and filtered projects
    if (categorySlugFromUrl) {
      if (categories.length > 0) {
        const foundCategory = categories.find(
          (cat) => slugify(cat.name) === categorySlugFromUrl || cat.slug === categorySlugFromUrl
        );

        if (foundCategory) {
          newActiveCategory = foundCategory.id;
          newFilteredProjects = projects.filter((project) => project.categories.includes(foundCategory.id));
        } else if (categorySlugFromUrl === 'all-projects' || categorySlugFromUrl === 'all') {
          // If URL has 'all-projects' or 'all', and we prefer a clean URL (no param for 'all' state)
          newActiveCategory = 'all';
          newFilteredProjects = projects;
          if (targetUrlParams.has('category')) { // If there's any category param set, we want to clear it for 'all'
            shouldUpdateUrl = true;
            targetUrlParams.delete('category');
          }
        } else {
          // Invalid category slug in URL: mark for cleanup and default to 'all'
          shouldUpdateUrl = true;
          targetUrlParams.delete('category'); // Remove the invalid param
          newActiveCategory = 'all';
          newFilteredProjects = projects;
        }
      } else {
        // categorySlugFromUrl exists, but no categories data available: mark for cleanup and default to 'all'
        shouldUpdateUrl = true;
        targetUrlParams.delete('category'); // Remove the category param
        newActiveCategory = 'all';
        newFilteredProjects = projects;
      }
    } else {
      // No category param in URL: ensure that no category param is lingering for the 'all' state.
      if (targetUrlParams.has('category')) {
         shouldUpdateUrl = true;
         targetUrlParams.delete('category');
      }
    }

    // --- Perform URL update only if necessary ---
    // Compare the string representation of current searchParams with target searchParams
    if (shouldUpdateUrl && searchParams.toString() !== targetUrlParams.toString()) {
      router.replace(`${location.pathname}?${targetUrlParams.toString()}`, { scroll: false });
    }

    // --- Update component state only if there's a change ---
    // This is crucial to prevent unnecessary re-renders that could contribute to a loop.
    if (activeCategory !== newActiveCategory) {
      setActiveCategory(newActiveCategory);
    }
    // For array comparison, `JSON.stringify` is a simple way to check content equality.
    // For larger arrays or complex objects, consider a dedicated deep equality function.
    if (JSON.stringify(filteredProjects) !== JSON.stringify(newFilteredProjects)) {
      setFilteredProjects(newFilteredProjects);
    }

  }, [projects, categories, searchParams, router, activeCategory, filteredProjects, slugify]); // Include all external values used in the effect.
                                                                                               // activeCategory and filteredProjects are used for comparison, so they are dependencies.

  // Memoized function for updating URL and state when a category is clicked
  const handleCategoryFilter = useCallback((categoryId) => {
    setActiveCategory(categoryId); // Update activeCategory state immediately

    const currentPath = location.pathname;
    const newParams = new URLSearchParams(searchParams.toString());

    if (categoryId && categoryId !== 'all') {
      const categoryName = categories.find(cat => cat.id === categoryId)?.name;
      if (categoryName) {
        const categorySlug = slugify(categoryName);
        newParams.set('category', categorySlug);
      } else {
        newParams.delete('category'); // Fallback if categoryId is somehow invalid
      }
    } else {
      newParams.delete('category'); // For 'all' or null, remove the category parameter
    }

    // Update URL, preventing scroll to top and shallow navigation
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

    // Filter projects based on the new category ID
    setFilteredProjects(
      categoryId === 'all' || categories.length === 0
        ? projects // Show all projects if 'all' is selected or no categories exist
        : projects.filter((project) => project.categories.includes(categoryId))
    );
  }, [projects, categories, searchParams, router, slugify]); // Dependencies for useCallback

  // Handle back button (resets to 'all' projects view)
  const handleBackButton = useCallback(() => {
    setActiveCategory('all'); // Set activeCategory to 'all' to show the general filter view
    const currentPath = location.pathname;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('category'); // Remove the category parameter from URL

    // Update URL, preventing scroll to top and shallow navigation
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

    setFilteredProjects(projects); // Reset filtered projects to all
  }, [searchParams, router, projects]); // Dependencies for useCallback

  // --- Render based on loading/error states ---
  if (loading) return <LoadingState message="Loading projects and categories..." height="100vh" />;
  if (error) return <ErrorState message={error} height="100vh" />;

  // Find the active subcategory name based on activeCategory ID
  const activeSubCategoryName =
    activeCategory === 'all'
      ? 'All Projects'
      : categories.find((cat) => cat.id === activeCategory)?.name || 'All Projects'; // Fallback for safety

  return (
    <div className="max-w-7xl bg-[url(/service/bg-2.jpg)] bg-black bg-opacity-70 bg-cover bg-blend-overlay mx-auto px-4 py-8 flex flex-col">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center text-white">{title}</h2>
        <div
          className="text-gray-300 overflow-hidden my-10 text-center"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      {/* Conditional rendering for the filtering UI (CategoryFilter or Back button) */}
      {categories.length > 0 ? ( // Only render filter/back button if categories exist
        <AnimatePresence mode="wait">
          {activeCategory === null || activeCategory === 'all' ? (
            // Show CategoryFilter when no specific category is active (or 'all' is active by default)
            <motion.div
              key="category-filter"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CategoryFilter
                featured_image={featured_image}
                categories={categories}
                handleCategoryFilter={handleCategoryFilter}
                activeCategory={activeCategory} // Pass the current activeCategory ('null' or 'all')
              />
            </motion.div>
          ) : (
            // Show Back to Categories button when a specific category is selected
            <motion.div
              key="back-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
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
      ) : (
        // If no categories exist, directly show the ProjectList without filter/back button
        <ProjectList subCategoryName={activeSubCategoryName} projects={filteredProjects} />
      )}

      {/* Render ProjectList only when a specific category is selected (not 'all' or null for category filter)
          This ensures ProjectList is only shown *after* a category is picked or if there are no categories at all. */}
      {categories.length > 0 && activeCategory !== null && activeCategory !== 'all' && (
        <ProjectList subCategoryName={activeSubCategoryName} projects={filteredProjects} />
      )}
    </div>
  );
};

export default ProjectsnFiltering;