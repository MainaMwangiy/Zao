import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface SearchInputProps {
    placeholder?: string;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, searchTerm, setSearchTerm }) => {
    const [inputValue, setInputValue] = useState(searchTerm);
    const debouncedUpdate = debounce((value) => {
        if (value.trim().endsWith(' ') || !value.includes(' ')) {
            setSearchTerm(value.trim());
        }
    }, 500);
    useEffect(() => {
        debouncedUpdate(inputValue);
        return () => debouncedUpdate.cancel();
    }, [inputValue]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };

    return (
        <div className="relative mb-4">
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                value={inputValue}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
        </div>
    );
};

export default SearchInput;
