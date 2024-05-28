import AccountForm from '@/components/account/account-form'
import { FormMode } from '@/components/account/account-form/form-mode'
import showModal from '@/helpers/show-modal'
import { AiOutlineLogin } from 'react-icons/ai'

export default function LoggedOut() {
    return (
        <div className='flex flex-col gap-2 p-2 rounded-lg grow-x m-2'>
            <AiOutlineLogin onClick={() => showModal(<AccountForm openAs={FormMode.Login}/>)} className='text-4xl duration-200 hover:opacity-70 cursor-pointer'/>
        </div>
    )
}