import React from "react"

const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  }
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  }

  const combinedClassName = `${baseStyle} ${variantStyles[variant] || ''} ${sizeStyles[size] || ''} ${className || ''}`

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}

export { Button }