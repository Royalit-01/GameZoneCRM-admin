import React from 'react'

const CustomButton = ({ text ,onClick,className=""}) => {
    return (
        <button className={`btn btn-sm btn-outline-secondary ${className}`}  onClick={onClick}>
            {text}
        </button>
    )
}

export default CustomButton