import dismissModal from "@/helpers/dismiss-modal"
import { AiOutlineClose } from "react-icons/ai"

export default function CloseModalButton() {
    return <AiOutlineClose className='text-xl self-end hover:cursor-pointer' onClick={dismissModal}/>
}