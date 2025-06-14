// useProjectsData.js
import { useState, useEffect } from 'react';
import { fetchFromApiWp } from '@/utils/api'; // Ensure this path is correct

/**
 * Fetches projects data from the WordPress API.
 * @param {object} queryParams - Query parameters for the API request.
 * @returns {Promise<Array>} - A promise that resolves to an array of project data.
 * @throws {Error} If projects are not found or an API error occurs.
 */
async function getProjectsData(queryParams) {
  try {
    const pageData = await fetchFromApiWp(`/projects`, queryParams, "wp");
    return pageData?.data;
  } catch (error) {
    console.error(`Error fetching projects`, error);
    // Re-throw with a more descriptive message for the hook to catch
    throw new Error(error.message || "Projects not found");
  }
}

/**
 * Fetches categories data from the WordPress API.
 * @param {object} queryParams - Query parameters for the API request.
 * @returns {Promise<Array>} - A promise that resolves to an array of category data.
 * @throws {Error} If categories are not found or an API error occurs.
 */
async function getCategoriesData(queryParams) {
  try {
    const pageData = await fetchFromApiWp(`/categories`, queryParams, "wp");
    return pageData?.data;
  } catch (error) {
    console.error(`Error fetching categories`, error);
    // Re-throw with a more descriptive message for the hook to catch
    throw new Error(error.message || "Categories not found");
  }
}

/**
 * A custom React hook for fetching projects and their associated categories from a WordPress API.
 * It manages loading, error, and data states.
 *
 * @param {Array<number>} ids - An array of project IDs to fetch.
 * @returns {{loading: boolean, error: string | null, projects: Array, categories: Array}}
 * An object containing the current loading state, any error message,
 * the fetched projects, and the fetched categories.
 */
const useProjectsData = (ids) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading is true on each effect run
      setError(null);   // Clear previous errors

      let idsString = ids.toString();
      const projectQueryParams = {
        include: idsString,
        _fields: "id,title,acf,categories",
        acf_format: "standard",
        status: "publish",
      };

      try {
        // Fetch projects data
        const projectsData = await getProjectsData(projectQueryParams);

        if (!projectsData || projectsData.length === 0) {
          setError('No projects found with the provided IDs.');
          setProjects([]); // Clear projects if none found
          setCategories([]); // Clear categories as well
          setLoading(false);
          return;
        }

        setProjects(projectsData);

        // Get all unique categories from the fetched projects
        const allCategories = Array.from(
          new Set(projectsData.reduce((acc, project) => acc.concat(project.categories), []))
        );

        // If there are no categories in the projects, default to "All"
        if (allCategories.length === 0) {
          setCategories([{ id: 'all', name: 'All' }]);
          setLoading(false);
          return;
        }

        const categoriesString = allCategories.join(',');
        const categoriesQueryParams = { include: categoriesString, _fields: "id,name,count" };

        // Fetch categories data
        const categoriesData = await getCategoriesData(categoriesQueryParams);

        // Ensure "All" category is always present
        if (!categoriesData || categoriesData.length === 0) {
          setCategories([{ id: 'all', name: 'All' }]);
        } else {
          // If you want "All" to always be the first option:
          // setCategories([{ id: 'all', name: 'All' }, ...categoriesData]);
          setCategories(categoriesData);
        }

        setLoading(false);
      } catch (err) {
        // Catch specific errors from getProjectsData/getCategoriesData
        setError(err.message || 'An unexpected error occurred while fetching data.');
        setLoading(false);
        setProjects([]);     // Clear projects on error
        setCategories([]);   // Clear categories on error
      }
    };

    fetchData();
  }, [ids]); // Re-run effect if 'ids' prop changes

  return { loading, error, projects, categories };
};

export default useProjectsData;