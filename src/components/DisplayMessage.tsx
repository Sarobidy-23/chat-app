import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import format from '@/utils/FormatDate'

interface Props {
    senderId: string,
    senderName: string,
    content: string,
    createdAt: string
}

export default function DisplayMessage(props: Props) {
    const { senderId, senderName, content, createdAt } = props 
    const currentUserId = getCookie("chat-user-id")?.toString()
    const [time, setTime] = useState("now")
    useEffect(()=>{
        setInterval(()=>{
            setTime(format(new Date(createdAt)))
        }, 3000)
    },[])
  return (
    <div className={`flex w-full mt-2 space-x-3 max-w-xs ${currentUserId == senderId && "ml-auto justify-end"}`}>
        {currentUserId != senderId && <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>}
        <div>
            <span>{senderName}</span>
            <div className={`${currentUserId == senderId ? "bg-blue-600 text-white" : "bg-gray-300"} p-3 rounded-r-lg rounded-bl-lg`}>
                <p className="text-sm">{content}</p>
            </div>
            <span className="text-xs text-gray-500 leading-none">{time}</span>
        </div>
        {currentUserId == senderId && <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>}
    </div>
  )
}
