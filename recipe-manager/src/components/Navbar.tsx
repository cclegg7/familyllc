import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/recipe-icon.png" 
            alt="Recipe Manager Logo" 
            width={40} 
            height={40}
            className="rounded-md"
          />
          <span className="text-xl font-bold">Family Recipe Manager</span>
        </Link>
        
        <div className="flex gap-6">
          <Link 
            href="/" 
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Home
          </Link>
          <Link 
            href="/recipes" 
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Recipes
          </Link>
          <Link 
            href="/recipes/new" 
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Add Recipe
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
