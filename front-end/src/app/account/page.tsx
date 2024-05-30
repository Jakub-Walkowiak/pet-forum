import AccountDetailsForm from '@/components/forms/account-details-form'
import ChangePasswordForm from '@/components/forms/change-password-form'

export default function Page() {
  return (
    <>
      <div className='w-full h-14 flex items-center border-b border-zinc-700 py-10 px-10 text-3xl font-semibold'>
        Account management
      </div>
      <div className='flex flex-col p-4 w-full'>
        <AccountDetailsForm />
        <ChangePasswordForm />
      </div>
    </>
  )
}
