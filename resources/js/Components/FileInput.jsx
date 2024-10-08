import React, { useRef, useState, useEffect } from 'react';

export default function FileInput ({ label, className='', onFileInputChange }) {

    const fileInputRef = useRef(null);

    const [fileName, setFileName] = useState(label);
    const [files, setFiles] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            // console.log (e.target.files);
            setFileName(e.target.files[0].name); // Change button text to the file name
            setFiles(e.target.files); // Store the selected file for future use
        } else {
            setFileName(label); // Reset if no file is selected
            setFiles(null);
        }
        //onFileInputChange(e.target.files); // Call the parent component's onChange function with the selected file
    }

    useEffect (() => {
        onFileInputChange (files);
    }, [files]);

    return (
        <div>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*" // Hide the actual file input
            />

            {/* Custom button */}

            <div tabIndex="0" className={`focus-within:ring-1 focus-within:border-indigo-500 select-none bg-white flex items-center gap-2 px-2 py-1.5 border rounded text-sm text-gray-500 ` + className  }  onClick={handleButtonClick}>
                <button 
                    type="button" 
                    className="border border-gray-400 px-4 py-0.5 bg-gray-200 hover:bg-gray-300 rounded outline-none"
                >
                    choose file
                </button>
                <div>
                    {fileName} 
                </div>
            </div>
           

           
        </div> 
    )
}