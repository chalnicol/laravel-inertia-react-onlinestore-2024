import { useEffect, useMemo, useState } from 'react';

const Category = ({
    category,
    fontSize = '',
    className = '',
    selected = [],
    onSelect,
    editingCategoryId,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the visibility of children categories
    const toggleChildren = () => {
        if (category.all_children.length > 0) {
            setIsOpen((prev) => !prev);
        }
    };

    // Handle the click event for selecting a category
    const handleClick = () => {
        //if (category.id !== editingCategoryId) {
        onSelect(!isSelected ? category.id : null);
        //}
    };

    // Set the text class based on font size prop
    const textClass = `text-${fontSize !== '' ? fontSize : 'baseline'}`;

    // Check if the current category is selected
    const isSelected = useMemo(() => {
        return selected.includes(category.id);
    }, [selected, category.id]);

    // Check if any descendants are selected
    const isAnyDescendantSelected = useMemo(() => {
        const checkDescendants = (children) => {
            return children.some((child) => {
                // Check if this child is selected
                if (selected.includes(child.id)) {
                    return true;
                }
                // If the child has its own children, recursively check them
                if (child.all_children && child.all_children.length > 0) {
                    return checkDescendants(child.all_children);
                }
                return false;
            });
        };

        return checkDescendants(category.all_children);
    }, [category.all_children, selected]);

    useEffect(() => {
        // Set isOpen based on whether any child or descendant is selected
        setIsOpen(isAnyDescendantSelected);
    }, [isAnyDescendantSelected]);

    return (
        <div>
            <div className={` ${textClass} ${className}`}>
                <div
                    className={`flex cursor-pointer justify-between px-2 py-1 ${!isSelected ? 'hover:bg-gray-300' : ''} ${isSelected ? 'bg-gray-500 text-white' : ''}`}
                >
                    <div
                        className="flex grow items-center"
                        onClick={handleClick}
                    >
                        {isSelected && (
                            <span className="material-symbols-outlined mr-2 h-4 w-4 rounded-full border bg-green-600 text-center text-xs">
                                check
                            </span>
                        )}

                        {category.name}
                    </div>
                    {category.all_children &&
                        category.all_children.length > 0 && (
                            <button
                                type="button"
                                onClick={toggleChildren}
                                className="cursor-pointer px-2 font-medium hover:bg-gray-300 hover:text-gray-800"
                            >
                                {isOpen ? '-' : '+'}
                            </button>
                        )}
                </div>
            </div>
            {isOpen &&
                category.all_children &&
                category.all_children.length > 0 && (
                    <div className="ml-3 border-l border-gray-300">
                        {category.all_children.map((child) => (
                            <Category
                                fontSize={fontSize}
                                key={child.id}
                                category={child}
                                onSelect={onSelect}
                                selected={selected}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default Category;
