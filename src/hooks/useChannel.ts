'use server'
import useSWR from 'swr'
import { ChannelApi, Configuration } from '@/client'
import { getCookie } from 'cookies-next'

export function useChannel() {
  const getAll = async (arg: any) => {
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new ChannelApi(conf)
    return client.getAll().then(response => response.data?.channels)
  }
  const { data, error, isLoading, mutate } = useSWR('channelList', getAll, { revalidateIfStale: true, refreshWhenHidden: false, refreshInterval: 3000 })
  return {
    channelList: data,
    error,
    isLoading,
    mutate
  }
}
