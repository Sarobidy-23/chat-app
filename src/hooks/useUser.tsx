'use server'
import useSWR from 'swr'
import { UserApi, Configuration } from '@/client'
import { getCookie } from 'cookies-next'

export function useUser() {
  const getAllUser = async (arg: any) => {
    const currentUserId = getCookie('chat-user-id')
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new UserApi(conf)
    return client.getAllUser().then(response => response.data?.users?.filter(user => user.id != currentUserId))
  }
  const { data, error, isLoading, mutate } = useSWR('userList', getAllUser, { revalidateIfStale: true, refreshWhenHidden: false, refreshInterval: 10000 })
  return {
    userList: data,
    error,
    isLoading,
    mutate
  }
}
