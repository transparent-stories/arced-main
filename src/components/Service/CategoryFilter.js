// CategoryFilter.js
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CategoryFilter = ({ featured_image, categories, handleCategoryFilter, activeCategory }) => {
  const getButtonClasses = (categoryId) => {
    // Adjusted padding for better mobile responsiveness,
    // px-4 for smaller screens, sm:px-8 for medium, md:px-12 for larger
    const baseClasses = "px-4 py-4 text-sm rounded-2xl shadow-md transition duration-100 ease-in-out cursor-pointer whitespace-nowrap sm:px-2 md:px-4 min-w-[300px] max-w-[500px] flex flex-col items-center gap-5";
    const activeClasses = "bg-pink text-white hover:bg-pink";
    const inactiveClasses = "text-white hover:bg-pink";

    return `${baseClasses} ${activeCategory === categoryId ? activeClasses : inactiveClasses}`;
  };

  return (
    <motion.div
      // Ensure this div's parent properly constrains its width.
      // `mx-auto` and `max-w-full` or `max-w-screen-xl` might be needed on a parent.
      // `w-full` ensures it takes available width.
      // Added `flex-nowrap` explicitly, though `flex` implies it by default without `flex-wrap`.
      // `items-center` for vertical alignment of buttons.
      // `justify-start` ensures content starts from the left, which is typical for horizontal scrolls.
      className={`flex flex-nowrap items-center ${categories.length<=3 && "justify-center"} gap-4 p-4 mb-10 overflow-x-auto 
        [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-gray-700`}
      style={{}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >

      {/* Render the rest of the category buttons */}
      {categories.map(category => (
        <motion.button
          key={category.id}
          onClick={() => handleCategoryFilter(category.id)}
          className={getButtonClasses(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          { category?.acf?.featured_image 
          && 
            <Image
              src={category.acf.featured_image}
              width={300}
              height={500}
              className='aspect-video rounded-xl object-cover'
              alt="Picture of the author"
            />
          }
          {category.name}
        </motion.button>
      ))}

      {/* "All" button */}
      <motion.button
        onClick={() => handleCategoryFilter('all')}
        className={getButtonClasses('all')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      >
      { featured_image 
          && 
            <Image
              src={featured_image}
              width={300}
              height={500}
              className='aspect-video rounded-xl object-cover'
              alt="Picture of the author"
            />
          }
        All Projects
      </motion.button>
      
    </motion.div>
  );
};

export default CategoryFilter;