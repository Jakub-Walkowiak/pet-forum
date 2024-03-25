export default function BlurOverlay() {
    const stopEvent = (e: React.BaseSyntheticEvent) => e.stopPropagation()

    return <div onDragOver={stopEvent} onDragEnter={stopEvent} className='fixed top-0 right-0 w-screen h-screen backdrop-blur-sm z-10 bg-black/40'/>
}