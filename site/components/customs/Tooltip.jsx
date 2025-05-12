import React from 'react'

// Don't forget to add 'group and relative class to parent'

const Tooltip = (props) => {
    const { text, alignment = "bottom" } = props

    if (alignment == "bottom")
        return (
            <div className="absolute z-40 hidden translate-x-[-50%] left-[50%] top-0 flex-col items-center mt-8 group-hover:flex">
                <div className="w-3 h-3 -mb-2 rotate-45 bg-background-extralight"></div>
                <span className="relative z-10 p-2 text-sm text-text-light text-center min-w-[40px] font-semibold leading-none  whitespace-no-wrap bg-background-extralight rounded-lg shadow-lg">{text}</span>
            </div>
        )
    else if (alignment == "left")
        return (
            <div className="absolute z-40 hidden right-0 flex-row items-center mr-8 group-hover:flex">
                <span className="relative z-10 p-2 text-sm text-text-light text-center min-w-[40px] font-semibold leading-none  whitespace-no-wrap bg-background-extralight rounded-lg shadow-lg">{text}</span>
                <div className="w-3 h-3 -ml-2 rotate-45 bg-background-extralight"></div>
            </div>
        )
    else if (alignment == "right")
        return (
            <div className="absolute z-40 hidden left-0 flex-row items-center ml-8 group-hover:flex">
                <div className="w-3 h-3 -mr-2 rotate-45 bg-background-extralight"></div>
                <span className="relative z-10 p-2 text-sm text-text-light text-center min-w-[40px] font-semibold leading-none  whitespace-no-wrap bg-background-extralight rounded-lg shadow-lg">{text}</span>
            </div>
        )
    else return (
            <div className="absolute z-40 hidden bottom-0 flex-col items-center mb-8 group-hover:flex">
                <span className="relative z-10 p-2 text-sm text-text-light text-center min-w-[40px] font-semibold leading-none  whitespace-no-wrap bg-background-extralight rounded-lg shadow-lg">{text}</span>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-background-extralight"></div>
            </div>
        )
}

export default Tooltip