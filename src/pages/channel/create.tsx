import { ChannelApi, Configuration, CreateChannel, User } from '@/client'
import InputField from '@/components/InputField'
import Sidebar from '@/components/Sidebar'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { ReactElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import Select from 'react-select'
import { useUser } from '@/hooks/useUser'
import { toast } from 'react-toastify'
import { useChannel } from '@/hooks/useChannel'
import { getCookie } from 'cookies-next'

const schema = yup.object({
  name: yup.string().required(),
  type: yup.string().oneOf(["public", "private"]),
  members: yup.array().of(yup.number())
})

export default function Create() {
  const {mutate} = useChannel()
  const form = useForm<CreateChannel>({
    mode:'all',
    resolver: yupResolver(schema),
    defaultValues:{members:[]}
  })
  const { register, handleSubmit, formState:{ errors }, watch, setValue } = form

  const { userList } = useUser()

  const create = (data: CreateChannel) => {
    const config = new Configuration();
    config.accessToken = getCookie('chat-token')?.toString()
    const client = new ChannelApi(config);
    client
      .createChannel(data)
      .then((response) => {
        toast("create success")
        mutate()
      })
      .catch((error) => {
        toast(error?.response?.data?.message ?? "try again!")  
      });
  }

  useEffect(()=>{
    if(watch('members')?.length){
      setValue('members',[],{ shouldValidate: true, shouldDirty: true, shouldTouch: true})
    }
  },[watch('type')])

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create your own channel
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form name="createChannelForm" onSubmit={handleSubmit(create)}>
          <InputField type="text" 
              id="name" 
              label="Name" 
              complementProps={{...register("name")}} 
              error={errors.name?.message}/>
          <div className='mt-6'>
            <label htmlFor="channelType" className="block text-sm font-medium leading-6 text-gray-900">Type</label>
            <select id="channelType" className="cursor-pointer mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400  dark:focus:ring-blue-500"
               {...register('type')}>
              <option selected value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          {watch('type') == 'private' &&
            <div className='mt-6'>
              <label htmlFor="channelType" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Members</label>
              <Select id="channelType"
                closeMenuOnSelect={false}
                {...register('members')}
                onChange={(e)=>setValue('members', e.map((elt:any)=>elt.value),{shouldValidate:true, shouldDirty: true, shouldTouch: true})}
                isMulti
                options={userList?.map((user: User)=>{return {value:user.id, label: user.name}})}
              />
            </div>
          }
          <div className="mt-6">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

Create.getLayout = function getLayout(page: ReactElement) {
    return(
        <main>
            <Sidebar>
                {page}
            </Sidebar>
        </main>
    )
}