import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function FlashMessage({ flash }) {

  const [showFlashMessage, setShowFlashMessage] = useState(false);

  const mainRef = useRef(null);

  const animateClose = () => {
    gsap.fromTo (mainRef.current, { scaleY : 1}, { scaleY: 0, ease : 'elastic.in(1, 0.7)', duration : 0.6, onComplete : () => setShowFlashMessage(false)  });
  };

  const animateOpen = () => {
    setShowFlashMessage(true);
    gsap.fromTo (mainRef.current, { scaleY: 0}, { scaleY: 1, ease : 'elastic.out(1, 0.7)', duration : 0.6 });
  }

  useEffect(() => { 
    if (flash) {
      animateOpen();
    }
  }, [flash]);

  const commonClasses =
    "w-full my-4 rounded text-white px-3 py-2 flex justify-between";

  return (
    <div ref = {mainRef}>

      {showFlashMessage && flash?.success && (
        <div className={"bg-green-500 " + commonClasses}>
          <div>{flash.success}</div>
          <button onClick={animateClose}>&times;</button>
        </div>
      )}

      {showFlashMessage && flash?.error && (
        <div className={"bg-red-500 " + commonClasses}>
          <div>{flash.error}</div>
          <button onClick={animateClose}>&times;</button>
        </div>
      )}
    
      </div>

  );
}
