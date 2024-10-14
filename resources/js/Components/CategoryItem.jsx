import { useState } from 'react';

const Category = ({ category, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChildren = () => {
        if (category.all_children.length > 0) {
            setIsOpen((prev) => !prev);
        }
    };

    return (
        <div>
            <div
                onClick={toggleChildren}
                className={
                    'cursor-pointer text-xs hover:bg-gray-200' + className
                }
            >
                <div
                    className={`flex cursor-pointer justify-between py-1 ${isOpen ? 'border-b' : 'border-0'} border-gray-500`}
                >
                    <div>{category.name}</div>
                    {category.all_children &&
                        category.all_children.length > 0 && (
                            <span className="font-medium">
                                {isOpen ? '-' : '+'}
                            </span>
                        )}
                </div>
            </div>
            {isOpen &&
                category.all_children &&
                category.all_children.length > 0 && (
                    <div className="pl-4">
                        {category.all_children.map((child) => (
                            <Category
                                key={child.id}
                                category={child}
                                className="mb-1"
                            />
                        ))}
                    </div>
                )}
        </div>
    );
};

export default Category;
