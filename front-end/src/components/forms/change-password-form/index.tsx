'use client'

import patchPassword, {
  PatchPasswordInputsValidator,
  PatchPasswwordInputs,
} from '@/helpers/fetch-helpers/account/patch-password'
import showNotificationPopup from '@/helpers/show-notification-popup'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../utils/button'
import ErrorContainer from '../utils/error-container'
import Input from '../utils/input'

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<PatchPasswwordInputs>({
    resolver: zodResolver(PatchPasswordInputsValidator),
  })

  const onSubmit = async (data: PatchPasswwordInputs) => {
    setLoading(true)

    try {
      const response = await patchPassword(data)

      if (response.status === 403) setError('currentPassword', { message: 'Current password is incorrect' })
      else if (response.ok) showNotificationPopup(true, 'Password changed')
      else showNotificationPopup(false, 'Encountered server error')
    } catch (err) {
      showNotificationPopup(false, 'Error contacting server')
    } finally {
      setLoading(false)
    }
  }

  const isError = () =>
    errors.currentPassword !== undefined || errors.newPassword !== undefined || errors.repeatPassword !== undefined

  return (
    <form
      className='flex flex-col gap-4 py-4 flex-wrap w-fit'
      onSubmit={handleSubmit(async (data) => await onSubmit(data))}
    >
      <p className='text-2xl font-semibold mt-8'>Change password</p>

      <Input placeholder={'Current password'} register={register} name='currentPassword' password />
      <Input placeholder={'New password'} register={register} name='newPassword' password />
      <Input placeholder={'Repeat new password'} register={register} name='repeatPassword' password />

      <ErrorContainer>
        {errors.currentPassword !== undefined && <p>{errors.currentPassword.message}</p>}
        {errors.newPassword !== undefined && <p>{errors.newPassword.message}</p>}
        {errors.repeatPassword !== undefined && <p>{errors.repeatPassword.message}</p>}
      </ErrorContainer>

      <Button text={'Change password'} loading={loading} disabled={isError()} />
    </form>
  )
}
