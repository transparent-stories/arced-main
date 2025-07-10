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
  // Initialize filteredProjects as empty, they will only show once a category is selected (or 'all')
  const [filteredProjects, setFilteredProjects] = useState([]);
  // activeCategory starts as null. This signifies that no specific filter is applied initially,
  // and thus no projects are displayed.
  const [activeCategory, setActiveCategory] = useState(null);

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
  }, []);

  // Effect to manage active category and filtered projects based on URL or initial state
  useEffect(() => {
    // Don't process until data is loaded
    if (loading) {
      return;
    }

    const categorySlugFromUrl = searchParams.get('category');
    let newActiveCategory = null; // Default to no active button
    let newFilteredProjects = []; // Default to no projects shown

    // Flag to track if URL needs cleanup/update
    let shouldUpdateUrl = false;
    const currentUrlParams = new URLSearchParams(searchParams.toString());


    if (categorySlugFromUrl) {
      if (categories.length > 0) {
        const foundCategory = categories.find(
          (cat) => slugify(cat.name) === categorySlugFromUrl || cat.slug === categorySlugFromUrl
        );

        if (foundCategory) {
          newActiveCategory = foundCategory.id;
          newFilteredProjects = projects.filter((project) => project.categories.includes(foundCategory.id));
        } else if (categorySlugFromUrl === 'all-projects' || categorySlugFromUrl === 'all') {
          newActiveCategory = 'all';
          newFilteredProjects = projects;
          // If URL has 'all-projects' or 'all', remove the param for a cleaner URL
          if (currentUrlParams.has('category')) {
            shouldUpdateUrl = true;
            currentUrlParams.delete('category');
          }
        } else {
          // Invalid category slug in URL: clean up URL, no active category, no projects displayed
          shouldUpdateUrl = true;
          currentUrlParams.delete('category');
          // newActiveCategory remains null, newFilteredProjects remains empty []
        }
      } else {
        // categorySlugFromUrl exists, but no categories data.
        // If there are projects, display all of them regardless of the invalid param.
        shouldUpdateUrl = true;
        currentUrlParams.delete('category'); // Clean up the invalid param
        newActiveCategory = 'all'; // Treat as if 'all' is implicitly selected
        newFilteredProjects = projects;
      }
    } else {
      // No category param in URL.
      // If there are no categories at all, display all projects by default.
      if (categories.length === 0 && projects.length > 0) {
        newActiveCategory = 'all';
        newFilteredProjects = projects;
      }
      // Otherwise (categories exist, no URL param), newActiveCategory remains null, newFilteredProjects remains [].
      // This is the initial state where no projects are shown.
    }

    // --- Perform URL cleanup/update only if necessary ---
    // Only call router.replace if the searchParams string actually differs
    if (shouldUpdateUrl && searchParams.toString() !== currentUrlParams.toString()) {
      router.replace(`${location.pathname}?${currentUrlParams.toString()}`, { scroll: false });
    }

    // --- Update component state only if there's a change ---
    // This is crucial to prevent unnecessary re-renders and potential loops.
    if (activeCategory !== newActiveCategory) {
      setActiveCategory(newActiveCategory);
    }
    // For array comparison, JSON.stringify is a simple way to check content equality.
    if (JSON.stringify(filteredProjects) !== JSON.stringify(newFilteredProjects)) {
      setFilteredProjects(newFilteredProjects);
    }

  }, [projects, categories, searchParams, router, slugify, loading]);

  // Memoized function for updating URL and state when a category is clicked
  const handleCategoryFilter = useCallback((categoryId) => {
    // Immediately update activeCategory and filteredProjects based on click
    setActiveCategory(categoryId);

    const filtered =
      categoryId === 'all' || categories.length === 0
        ? projects // Show all projects if 'all' is selected or no categories exist
        : projects.filter((project) => project.categories.includes(categoryId));
    setFilteredProjects(filtered);

    // Prepare URL for update
    const currentPath = location.pathname;
    const newParams = new URLSearchParams(); // Start with empty to build fresh params

    if (categoryId && categoryId !== 'all') {
      const categoryName = categories.find(cat => cat.id === categoryId)?.name;
      if (categoryName) {
        newParams.set('category', slugify(categoryName));
      }
    }
    // If categoryId is 'all' or invalid, newParams will remain empty, effectively removing 'category' param

    // Update URL, preventing scroll to top and using shallow navigation
    // This will cause useEffect to re-run on the next render cycle with updated searchParams
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

  }, [projects, categories, router, slugify]);

  // Handle back button (resets to 'no active filter' view, which means no projects)
  const handleBackButton = useCallback(() => {
    setActiveCategory(null); // Set activeCategory to null (no button active)
    setFilteredProjects([]); // Clear projects list

    // Clear category param from URL
    const currentPath = location.pathname;
    const newParams = new URLSearchParams(); // Start empty to clear params
    router.push(`${currentPath}?${newParams.toString()}`, { shallow: true, scroll: false });

  }, [router]);

  // --- Render based on loading/error states ---
  if (loading) return <LoadingState message="Loading projects and categories..." height="100vh" />;
  if (error) return <ErrorState message={error} height="100vh" />;

  // Determine the title for the project list (e.g., "All Projects", "Category Name")
  const activeSubCategoryName =
    activeCategory === 'all'
      ? 'All Projects'
      : categories.find((cat) => cat.id === activeCategory)?.name || 'Projects'; // Default to 'Projects'

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
          {activeCategory === null ? ( // Show CategoryFilter ONLY when activeCategory is null (initial state)
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
                activeCategory={activeCategory} // Pass the current activeCategory (null)
              />
            </motion.div>
          ) : ( // Show Back to Categories button when ANY category (including 'all') is selected
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
        // **REMOVED:** Direct rendering of ProjectList when no categories exist.
        // This is now handled by the activeCategory !== null block below.
        null // Render nothing here when categories.length is 0.
      )}

      {/* Render ProjectList only when activeCategory is 'all' OR a specific category ID (i.e., not null) */}
      {/* It will NOT render when activeCategory is null (initial load or "back" clicked) */}
      {activeCategory !== null && (
        filteredProjects.length > 0 ? (
          <ProjectList subCategoryName={activeSubCategoryName} projects={filteredProjects} />
        ) : (
          // Display empty state if no projects match the current filter
          <EmptyState message={`No projects found for "${activeSubCategoryName}".`} />
        )
      )}
      {/* Show initial guiding message when no projects are displayed and there are categories to choose from */}
      {activeCategory === null && categories.length > 0 && (
        <EmptyState message="Please select a category or click 'All Projects' to view projects." />
      )}
    </div>
  );
};

export default ProjectsnFiltering;