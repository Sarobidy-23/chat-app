import React from 'react'
import InputField from '@/components/InputField'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { CreateUser, UserApi, Configuration } from '@/client'
import { toast } from 'react-toastify'
import { setCookie } from 'cookies-next'

const schema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  bio: yup.string().optional(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'confirmPassword is equal password')
})

export default function SignUp() {
  const form = useForm<CreateUser & { confirmPassword: string }>({
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form

  const router = useRouter()

  const signUp = async (data: CreateUser) => {
    const config = new Configuration()
    const client = new UserApi(config)
    client
      .signup(data)
      .then(response => {
        toast('registration success')
        setCookie('chat-token', response.data.user?.token, { sameSite: 'lax' })
        setCookie('chat-user-id', response.data.user?.id, { sameSite: 'lax' })
        router.push('/profile')
      })
      .catch(error => toast(error?.response?.data?.message ?? 'try again!'))
  }

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Create your account</h2>
      </div>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form name='registrationForm' onSubmit={handleSubmit(signUp)}>
          <InputField type='name' id='name' label='Name' complementProps={{ ...register('name') }} error={errors.name?.message} />
          <div className='mt-6'>
            <InputField type='email' id='email' label='Email' complementProps={{ ...register('email') }} error={errors.email?.message} />
          </div>
          <div className='mt-6'>
            <InputField type='password' id='password' label='Password' complementProps={{ ...register('password') }} error={errors.password?.message} />
          </div>
          <div className='mt-6'>
            <InputField
              type='password'
              id='confirmPassword'
              label='ConfirmPassword'
              complementProps={{ ...register('confirmPassword') }}
              error={errors.confirmPassword?.message}
            />
          </div>
          <div className='mt-6'>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Sign up
            </button>
          </div>
        </form>
        <p className='mt-10 text-center text-sm text-gray-500'>
          You have account?
          <a href='/login' className='font-semibold leading-6 text-teal-600 hover:text-teal-500'>
            Login now
          </a>
        </p>
      </div>
    </div>
  )
}
