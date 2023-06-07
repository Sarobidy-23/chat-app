'use server'
import useSWR from 'swr'
import { Configuration } from '../client/configuration'
import { ChannelApi, UserApi } from '../client/api'
import { getCookie } from 'cookies-next'

export function useChannel () {
    const getAll = async (arg: any) => {
        const conf = new Configuration()
        conf.accessToken = getCookie("chat-token")?.toString()
        const client = new ChannelApi(conf)
        return client.getAll()
            .then((response) => response.data?.channels)
            .catch((error) => error?.response?.data?.message)
    }
    const { data, error, isLoading, mutate } = useSWR("channelList", getAll, { revalidateIfStale: true, refreshWhenHidden: false })
    return {
        channelList: data,
        error,
        isLoading,
        mutate
    }
}
