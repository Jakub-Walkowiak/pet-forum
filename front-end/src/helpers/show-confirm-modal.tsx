import ConfirmBox from "@/components/forms/confirm-box"
import showModal from "./show-modal"

export default async function showConfirmModal(text: string, confirmText?: string) {
    const onDecision = (confirmed: boolean) => document.dispatchEvent(new CustomEvent('confirmModalDecided', { detail: confirmed }))
    showModal(<ConfirmBox text={text} confirmText={confirmText} onDecision={onDecision}/>)
    return await new Promise(resolve => document.addEventListener('confirmModalDecided', ((e) => resolve(e.detail))))
}