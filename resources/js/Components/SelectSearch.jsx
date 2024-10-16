import { useEffect, useRef, useState } from 'react';

export default function SelectSearch({
    resource,
    fontSize = '',
    className = '',
    maxSelect = 1,
    value = [],
    withCreate = false,
    onValueChange,
}) {
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState(null);
    const [selected, setSelected] = useState([]);
    const [showOptions, setShowOptions] = useState(false);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const timerRef = useRef(null);

    const textClass = `text-${fontSize !== '' ? fontSize : 'baseline'}`;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fetchOptions(e.target.value), 300);
    };

    const fetchOptions = async (query = '') => {
        try {
            const response = await fetch(
                '/' + resource + '/search?search=' + query,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleFocus = () => {
        setShowOptions(true);
    };

    const handleBlur = (e) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(e.relatedTarget)
        ) {
            setShowOptions(false);
        }
    };

    const handleOptionClick = (option) => {
        const toAdd = {
            name: option.name,
            id: option.id,
        };

        if (maxSelect > 1) {
            if (!isSelected(option.id) && selected.length < maxSelect) {
                const newSelected = [...selected, toAdd];
                setSelected(newSelected);
                onValueChange(newSelected.map((item) => item.id));
            }
        } else {
            setSelected([toAdd]);
            setSearch('');
            setShowOptions(false);
            onValueChange([toAdd.id]); // Emit the ID
            dropdownRef.current.blur(); // Hide the dropdown when an option is selected
        }
    };

    const isSelected = (id) => {
        return selected.some((item) => item.id === id);
    };

    const handleRemoveSelected = (option) => {
        const newSelected = selected.filter((item) => item.id !== option.id);
        setSelected(newSelected);
        onValueChange(newSelected.map((item) => item.id));
        dropdownRef.current.focus();
    };

    useEffect(() => {
        // console.log ( value );
        if (value) {
            setSelected(Array.isArray(value) ? value : [value]);
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        if (showOptions) {
            searchRef.current.focus();
        }
    }, [showOptions]);

    return (
        <>
            <div
                ref={dropdownRef}
                className="relative select-none rounded outline-none focus-within:ring-1 focus-within:ring-blue-500"
                tabIndex="0"
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <div
                    className={`flex w-full flex-wrap items-center gap-1 rounded border border-gray-500 bg-white px-2 py-1.5 ${textClass} ${className}`}
                >
                    {selected && selected.length > 0 ? (
                        selected.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center rounded border-gray-500 bg-gray-600 px-3 py-0.5 text-white`}
                            >
                                {item.name}
                                <button
                                    onClick={() => handleRemoveSelected(item)}
                                    className="ml-2 text-white hover:text-red-500"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="py-0.5 text-gray-500">
                            select {resource} here
                        </span>
                    )}
                </div>

                <div
                    className={`absolute z-40 mt-1 w-full overflow-hidden rounded border border-gray-400 bg-white p-2 shadow-xl ${textClass} ${showOptions ? 'block' : 'hidden'}`}
                >
                    {withCreate && (
                        <div className="mb-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="toAdd"
                                    className={`grow rounded px-2 py-1 ${textClass}`}
                                    placeholder="input new here"
                                />

                                <button className="rounded bg-gray-500 px-2 py-1 text-white">
                                    + Add New
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mb-2">
                        <input
                            ref={searchRef}
                            className={`outline:none w-full border-0 border-b border-gray-500 p-1 focus:border-gray-500 focus:outline-none focus:ring-0 ${textClass}`}
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder={`filter search ${resource} here`}
                        />
                    </div>

                    <div className="h-[145px] overflow-y-auto">
                        {options && options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option.id}
                                    className="flex items-center justify-between border-b p-2 even:bg-gray-100 hover:bg-lime-200"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <div>{option.name}</div>
                                    {isSelected(option.id) ? (
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 px-2 py-1 text-xs text-white">
                                            &#10004;
                                        </div>
                                    ) : (
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 px-2 py-1 text-xs text-white">
                                            +
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <span className="p-1">No results found</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
