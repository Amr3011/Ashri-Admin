import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/Logo.png"
                alt="ROKSTEP"
                className="h-36 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-purple-400 font-medium border-b-2 border-purple-400 pb-1 hover:text-purple-500 transition-colors"
            >
              Products
            </Link>

            <Link
              to="/orders"
              className="text-gray-700 font-medium hover:text-purple-400 transition-colors cursor-pointer"
            >
              Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
