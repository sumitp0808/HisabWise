import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export default function Searchbar() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Search size={20} />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start bg-white/80 backdrop-blur-md p-4 lg:p-6">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-xl border bg-white p-3 shadow-lg">
            <Search size={20} className="text-gray-400" />

            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none"
            />

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}