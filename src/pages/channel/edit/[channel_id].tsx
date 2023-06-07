import { ChannelApi, Configuration, User } from '@/client'
import Sidebar from '@/components/Sidebar'
import { useUser } from '@/hooks/useUser'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCookie } from 'cookies-next'
import React, { ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'
import * as yup from 'yup'

interface Props {
    channelId: number
}

interface MembersToAdd {
    members: number[]
}

const schema = yup.object({
    members: yup.array().of(yup.number()).required()
  })

export default function EditChannel(props: Props) {
    const { channelId } = props
    const { userList } = useUser()
    const form = useForm<MembersToAdd>({
        mode:'all',
        resolver: yupResolver(schema)
      })
    const addMembers = async (data: MembersToAdd) => {
        const conf = new Configuration()
        conf.accessToken = getCookie("chat-token")?.toString()
        const client = new ChannelApi(conf)
        return client
            .addMember(channelId, {members: data.members})
            .then((response) => toast("add members success"))
    }
    const { register, handleSubmit, formState:{ errors }, watch, setValue } = form
    
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your own channel
        </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form name="editChannelForm" onSubmit={handleSubmit(addMembers)} >
                <div className='mt-6'>
                <label htmlFor="channelType" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Members</label>
                <Select id="channelType"
                    closeMenuOnSelect={false}
                    {...register('members')}
                    onChange={(e)=> setValue('members', e.map((elt:any)=>elt.value),{shouldValidate:true, shouldDirty: true, shouldTouch: true})}
                    isMulti
                    options={userList?.map((user: User)=>{return {value:user.id, label: user.name}})}
                />
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Add members
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

EditChannel.getLayout = function getLayout(page: ReactElement) {
    return(
        <main>
            <Sidebar>
                {page}
            </Sidebar>
        </main>
    )
}

export async function getServerSideProps(context:{params:{channel_id: number}}) {
    const channelId = context?.params?.channel_id
    return {
        props: {
            channelId
        }
    }
}