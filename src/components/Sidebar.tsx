import React, { PropsWithChildren, useEffect, useState } from 'react'
import Accordion from './Accordion'
import { useChannel } from '@/hooks/useChannel'
import { Channel, User } from '@/client'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'
import { deleteCookie } from 'cookies-next'
import { toast } from 'react-toastify'
import Image from 'next/image'

export default function Sidebar(props: PropsWithChildren) {
  const { children } = props
  const { channelList } = useChannel()
  const { userList } = useUser()
  const router = useRouter()

  const logout = () => {
    deleteCookie('chat-token', { sameSite: 'lax' })
    deleteCookie('chat-user-id', { sameSite: 'lax' })
    toast('logout success')
    router.push('/login')
  }

  return (
    <div>
      <aside
        id='default-sidebar'
        className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
          <ul className='font-medium'>
            <li>
              <section
                className='cursor-pointer flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => router.push('/profile')}
              >
                <span className='flex items-center justify-center w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500'>
                  <img src='/User.svg' className='w-6 h-6  transition duration-75 ' alt='' />
                </span>
                <span className='flex-1 ml-3 whitespace-nowrap'>Profile</span>
              </section>
            </li>
            <li>
              <Accordion
                clickable={
                  <section className='flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                    <img src='/Inbox.svg' className='w-6 h-6  transition duration-75 ' alt='' />
                    <span className='flex-1 ml-3 whitespace-nowrap'>Channel</span>
                  </section>
                }
                details={
                  <>
                    {channelList?.map((elt: Channel) => (
                      <div
                        className='cursor-pointer dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                        key={elt?.id}
                        onClick={() => {
                          router.push(`/channel/${elt?.id}`)
                        }}
                      >
                        # {elt?.name}
                      </div>
                    ))}
                    <div
                      className='cursor-pointer dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                      onClick={() => {
                        router.push(`/channel/create`)
                      }}
                    >
                      + Create channel
                    </div>
                  </>
                }
              />
            </li>
            <li>
              <Accordion
                clickable={
                  <section className='flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'>
                    <img src='/User.svg' className='w-6 h-6  transition duration-75 ' alt='' />
                    <span className='flex-1 ml-3 whitespace-nowrap'>Users</span>
                  </section>
                }
                details={
                  <>
                    {userList?.map((elt: User) => (
                      <div
                        className='cursor-pointer dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                        key={elt?.id}
                        onClick={() => {
                          router.push(`/message/${elt?.id}`)
                        }}
                      >
                        # {elt?.name}
                      </div>
                    ))}
                  </>
                }
              />
            </li>
            <li>
              <section
                className='cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => logout()}
              >
                <button className='logoutButton flex'>
                  <img src='/Logout.svg' className='w-6 h-6  transition duration-75 ' alt='' />
                  <span className='flex-1 ml-3 whitespace-nowrap'>Logout</span>
                </button>
              </section>
            </li>
          </ul>
        </div>
      </aside>
      <div className='pl-4 pr-4 sm:ml-64 max-h-screen relative'>{children}</div>
    </div>
  )
}
