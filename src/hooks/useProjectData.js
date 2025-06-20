// useProjectsData.js
import { useQuery } from '@tanstack/react-query'; // Import useQuery from React Query
import { fetchFromApiWp } from '@/utils/api'; // Ensure this path is correct

/**
 * Helper function to slugify a string for URL-friendly names.
 * You might already have this in ProjectsnFiltering.js, but it's good to keep it close to category logic.
 * If your category data already has a 'slug', this might not be strictly necessary for query keys,
 * but is good for consistency in URL params.
 */
const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * This function will be the main queryFn for useQuery.
 * It fetches both projects and their related categories.
 * @param {Array<number>} ids - An array of project IDs.
 * @returns {Promise<{projects: Array, categories: Array}>}
 * @throws {Error} If any fetch fails or no projects/categories are found.
 */
async function fetchAllProjectsAndCategories(ids) {
  let projectsData = [];
  let categoriesData = [];
  let total_projects = ids?.length;

  if (!ids || ids.length === 0) {
    // If no IDs provided, return empty arrays immediately
    return { projects: [], categories: [] };
  }

  const idsString = ids.toString();
  const projectQueryParams = {
    include: idsString,
    _fields: "id,title,acf,categories",
    acf_format: "standard",
    status: "publish",
    ...(total_projects && { per_page: total_projects.toString() }),
  };

  try {
    // 1. Fetch Projects Data
    const fetchedProjects = await fetchFromApiWp(`/projects`, projectQueryParams, "wp");
    projectsData = fetchedProjects?.data || [];

    if (projectsData.length === 0) {
      // If no projects found, return empty categories as well
      return { projects: [], categories: [] };
    }

    // 2. Get all unique category IDs from fetched projects
    const allUniqueCategoryIds = Array.from(
      new Set(projectsData.reduce((acc, project) => acc.concat(project.categories), []))
    );

    // 3. Fetch Categories Data if there are unique category IDs
    if (allUniqueCategoryIds.length > 0) {
      const categoriesString = allUniqueCategoryIds.join(',');
      const categoriesQueryParams = { include: categoriesString, _fields: "id,name,count,acf" };
      const fetchedCategories = await fetchFromApiWp(`/categories?acf_format=standard`, categoriesQueryParams, "wp");
      categoriesData = fetchedCategories?.data || [];
    }

    // Ensure "All" category is always present and add slugs if they don't exist
    let finalCategories = [];
    if (!categoriesData || categoriesData.length === 0) {
      // finalCategories = [{ id: 'all', name: 'All Projects', slug: 'all-projects' }];
    } else {
      // Add 'slug' property to categories if it's missing (important for URL params)
      finalCategories = categoriesData.map(cat => ({
        ...cat,
        slug: cat.slug || slugify(cat.name), // Use existing slug or generate from name
      }));
      // Optionally, add 'All Projects' as the first option if desired
      // finalCategories.unshift({ id: 'all', name: 'All Projects', slug: 'all-projects' });
    }


    return { projects: projectsData, categories: finalCategories };

  } catch (error) {
    console.error(`Error in useProjectsData fetch:`, error);
    // Re-throw the error for React Query to handle
    throw new Error(error.message || 'Failed to fetch projects and categories.');
  }
}

/**
 * A custom React hook for fetching projects and their associated categories from a WordPress API using React Query.
 *
 * @param {Array<number>} ids - An array of project IDs to fetch.
 * @returns {{loading: boolean, error: string | null, projects: Array, categories: Array}}
 */
const useProjectsData = (ids) => {
  // The query key ['projectsAndCategories', ids] ensures React Query caches data based on `ids`
  // and intelligently refetches only when `ids` changes or the cache is stale.
  const {
    data,
    isLoading, // True when the query is actively fetching data
    isError,   // True if the query encountered an error
    error,     // The error object
    isFetching // True if the query is fetching data in the background (e.g., stale-while-revalidate)
  } = useQuery({
    queryKey: ['projectsAndCategories', ids], // Unique key for this query, includes ids
    queryFn: () => fetchAllProjectsAndCategories(ids), // The function that performs the actual data fetching
    staleTime: 1000 * 60 * 5, // Data is considered "stale" after 5 minutes. After this, it will refetch in background.
    cacheTime: 1000 * 60 * 10, // Data is kept in cache for 10 minutes even if unused.
    enabled: !!ids && ids.length > 0, // Only run the query if ids are provided and not empty
  });

  return {
    loading: isLoading, // Initial loading state
    error: isError ? error.message : null, // Error message
    projects: data?.projects || [], // Projects data, defaults to empty array
    categories: data?.categories || [], // Categories data, defaults to empty array
    // You might want to expose isFetching if you want a more subtle loading indicator for background refetches
    // isFetching,
  };
};

export default useProjectsData;