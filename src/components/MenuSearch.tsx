
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface MenuSearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onVegFilter: (isVeg: boolean | null) => void;
  categories: string[];
}

const MenuSearch = ({ onSearch, onCategoryFilter, onVegFilter, categories }: MenuSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [vegFilter, setVegFilter] = useState<boolean | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    onCategoryFilter(category);
  };

  const handleVegFilter = (isVeg: boolean | null) => {
    setVegFilter(isVeg);
    onVegFilter(isVeg);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-12 royal-border text-base py-3"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="h-5 w-5 text-royal-gold" />
        
        {/* Category Filters */}
        <button
          className={`px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
            selectedCategory === "" 
              ? "bg-royal-gold text-black border-royal-gold shadow-lg" 
              : "bg-black text-white border-royal-gold hover:bg-royal-gold/10 hover:border-royal-gold/80"
          }`}
          onClick={() => handleCategoryFilter("")}
        >
          All Categories
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              selectedCategory === category 
                ? "bg-royal-gold text-black border-royal-gold shadow-lg" 
                : "bg-black text-white border-royal-gold hover:bg-royal-gold/10 hover:border-royal-gold/80"
            }`}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}

        {/* Veg/Non-Veg Filters */}
        <div className="flex gap-3 ml-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              vegFilter === null 
                ? "bg-royal-gold text-black border-royal-gold shadow-lg" 
                : "bg-black text-white border-royal-gold hover:bg-royal-gold/10 hover:border-royal-gold/80"
            }`}
            onClick={() => handleVegFilter(null)}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              vegFilter === true 
                ? "bg-green-500 text-white border-green-500 shadow-lg" 
                : "bg-black text-white border-green-500 hover:bg-green-500/10 hover:border-green-500/80"
            }`}
            onClick={() => handleVegFilter(true)}
          >
            Veg
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              vegFilter === false 
                ? "bg-orange-500 text-white border-orange-500 shadow-lg" 
                : "bg-black text-white border-orange-500 hover:bg-orange-500/10 hover:border-orange-500/80"
            }`}
            onClick={() => handleVegFilter(false)}
          >
            Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSearch;
