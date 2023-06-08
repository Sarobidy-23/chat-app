import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  label: string
  id: string
  complementProps?: any
  error?: string | undefined
  startItem?: any
  value?: string
  disable?: boolean
}

export default function InputField(props: InputProps) {
  const { id, type, placeholder, label, complementProps, error, startItem, value, disable } = props

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
        {label}
      </label>
      <div className='mt-2 relative'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>{startItem}</div>
        <input
          id={id}
          name={label}
          type={type}
          autoComplete={type}
          value={value}
          {...complementProps}
          placeholder={placeholder}
          disabled={disable}
          readOnly={disable}
          className={`pl-10 pr-10 block w-full rounded-md ${
            disable && 'cursor-not-allowed'
          } py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 ${
            error ? 'focus:ring-red-500 ring-red-500' : 'focus:ring-indigo-600'
          } focus:outline-none`}
        />
      </div>
      <span className='flex items-center font-medium text-red-500 text-xs mt-1 ml-1'>{error}</span>
    </div>
  )
}
