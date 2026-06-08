import { Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <nav className="flex justify-between items-center px-8 py-4 max-w-350 mx-auto h-20">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#002629]">
            ePustakalay
          </h1>

          <div className="hidden md:flex gap-8 items-center text-sm">
            <a href="/" className="font-bold border-b-2 border-[#002629] pb-1">
              Home
            </a>
            <a href="/books" className="text-gray-500">Books</a>
            <a className="text-gray-500">Wishlist</a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-slate-200/50 rounded-lg px-3 py-2 w-64">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search the collection..."
              className="bg-transparent outline-none ml-2 text-sm w-full"
            />
          </div>

          <ShoppingCart size={18} />
          <User size={18} />
        </div>
      </nav>
    </header>
  );
}