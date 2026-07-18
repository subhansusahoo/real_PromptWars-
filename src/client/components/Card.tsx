// Card component
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  role?: string
  ariaLabel?: string
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  role,
  ariaLabel,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}

export default Card
