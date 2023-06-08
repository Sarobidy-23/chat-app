import { getCookie } from 'cookies-next'
import React, { ReactElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { UserApi, Configuration } from '@/client'
import { useActual } from '@/hooks/useActual'
import InputField from '@/components/InputField'
import { toast } from 'react-toastify'
import Sidebar from '@/components/Sidebar'
import Accordion from '@/components/Accordion'

const schema = yup.object({
  name: yup.string().required(),
  currentPassword: yup.string(),
  newPassword: yup.string(),
  confirmPassword: yup.string().oneOf([yup.ref('currentPassword')], 'confirmPassword is equal currentPassword'),
  email: yup.string(),
  bio: yup.string().optional()
})

type FormData = yup.InferType<typeof schema>;

export default function Profile() {
  const form = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = form

  const { currentUser } = useActual()

  const update = async (data: FormData) => {
    const config = new Configuration()
    config.accessToken = getCookie('chat-token')?.toString()
    const client = new UserApi(config)
    client
      .update(data)
      .then(() => toast('update success'))
      .catch(error => toast(error?.response?.data?.message ?? 'try again!'))
  }

  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser?.name as string, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
      setValue('bio', currentUser?.bio, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })
    }
  }, [currentUser])

  return (
    <div>
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Your user profile</h2>
        </div>
        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form name='editProfileForm' onSubmit={handleSubmit(update)}>
            <InputField 
                type='name' 
                id='name' 
                label='Name' 
                complementProps={{ ...register('name') }} 
                value={watch('name')} 
                error={errors.name?.message} />
            <div className='mt-6'>
              <InputField 
                id='email' 
                type='email' 
                label='Email'
                {...register('email')}
                disable
                value={currentUser?.email as string} />
            </div>
            <div className='mt-6'>
              <label htmlFor='bio' className='block text-sm font-medium leading-6 text-gray-900'>
                Bio
              </label>
              <textarea
                id='bio'
                rows={4}
                className='p-2  block w-full rounded-md py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2'
                placeholder='Brief description of you...'
                {...register('bio')}
                value={watch('bio')}
              />
            </div>
            <Accordion
              clickable={
                <div className='mt-6 flex space-x-60'>
                  <h3>Edit password</h3>
                  <img src='/ArrowDown.svg' />
                </div>
              }
              details={
                <>
                  <div className='mt-6'>
                    <InputField 
                        id='currentPassword' 
                        type='password' 
                        label='currentPassword' 
                        complementProps={{ ...register('currentPassword') }} 
                        error={errors.currentPassword?.message}  />
                  </div>
                  <div className='mt-6'>
                    <InputField 
                        id='newPassword' 
                        type='password'
                        label='newPassword' 
                        complementProps={{ ...register('newPassword') }} 
                        error={errors.newPassword?.message} />
                  </div>
                  <div className='mt-6'>
                    <InputField
                      id='confirmPassword'
                      type='password'
                      label='ConfirmPassword'
                      complementProps={{ ...register('confirmPassword') }}
                      error={errors.confirmPassword?.message}
                    />
                  </div>
                </>
              }
            />
            <div className='mt-6'>
              <button
                type='submit'
                className='updateProfileButton flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
               Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <main>
      <Sidebar>{page}</Sidebar>
    </main>
  )
}
