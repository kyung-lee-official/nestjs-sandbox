"use client";

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

/* runtime validation function */
const validateUniqueOptions = (options: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  options.forEach((option) => {
    if (seen.has(option)) {
      duplicates.add(option);
    }
    seen.add(option);
  });

  if (duplicates.size > 0) {
    console.warn(
      `Duplicate options found: ${Array.from(duplicates).join(", ")}`,
    );
  }

  // Return unique options
  return Array.from(seen);
};

type DropdownProps = {
  mode?: "regular" | "search";
  placeholder?: string;
  options: string[];
  selected: string | string[] | null;
  setSelected: Dispatch<SetStateAction<string | string[] | null>>;
  setHover?: Dispatch<SetStateAction<string | string[] | null>>;
  multiple?: boolean;

  controlClassName: string;
  placeholderClassName?: string;
  /* label of selected option, string only */
  getLabel: (selected: string) => string | ReactNode;
  /* searchable string for each option, empty string if not provided */
  getSearchString?: (option: string) => string;
  searchInputClassName?: string;
  /* style of selected item in the input */
  selectedItemClassName?: (option: string) => string;
  /* style of the remove button, usually the cross ❌, not whole selected item, multiple select only */
  removeButtonClassName?: (option: string) => string;

  menuClassName?: string;
  /* wrapper of renderOption, this layer is necessary to keep mouse events defined inside the Dropdown component */
  optionWrapperClassName?: (
    option: string,
    state: { selected: boolean | null; hovered: boolean },
  ) => string;
  /* render option, usually for content styling */
  renderOption: (
    option: string,
    state: { selected: boolean | null; hovered: boolean },
  ) => ReactNode;
};

export const Dropdown = (props: DropdownProps) => {
  const {
    mode = "regular",
    placeholder = "Select an option",
    options: rawOptions,
    selected,
    setSelected,
    setHover,
    multiple = false,
    controlClassName = "",
    placeholderClassName = "",
    getLabel,
    getSearchString,
    searchInputClassName = "",
    selectedItemClassName = () => "",
    removeButtonClassName = () => "",
    menuClassName = "",
    optionWrapperClassName = () => "",
    renderOption,
  } = props;

  const options = validateUniqueOptions(rawOptions);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    if (multiple) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      const index = currentSelected.findIndex((item) => item === option);

      if (index > -1) {
        setSelected([
          ...currentSelected.slice(0, index),
          ...currentSelected.slice(index + 1),
        ]);
      } else {
        setSelected([...currentSelected, option]);
      }
    } else {
      setSelected(option);
      setIsOpen(false);
    }
  };

  const handleRemove = (option: string) => {
    if (multiple && Array.isArray(selected)) {
      setSelected(selected.filter((item) => item !== option));
    }
  };

  const filteredOptions = options.filter((option) => {
    if (mode !== "search" || !searchTerm) return true;
    const searchString = getSearchString ? getSearchString(option) : "";
    return searchString.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const isSelected = (option: string) =>
    multiple && Array.isArray(selected)
      ? selected.includes(option)
      : selected === option;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div className={controlClassName} onClick={() => setIsOpen(!isOpen)}>
        {multiple && Array.isArray(selected) && selected.length > 0 ? (
          selected.map((item, i) => (
            <div key={i} className={selectedItemClassName(item)}>
              <span>{getLabel(item)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item);
                }}
                className={removeButtonClassName(item)}
              >
                ×
              </button>
            </div>
          ))
        ) : !multiple && selected ? (
          <span className={selectedItemClassName(selected as string)}>
            {getLabel(selected as string)}
          </span>
        ) : (
          <span className={placeholderClassName}>{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className={menuClassName}>
          {mode === "search" && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search..."
              className={searchInputClassName}
            />
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => {
              const selected = isSelected(option);
              const hovered = hoveredId === option;
              return (
                <div
                  key={option}
                  className={optionWrapperClassName(option, {
                    selected,
                    hovered,
                  })}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => {
                    setHoveredId(option);
                    setHover && setHover(option);
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setHover && setHover(null);
                  }}
                >
                  {renderOption(option, {
                    selected,
                    hovered,
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
