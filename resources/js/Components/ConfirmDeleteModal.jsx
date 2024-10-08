import React, {useEffect, useState} from "react";
import Modal from '@/Components/Modal';

export default function ConfirmDeleteModal ({ show, size, toDelete, onDeleteConfirmation }) {

    const [ showModal, setShowModal ] = useState(show);

    const handleConfirmClick = ( confirmed ) => {
        setShowModal(confirmed);
        onDeleteConfirmation(confirmed);
    }
    
    useEffect(() => {
        setShowModal(show);
    }, [show]);

    return (

        <Modal show={showModal} maxWidth={size} >
            <div className="bg-gray-800 text-white px-3 py-2">Confirm Delete</div>
            <div className="p-4">
                <div>Are you sure want to delete?</div>
                <div className="my-3 rounded text-sm border px-2 py-1 bg-gray-100">
                    <span className="font-medium">{toDelete?.name}</span> 
                </div>
                <div className="grid grid-cols-2 gap-2 mt-6">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-700 p-1 rounded text-lg text-white" onClick={() => handleConfirmClick(false)} >Cancel</button>
                    <button className="w-full bg-red-500 hover:bg-red-700 p-1 rounded text-lg text-white" onClick={() => handleConfirmClick(true) }>Confirm</button>
                </div>
            </div>
        </Modal>

    );



}