/**
 * @license MIT
 * @origin Shark UI / HeroUI (https://shark.vini.one)
 * @author Shark UI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { Search, Check, ChevronDown, Loader2, X } from "lucide-react";

export interface ComboboxItem {
  value: string;
  label: string;
  category?: string;
}

export interface ComboboxVirtualizedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ComboboxItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  itemHeight?: number;
  visibleCount?: number;
  disabled?: boolean;
}

export function ComboboxVirtualized({
  items = [],
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search 10,000+ options...",
  isLoading = false,
  itemHeight = 36,
  visibleCount = 8,
  disabled = false,
  className,
  ...props
}: ComboboxVirtualizedProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value !== undefined) setSelectedValue(value);
  }, [value]);

  const filteredItems = React.useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(term) ||
        it.value.toLowerCase().includes(term) ||
        (it.category && it.category.toLowerCase().includes(term))
    );
  }, [items, searchTerm]);

  const totalHeight = filteredItems.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(
    filteredItems.length,
    Math.ceil((scrollTop + visibleCount * itemHeight) / itemHeight) + 2
  );
  const visibleItems = filteredItems.slice(startIndex, endIndex);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    onChange?.(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(filteredItems.length - 1, prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[activeIndex]) {
        handleSelect(filteredItems[activeIndex].value);
      }
    }
  };

  const selectedItem = items.find((it) => it.value === selectedValue);

  return (
    <div
      className={cn("relative inline-block w-full max-w-sm select-none", className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Virtualized selection combobox"
        className={cn(
          "flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border bg-background text-xs font-medium text-foreground transition-colors shadow-xs",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "opacity-50 cursor-not-allowed bg-muted",
          isOpen ? "border-ring ring-2 ring-ring" : "border-input"
        )}
      >
        <span className={cn(!selectedItem && "text-muted-foreground")}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 animate-in fade-in-50 overflow-hidden"
          role="listbox"
        >
          {/* Search Box */}
          <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/20">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setScrollTop(0);
                setActiveIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              aria-label="Filter options"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search text"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Virtualized List Container */}
          <div
            ref={containerRef}
            onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
            style={{ height: `${visibleCount * itemHeight}px` }}
            className="relative overflow-y-auto w-full p-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                <span>Loading options...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                No matching options found.
              </div>
            ) : (
              <div style={{ height: `${totalHeight}px`, position: "relative" }}>
                {visibleItems.map((item, index) => {
                  const actualIndex = startIndex + index;
                  const isSelected = item.value === selectedValue;
                  const isActive = actualIndex === activeIndex;

                  return (
                    <div
                      key={item.value}
                      onClick={() => handleSelect(item.value)}
                      onMouseEnter={() => setActiveIndex(actualIndex)}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        position: "absolute",
                        top: 0,
                        transform: `translateY(${actualIndex * itemHeight}px)`,
                        height: `${itemHeight}px`,
                        width: "100%",
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 rounded-lg text-xs cursor-pointer transition-colors",
                        isSelected && "bg-primary/10 text-primary font-semibold",
                        isActive && !isSelected && "bg-accent text-accent-foreground",
                        !isActive && !isSelected && "text-foreground"
                      )}
                    >
                      <span className="truncate">{item.label}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
