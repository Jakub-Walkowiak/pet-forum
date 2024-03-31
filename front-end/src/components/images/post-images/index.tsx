import { useState } from "react";
import PostImageMain from "./post-image-main";
import PostImageSmall from "./post-image-small";

interface PostImagesProps {
    imageIds: Array<number>,
}

export default function PostImages({ imageIds }: PostImagesProps) {
    const [selected, setSelected] = useState(imageIds[0])

    return (
        <div className="w-full flex flex-col gap-3 max-w-xl mb-3">
            <PostImageMain imageId={selected}/>
            {imageIds.length > 1 && <ul className="flex gap-3 list-none overflow-x-auto h-20 p-2 bg-gray-800 rounded-lg border border-zinc-700">
                {imageIds.map(id => (
                    <li onClick={() => setSelected(id)} className={`flex-none relative duration-200 block w-24 cursor-pointer ${selected !== id && 'opacity-60 hover:opacity-100'}`} key={id}><PostImageSmall imageId={id}/></li>
                ))}
            </ul>}
        </div>
    )
}