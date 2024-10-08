import React, { useEffect, useState, useRef } from "react";
import NavLink from "@/Components/NavLink";

export default function SelectSearch({ resource, error, className='', multiSelect = false, value=[], onValueChange }) {

    const [search, setSearch] = useState('');
    const [options, setOptions] = useState(null);
    const [selected, setSelected] = useState([]);
    const [showOptions, setShowOptions] = useState(false);

    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const timerRef = useRef(null);;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        clearTimeout ( timerRef.current);
        timerRef.current = setTimeout(() => fetchOptions(e.target.value), 300);
    }

    const fetchOptions = async (query = '') => {

        try {
            const response = await fetch('/'+ resource +'/search?search=' + query, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
               
            });
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
        if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
            setShowOptions(false);
        }
    };

    const handleOptionClick = (option) => {
        const toAdd = {
            name: option.name,
            id: option.id,
        };
        
        if (multiSelect) {
            if (!isSelected(option.id)) {
                setSelected([...selected, toAdd]);
                onValueChange([...selected.map(item => item.id), toAdd.id]); // Emit the IDs
            }
        } else {
            
            setSelected([toAdd]);

            setSearch('');

            setShowOptions(false);

            onValueChange(toAdd.id); // Emit the ID

            dropdownRef.current.blur(); // Hide the dropdown when an option is selected

        }
       
    };

    const isSelected = (id) => {
        return selected.some(item => item.id === id);
    };

    const handleRemoveSelected = ( option ) => {
        onValueChange(setSelected(selected.filter(item => item.id !== option.id)));
        dropdownRef.current.focus();
    }
    
    useEffect(() => {
        // console.log ( value );
        if ( value ) {
            setSelected ( Array.isArray(value) ? value : [value] );
        }
        fetchOptions();
    }, []);
    
    

    useEffect (() => {
        if (showOptions) {
            searchRef.current.focus();
        }
    }, [showOptions]);

    

    return (
        <>
            
            <div
                ref={dropdownRef}
                className="relative select-none outline-none focus-within:ring-blue-500 focus-within:ring-1 rounded text-sm"
                tabIndex="0"
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <div className={`w-full px-2 py-1.5 border rounded bg-white flex flex-wrap gap-1 items-center ` + className }>
                    {selected && selected.length > 0 ? (
                        selected.map((item) => (
                            <div key={item.id} className="flex text-sm items-center px-3 py-0.5 bg-gray-600 rounded text-white border-gray-500">
                                {item.name}
                                <button
                                    onClick={() => handleRemoveSelected(item) }
                                    className="ml-2 text-white hover:text-red-500"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm py-0.5">select {resource} here</span>
                    )}
                </div>

                <div className={`absolute overflow-hidden border border-gray-400 rounded bg-white w-full mt-1 p-2 z-40 shadow-xl ${showOptions ? 'block' : 'hidden'}`}>

                    <div className="mb-3">

                  
                        <div className="flex gap-2">    

                            <input type="text" name="toAdd" className="grow rounded px-2 py-1" placeholder="input new here" />

                            <button className="bg-gray-500 px-2 py-1 text-white rounded">
                                + Add New
                            </button>
                            
                        </div>
                        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
                    </div>

                    <div className="mb-2">

                        <input
                            ref={searchRef}
                            className="p-1 w-full border-0 border-b border-gray-500 outline:none focus:outline-none focus:ring-0 focus:border-gray-500"
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder={`filter search ${resource} here`}
                        
                        />
                    </div>
                
                    <div className="h-[145px] overflow-y-auto">
                        { options && options.length > 0 ? (
                            options.map((option) => (
                            <div
                                key={option.id}
                                className="flex justify-between items-center p-2 hover:bg-lime-200 border-b even:bg-gray-100"
                                onClick={() => handleOptionClick(option)}
                            >
                                <div>{option.name}</div>
                                {isSelected(option.id) ? (
                                    <div className="px-2 py-1 rounded-full w-4 h-4 flex justify-center items-center text-white text-xs bg-green-600">&#10004;</div>
                                ) : (
                                    <div className="px-2 py-1 rounded-full w-4 h-4 flex justify-center items-center text-white text-xs bg-gray-400">+</div>
                                )}
                            </div>
                        ))) : (
                            <span className="p-1">No results found</span>
                        )}

                    </div>
                   

                    

                </div>
            </div>
        </>
    );
}
