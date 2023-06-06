import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { UpdateUser, UserApi } from '../../client/api';
import { useActual } from '../../hooks/useActual';
import InputField from '../../components/InputField';
import { Configuration } from '../../client/configuration';
import { toast } from 'react-toastify';

const schema = yup.object({
    name: yup.string().required(),
    oldPassword: yup.string(),
    password: yup.string(),
    confirmPassword: yup.string().oneOf([yup.ref("password")], 'confirmPassword is equal password'),
    bio: yup.string().optional()
})

export default function index() {
    const form = useForm<UpdateUser & { confirmPassword: string}>({
        mode:'all',
        resolver: yupResolver(schema)
    })

    const { register, handleSubmit, formState:{ errors }, watch, setValue } = form

    const { data } = useActual()

    const login = async(data: UpdateUser) => {
        console.log(data)
        const config = new Configuration();
        config.accessToken = getCookie('chat-token')?.toString()
        const client = new UserApi(config);
        client
          .update(data)
          .then((response) => {
            toast("update success")
          })
          .catch((error) => {
            toast(error?.response?.data?.message ?? "try again!")  
          });
    }
    const [expanded, setExpanded] = useState(false)
    const toggleExpanded = () => setExpanded((current) => !current)
    useEffect(()=> {
        if(data){
            setValue("name", data?.name,{
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
            setValue("bio", data?.bio,{
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        }
    },[data])

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Your user profile
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form name="editProfileForm" onSubmit={handleSubmit(login)}>
            <InputField type="name" 
                id="name" 
                label="Name" 
                complementProps={{...register("name")}} 
                value={watch('name')}
                error={errors.name?.message}/>
            <div className="mt-6">
                <InputField type="email" 
                    id="email" 
                    label="Email"
                    disable={true}
                    value={data?.email as string}/>
            </div>
            <div className='mt-6'>         
                <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">Bio</label>
                <textarea id="bio" rows={4} className="p-2  block w-full rounded-md py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2" placeholder="Brief description of you..."
                    {...register('bio')}/>
            </div>
            <div>
                <div className="accordion-header cursor-pointer transition flex space-x-5 px-5 items-center h-16 select-none" onClick={toggleExpanded}>
                    <h3>Edit password</h3>
                    <svg data-accordion-icon className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </div>
                <div className={`px-5 pt-0 overflow-hidden transition ${expanded ? "max-h-fit" : "max-h-0"}`}>
                    <div className="mt-6">
                        <InputField type="password" 
                            id="oldPassword" 
                            label="OldPassword"
                            complementProps={{...register("oldPassword")}}/>
                    </div>
                    <div className="mt-6">
                        <InputField type="password" 
                            id="password" 
                            label="Password" 
                            complementProps={{...register("password")}} 
                            error={errors.password?.message}/>
                    </div>
                    <div className="mt-6">
                        <InputField type="password" 
                            id="confirmPassword" 
                            label="ConfirmPassword" 
                            complementProps={{...register("confirmPassword")}} 
                            error={errors.confirmPassword?.message}/>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                     Update information
                </button>
            </div>
            </form>
        </div>
    </div>
    </div>
  )
}
