'use client';

import Link from 'next/link';
import RecipeForm from '@/components/RecipeForm';

export default function NewRecipePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/recipes"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back to Recipes
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Add New Recipe</h1>
      
      <RecipeForm />
    </div>
  );
}
