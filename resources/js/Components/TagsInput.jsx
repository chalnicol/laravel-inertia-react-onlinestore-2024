
import React, { useState, useRef, useEffect } from 'react';

const TagsInput = ({ value = [], className="", onTagsChange }) => {

    const [tags, setTags] = useState(value);
    const [input, setInput] = useState('');

    const searchRef = useRef(null);

    const addTag = () => {

        // const newTag = input.trim();

        // if (!tags.includes(newTag)) {
        //     const updatedTags = [...tags, newTag];
        //     setTags(updatedTags);
        //     onTagsChange(updatedTags); // Send tags back to parent
        //     setInput('');
        // }

        const newTags = input.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        const uniqueTags = newTags.filter(tag => !tags.includes(tag)); // Remove duplicates
        if (uniqueTags.length > 0) {
            const updatedTags = [...tags, ...uniqueTags];
            setTags(updatedTags);
            onTagsChange(updatedTags); // Send updated tags back to parent
        }
        setInput(''); // Clear the input field
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        onTagsChange(newTags);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value ) {
            e.preventDefault();
            addTag();
        }
    };

    const handleFocus = () => {
        // setInput(''); // Clear input when focused
        searchRef.current.focus();
    };

    
    return (
        <>
            <div tabIndex="0" className={'border border-gray-500 overflow-hidden rounded bg-white focus:outline-none focus-within:ring-2 focus-within:border-blue-800 ' + className} onFocus={handleFocus}>

                <div className="flex flex-wrap items-center gap-1 p-2 min-h-10">
                    
                    {tags && tags.length > 0 && (
                            tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-600 text-white text-sm px-3 py-0.5 rounded flex items-center space-x-3"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        className="text-white hover:text-red-400"
                                        onClick={() => removeTag(tag)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))
                        )
                    }
                    { tags && tags.length == 0 && <span className="text-xs text-gray-500">-- empty --</span>}
                    
                </div>
                <div className="flex pb-2 px-2 gap-2">
                    <div className="grow">
                        <input
                            ref={searchRef}
                            type="text"
                            className="text-sm border border-gray-400 shadow-inset rounded text-gray-800 px-2 py-1.5 w-full outline-none focus:outline-none focus:border-gray-300 focus:ring-0"
                            placeholder="input tags here separated by commas"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    
                    <button type="button" className="w-1/6 bg-gray-200 border border-gray-400 text-gray-800 rounded px-2 py-1 text-sm border rounded-br" onClick={addTag}>
                        Add
                    </button>
                </div>
                
            
            </div>
            
        </>
      
    );
};

export default TagsInput;
