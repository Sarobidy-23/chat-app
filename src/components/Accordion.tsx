import React, { ReactNode, useState } from 'react'

interface Props {
  details: ReactNode
  clickable: ReactNode
}

export default function Accordion(props: Props) {
  const { details, clickable } = props
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(current => !current)
  return (
    <div>
      <div className='cursor-pointer transition flex items-center select-none' onClick={toggleExpanded}>
        {clickable}
      </div>
      <div className={`px-5 overflow-hidden transition ${expanded ? 'max-h-fit' : 'max-h-0'}`}>{details}</div>
    </div>
  )
}
