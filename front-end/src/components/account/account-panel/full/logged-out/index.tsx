import AccountForm from '@/components/account/account-form'
import { FormMode } from '@/components/account/account-form/form-mode'
import Button from '@/components/forms/utils/button'
import showModal from '@/helpers/show-modal'

export default function LoggedOut() {
    return (
        <div className='flex flex-col gap-2 p-2 rounded-lg grow-x m-2'>
            <Button text='Log in' onClickHandler={() => showModal(<AccountForm openAs={FormMode.Register}/>)}/>
            <Button dark text='Register' onClickHandler={() => showModal(<AccountForm openAs={FormMode.Login}/>)}/>
        </div>
    )
}