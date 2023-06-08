import { Channel, ChannelApi, Configuration, CreateMessage, MessageApi } from '@/client'
import DisplayMessage from '@/components/DisplayMessage'
import Sidebar from '@/components/Sidebar'
import React, { ReactElement, useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface Props {
  channelId: number
}
const schema = yup.object({
  message: yup.string().required()
})

type FormData = yup.InferType<typeof schema>;

export default function ChannelMessage(props: Props) {
  const { channelId } = props
  const [channel, setChannel] = useState<Channel>()

  const getChannel = async () => {
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new ChannelApi(conf)
    return client.getOne(parseInt(channelId.toString())).then(response => setChannel(response.data.channel))
  }

  useEffect(() => {
    getChannel()
  }, [])

  const router = useRouter()

  const getMessage = async () => {
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new MessageApi(conf)
    return client.getByChannelId(parseInt(channelId.toString())).then(response => response.data?.messages?.reverse())
  }

  const { data, mutate } = useSWR('channelMessage', getMessage, { revalidateIfStale: true, refreshWhenHidden: false, refreshInterval: 3000 })

  const form = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const {
    register,
    handleSubmit,
    reset
  } = form

  const sendMessage = async (data: FormData) => {
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new MessageApi(conf)
    client.createMessage({content: data.message, channelId}).then(() => {
      mutate()
      reset()
    })
  }

  return (
    <main className='flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800 p-5'>
      <div className='flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden'>
        <div className='flex items-center '>
          <div
            className='bg-gray-100 p-2 flex items-center space-x-2 cursor-pointer w-24 rounded-lg justify-center'
            onClick={() => router.push(`/channel/edit/${channelId}`)}
          >
            <span>Edit</span>
            <svg className='w-4 h-4 fill-current' viewBox='0 0 16 16'>
              <path d='m15.621 7.015-1.8-.451A5.992 5.992 0 0 0 13.13 4.9l.956-1.593a.5.5 0 0 0-.075-.611l-.711-.707a.5.5 0 0 0-.611-.075L11.1 2.87a5.99 5.99 0 0 0-1.664-.69L8.985.379A.5.5 0 0 0 8.5 0h-1a.5.5 0 0 0-.485.379l-.451 1.8A5.992 5.992 0 0 0 4.9 2.87l-1.593-.956a.5.5 0 0 0-.611.075l-.707.711a.5.5 0 0 0-.075.611L2.87 4.9a5.99 5.99 0 0 0-.69 1.664l-1.8.451A.5.5 0 0 0 0 7.5v1a.5.5 0 0 0 .379.485l1.8.451c.145.586.378 1.147.691 1.664l-.956 1.593a.5.5 0 0 0 .075.611l.707.707a.5.5 0 0 0 .611.075L4.9 13.13a5.99 5.99 0 0 0 1.664.69l.451 1.8A.5.5 0 0 0 7.5 16h1a.5.5 0 0 0 .485-.379l.451-1.8a5.99 5.99 0 0 0 1.664-.69l1.593.956a.5.5 0 0 0 .611-.075l.707-.707a.5.5 0 0 0 .075-.611L13.13 11.1a5.99 5.99 0 0 0 .69-1.664l1.8-.451A.5.5 0 0 0 16 8.5v-1a.5.5 0 0 0-.379-.485ZM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z' />
            </svg>
          </div>
          <span>{channel?.name}</span>
        </div>
        <div className='flex flex-col flex-grow h-0 p-4 overflow-auto'>
          {data?.reverse()?.map(message => (
            <DisplayMessage
              createdAt={message.createdAt?.toString() as string}
              senderId={message.sender?.id?.toString() as string}
              senderName={message.sender?.name?.toString() as string}
              content={message.content?.toString() as string}
            />
          ))}
        </div>
        <form className='bg-gray-300 p-4 flex' name='sendMessageForm' onSubmit={handleSubmit(sendMessage)}>
          <textarea 
            className='flex items-center h-20 w-full rounded px-3 text-sm' 
            rows={4} 
            placeholder='Type your message…' 
            {...register('message')} />
          <button 
            type='submit' 
            className='sendMessageButton w-50 h-20 transition duration-75 ml-6 mr-6 hover:bg-gray-400 bg-gray-200 pl-5 pr-5 rounded-lg'>
            Send Message
          </button>
        </form>
      </div>
    </main>
  )
}

ChannelMessage.getLayout = function getLayout(page: ReactElement) {
  return (
    <main>
      <Sidebar>{page}</Sidebar>
    </main>
  )
}

export async function getServerSideProps(context: { params: { channel_id: number; channel: Channel } }) {
  const channelId = context?.params?.channel_id
  return {
    props: {
      channelId
    }
  }
}
