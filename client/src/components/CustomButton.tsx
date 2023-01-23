import React from 'react'

interface CustomButtonProps {
    btnType: 'button' | 'submit' | 'reset'
    title: string
    handleClick?: () => void
    styles: string
}

const CustomButton = ({ btnType, title, handleClick, styles }: CustomButtonProps) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-medium text-[16px] leading-[26px] text-white h-[40px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton