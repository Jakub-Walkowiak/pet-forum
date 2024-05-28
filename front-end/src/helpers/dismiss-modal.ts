export default function dismissModal() {
    document.dispatchEvent(new CustomEvent('modaldismiss'))
}