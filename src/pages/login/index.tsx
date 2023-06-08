import React from 'react'
import InputField from '@/components/InputField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { LoginInfo, UserApi, Configuration } from '@/client'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import { toast } from 'react-toastify'
import Link from 'next/link'

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  bio: yup.string().optional()
})

const Login = () => {
  const form = useForm<LoginInfo>({
    mode: 'all',
    resolver: yupResolver(schema)
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form

  const router = useRouter()

  const login = async (data: LoginInfo) => {
    const config = new Configuration()
    const client = new UserApi(config)
    client
      .login(data)
      .then(response => {
        toast('login success')
        setCookie('chat-token', response.data.user?.token, { sameSite: 'lax' })
        setCookie('chat-user-id', response.data.user?.id, { sameSite: 'lax' })
        router.push('/profile')
      })
      .catch(error => {
        toast(error?.response?.data?.message ?? 'try again!')
      })
  }

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Sign in to your account</h2>
      </div>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form name='loginForm' onSubmit={handleSubmit(login)}>
          <InputField 
            type='email' 
            id='email' 
            label='email' 
            complementProps={{ ...register('email') }} 
            error={errors.email?.message} />
          <div className='mt-6'>
            <InputField 
              type='password' 
              id='password' 
              label='Password' 
              complementProps={{ ...register('password') }} 
              error={errors.password?.message} />
          </div>
          <div className='mt-6'>
            <button
              type='submit'
              className='loginButton flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Login
            </button>
          </div>
        </form>
        <p className='mt-10 text-center text-sm text-gray-500'>
          You are new?
          <Link href='/sign-up' className='font-semibold leading-6 text-teal-600 hover:text-teal-500'>
            Register now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
