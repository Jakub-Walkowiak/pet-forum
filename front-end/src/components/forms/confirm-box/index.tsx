import CloseModalButton from '@/components/utils/close-modal-button'
import dismissModal from '@/helpers/dismiss-modal'
import Button from '../utils/button'

interface ConfirmBoxProps {
  text: string
  confirmText?: string
  onDecision: (confirmed: boolean) => void
}

export default function ConfirmBox({ text, onDecision, confirmText }: ConfirmBoxProps) {
  const handleConfirm = () => {
    dismissModal()
    onDecision(true)
  }

  const handleCancel = () => {
    dismissModal()
    onDecision(false)
  }

  return (
    <div className='flex flex-col justify-between fixed inset-0 m-auto w-96 h-fit z-20 bg-gray-900 rounded-lg p-4'>
      <CloseModalButton />
      <span className='text-xl text-center py-12 whitespace-pre-wrap'>{text}</span>
      <div className='flex gap-4 w-full'>
        <div className='flex-1'>
          <Button className='w-full' text={confirmText ? confirmText : 'Confirm'} onClickHandler={handleConfirm} />
        </div>
        <div className='flex-1'>
          <Button className='w-full' text='Cancel' onClickHandler={handleCancel} dark />
        </div>
      </div>
    </div>
  )
}
