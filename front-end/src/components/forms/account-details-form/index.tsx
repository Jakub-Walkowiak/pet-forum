'use client'

import patchDetails, {
  PatchDetailsInputs,
  PatchDetailsInputsValidator,
} from '@/helpers/fetch-helpers/account/patch-details'
import showNotificationPopup from '@/helpers/show-notification-popup'
import useAuth from '@/hooks/use-auth'
import useEmail from '@/hooks/use-email'
import useProfile from '@/hooks/use-profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../utils/button'
import ErrorContainer from '../utils/error-container'
import Input from '../utils/input'

export default function AccountDetailsForm() {
  const auth = useAuth()
  const data = useProfile(auth)
  const email = useEmail()

  const [loading, setLoading] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<PatchDetailsInputs>({
    resolver: zodResolver(PatchDetailsInputsValidator),
  })

  const onSubmit = async (data: PatchDetailsInputs) => {
    setLoading(true)

    try {
      const response = await patchDetails(data)

      if (response.status === 409) {
        const body = await response.json()

        if (body.emailDupe) setError('email', { message: 'Account with e-mail already exists' })
        if (body.accountNameDupe) setError('accountName', { message: 'Account name already in use' })
      } else if (response.ok) {
        showNotificationPopup(true, 'Changes saved')
        document.dispatchEvent(new CustomEvent('refreshprofile'))
      } else showNotificationPopup(false, 'Encountered server error')
    } catch (err) {
      showNotificationPopup(false, 'Error contacting server')
    } finally {
      setLoading(false)
    }
  }

  const isError = () => errors.accountName !== undefined || errors.email !== undefined

  return (
    <form className='flex flex-col gap-4 py-4 w-fit' onSubmit={handleSubmit(async (data) => await onSubmit(data))}>
      <p className='text-2xl font-semibold'>Edit details</p>

      <label className='w-fit'>
        <span className='text-lg pe-2'>E-mail: </span>
        <Input placeholder={email ? email : "Couldn't fetch current email"} register={register} name='email' />
      </label>

      <label className='w-fit'>
        <span className='text-lg pe-2'>Account name: </span>
        <Input
          placeholder={data?.accountName ? data.accountName : "Couldn't fetch current account name"}
          register={register}
          name='accountName'
        />
      </label>

      <ErrorContainer>
        {errors.accountName && <p>{errors.accountName.message}</p>}
        {errors.email && <p>{errors.email.message}</p>}
      </ErrorContainer>

      <div className='w-fit'>
        <Button text={'Save changes'} loading={loading} disabled={isError()} />
      </div>
    </form>
  )
}
