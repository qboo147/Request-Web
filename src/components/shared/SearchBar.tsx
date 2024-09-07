
import { IoSearchOutline } from "react-icons/io5";


interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  width?: number;
}

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search...",
  width,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center" style={{ width }}>
      <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ borderColor: "black" }}
      />
    </div>
  );
}
