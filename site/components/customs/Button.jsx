import React from 'react'

const Button = (props) => {
  return (
    <button {...props} className="font-semibold rounded-custom flex items-center text-white justify-center px-8 py-2 text-base capitalize disabled:bg-background-extralight disabled:hover:bg-background-extralight disabled:text-text-light bg-primary-main hover:bg-primary-dark">
        {props.content}
        </button>
  )
}

export default Button