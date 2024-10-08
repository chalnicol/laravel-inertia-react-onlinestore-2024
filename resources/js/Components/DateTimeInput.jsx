import React, { useState, useEffect } from "react";

const DateTimeInput = ({ label, className='', error, onDateTimeChange }) => {
 

  const [data, setData] = useState({
    year : '',
    month : '',
    day : '',
    hour : '',
    minute : '',
    meridiem : ''
  });

  const handleChange = ( e ) => {

    const { name, value } = e.target;

    const trueValue = validateValue ( name, value );
    
    setData(prevData => ({...prevData, [name]: trueValue }));
  }

  const validateValue = ( name, value ) => {

    const date = new Date();

    const currentYear = date.getFullYear();

    console.log ( typeof value );
    if ( name === 'year' ) {
      if ( isNaN(value) || value < 1 ) {
        return '';
      }
      if ( value > date.getFullYear() ) {
        return date.getFullYear();
      }
    }

    if ( name ==='month' ) {
      if ( isNaN(value) || value < 1 || value > 12 ) {
        return '';
      }
    }

    if ( name ==='day' ) {
      if ( isNaN(value) || value < 1 || value > 31 ) {
        return '';
      }
    }

    if ( name ==='hour' ) {
      if ( isNaN(value) || value < 0 || value > 12 ) {
        return '';
      }
    }
    if ( name ==='minute' ) {
      if ( isNaN(value) || value < 0 || value > 59 ) {
        return '';
      }
    }

    if ( name ==='meridiem' ) {
      if ( value !=='' && !isNaN(value) ) {
        return '';
      }
      if ( value !== '' && value.toLowerCase() == 'p') {
        return 'PM';
      }else if ( value !== '' && value.toLowerCase() == 'a') {
        return 'AM';
      }else {
        return '';
      }

      // return value.toUpperCase();
    }


    return value;

  }

  useEffect (() => {

    const date = `${data.year}/${data.month}/${data.day}`;

    const time = `${data.hour}:${data.minute} ${data.meridiem}`;

    onDateTimeChange(`${date} ${time}`);

  }, [ data ]);

  // const handleDateTimeChange = () => {
  //   const date = `${year}-${month}-${day}`;
  //   const time = `${hour}:${minute} ${meridiem}`;
  //   onDateTimeChange(`${date} ${time}`);
  // };

  return (
    <>

      <div className={`focus-within:ring-1 focus-within:ring-blue-500 lg:flex items-center bg-white rounded border border-gray-500 text-sm text-gray-500 overflow-hidden ${ error ? 'border-red-500' : 'border-gray-500'}`}>
        
        <div className="border-r-0 border-b lg:min-w-[200px] lg:border-r lg:border-b-0 border-gray-300 bg-gray-100 p-2 lg:mr-4">
            {label}
        </div>
            
        <div className="grow flex gap-2 bg-white text-gray-500 rounded" >
          <div className="flex items-center">
            <input
              type="text"
              name="year"
              value={data.year}
              onChange={handleChange}
              placeholder="YYYY"
              maxLength="4"
              className="text-sm border-0 px-0 bg-transparent w-10 focus:outline-none focus:ring-0"
            />
            <span>/</span>
            <input
              type="text"
              name="month"
              value={data.month}
              onChange={handleChange}
              placeholder="MM"
              maxLength="2"

              className="text-sm border-0 px-0 bg-transparent w-7 text-center focus:outline-none focus:ring-0"
            />
            <span>/</span>
            <input
              type="text"
              name="day"
              value={data.day}
              onChange={handleChange}
              placeholder="DD"
              maxLength="2"

              className="text-sm border-0 px-0 bg-transparent w-7 text-center focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex items-center">
            <input
              type="text"
              name="hour"
              value={data.hour}
              onChange={handleChange}
              placeholder="HH"
              maxLength="2"
              className="text-sm border-0 px-0 bg-transparent w-7 text-center focus:outline-none focus:ring-0"
            />
            <span>:</span>
            <input
              type="text"
              name="minute"
              value={data.minute}
              onChange={handleChange}
              placeholder="MM"
              maxLength="2"
              className="text-sm border-0 px-0 bg-transparent w-7 text-center focus:outline-none focus:ring-0"
            />
            
            <input
              type="text"
              name="meridiem"
              value={data.meridiem}
              onChange={handleChange}
              placeholder="AA"
              maxLength="2"

              className="text-sm border-0 px-0 bg-transparent w-8 text-center focus:outline-none focus:ring-0"
            />
          </div>
        </div>

      </div>
    
    </>
    
  );
};

export default DateTimeInput;
