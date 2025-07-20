
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
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for dishes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 royal-border"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        
        {/* Category Filters */}
        <Badge
          variant={selectedCategory === "" ? "default" : "outline"}
          className="cursor-pointer hover:bg-royal-gold/20"
          onClick={() => handleCategoryFilter("")}
        >
          All Categories
        </Badge>
        
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-royal-gold/20"
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </Badge>
        ))}

        {/* Veg/Non-Veg Filters */}
        <div className="flex gap-2 ml-4">
          <Badge
            variant={vegFilter === null ? "default" : "outline"}
            className="cursor-pointer hover:bg-royal-gold/20"
            onClick={() => handleVegFilter(null)}
          >
            All
          </Badge>
          <Badge
            variant={vegFilter === true ? "default" : "outline"}
            className="cursor-pointer hover:bg-green-500/20 text-green-600 border-green-500"
            onClick={() => handleVegFilter(true)}
          >
            Veg
          </Badge>
          <Badge
            variant={vegFilter === false ? "default" : "outline"}
            className="cursor-pointer hover:bg-red-500/20 text-red-600 border-red-500"
            onClick={() => handleVegFilter(false)}
          >
            Non-Veg
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MenuSearch;
