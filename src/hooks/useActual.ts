'use server'
import useSWR from 'swr'
import { Configuration } from '../client/configuration'
import { UserApi } from '@/client'
import { getCookie } from 'cookies-next'

export function useActual() {
  const getActual = async (arg: any) => {
    const conf = new Configuration()
    conf.accessToken = getCookie('chat-token')?.toString()
    const client = new UserApi(conf)
    return client.getCurrent().then(response => response.data.user)
  }
  const { data, error, isLoading, mutate } = useSWR('actual', getActual, { revalidateIfStale: true, refreshWhenHidden: false })
  return {
    currentUser: data,
    error,
    isLoading,
    mutate
  }
}
