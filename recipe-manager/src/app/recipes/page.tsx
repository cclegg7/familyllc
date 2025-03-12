'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { getAllRecipes } from '@/utils/recipeUtils';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('title'); // Default sort by title

  useEffect(() => {
    const loadRecipes = () => {
      const allRecipes = getAllRecipes();
      setRecipes(allRecipes);
    };

    loadRecipes();
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(recipes.map(recipe => recipe.category)));

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    } else if (sortBy === 'prepTime') {
      return a.prepTime - b.prepTime;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Recipe Book</h1>
        <Link 
          href="/recipes/new" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-4 rounded-md inline-block transition-colors text-sm"
        >
          Add New Recipe
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:text-white text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="prepTime">Sort by Prep Time</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>
      </div>

      {/* Recipe List */}
      {sortedRecipes.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipe
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Servings
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedRecipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {recipe.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">
                          {recipe.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    <div>Prep: {recipe.prepTime} min</div>
                    <div>Cook: {recipe.cookTime} min</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {recipe.servings}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="text-amber-600 hover:text-amber-900 dark:hover:text-amber-400 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">No recipes found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory 
              ? "Try adjusting your search or filter criteria." 
              : "Start by adding your first recipe!"}
          </p>
          <Link 
            href="/recipes/new" 
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-4 rounded-md inline-block transition-colors text-sm"
          >
            Add New Recipe
          </Link>
        </div>
      )}
    </div>
  );
}
