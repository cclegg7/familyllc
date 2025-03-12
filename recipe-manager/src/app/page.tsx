import Image from "next/image";
import Link from "next/link";
import { getAllRecipes } from "@/utils/recipeUtils";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Family Recipe Manager</h1>
          <p className="text-lg mb-6">
            Store, organize, and share your favorite family recipes in one place.
            Never lose a cherished recipe again!
          </p>
          <Link
            href="/recipes"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full inline-block transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src="/recipe-book.png"
            alt="Recipe Book"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Recipes</h3>
            <p>Easily add your favorite recipes with ingredients, instructions, and cooking times.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize Collection</h3>
            <p>Categorize and search through your recipe collection with ease.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Recipes</h3>
            <p>Share your favorite recipes with family and friends.</p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="bg-amber-50 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Start building your recipe collection today. Add your first recipe or browse our collection for inspiration.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/recipes/new"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full inline-block transition-colors"
          >
            Add Recipe
          </Link>
          <Link
            href="/recipes"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium py-2 px-6 rounded-full inline-block transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </section>
    </div>
  );
}
