import DisplayMessage from '@/components/DisplayMessage'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'
import * as yup from 'yup'
import { Configuration, CreateMessage, MessageApi } from '@/client'
import { getCookie } from 'cookies-next'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface Props {
    userId: number
}
const schema = yup.object({
    content: yup.string().required()
  })
  

export default function UserMessage(props: Props) {
    const { userId } = props
    const router = useRouter()
    const getMessage = async () => {
        const conf = new Configuration()
        conf.accessToken = getCookie("chat-token")?.toString()
        const client = new MessageApi(conf)
        return client
            .getByUserId(parseInt(userId.toString()))
            .then((response) => response.data?.messages?.reverse())
    }
   const {data, mutate} = useSWR("userMessage", getMessage, { revalidateIfStale: true, refreshWhenHidden: false, refreshInterval: 3000, revalidateOnMount: true })
     
    const form = useForm<CreateMessage>({
        mode:'all',
        resolver: yupResolver(schema)
    })
    const { register, handleSubmit, reset } = form

    const sendMessage = async (data: CreateMessage) => {
        const conf = new Configuration()
        conf.accessToken = getCookie("chat-token")?.toString()
        const client = new MessageApi(conf)
        data.recipientId = userId
        client
            .createMessage(data)
            .then(() => {mutate(); reset()})
    }
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800 p-5">
	<div className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
		<div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {data?.reverse()?.map((message)=>(
                <DisplayMessage
                    createdAt={message.createdAt?.toString() as string}
                    senderId={message.sender?.id?.toString() as string}
                    senderName={message.sender?.name?.toString() as string}
                    content={message.content?.toString() as string}
                    />
            ))}
		</div>
		<form className="bg-gray-300 p-4 flex" name='sendMessageForm' onSubmit={handleSubmit(sendMessage)}>
			<textarea className="flex items-center h-10 w-full rounded px-3 text-sm" 
                rows={2} 
                placeholder="Type your message…"
                {...register('content')}/>
            <button type='submit' className="w-20 h-10 transition duration-75 ml-6 mr-6 hover:bg-gray-400 bg-gray-200 pl-5 pr-5 rounded-lg">
                <img src='/send.svg'/>
            </button>
		</form>
	</div>
</main>
  )
}

UserMessage.getLayout = function getLayout(page: ReactElement) {
    return(
        <main>
            <Sidebar>
                {page}
            </Sidebar>
        </main>
    )
}

export async function getServerSideProps(context:{params:{user_id: number}}) {
    const userId = context?.params?.user_id
    return {
        props: {
            userId
        }
    }
}