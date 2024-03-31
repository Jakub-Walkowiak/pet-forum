import useTag from "@/hooks/use-tag";

interface TagLabelProps {
    tagId: number,
}

export default function TagLabel({ tagId }: TagLabelProps) {
    const data = useTag(tagId)

    if (data !== undefined) return <div className="rounded-full py-0.5 px-2 bg-emerald-900 text-emerald-200 text-sm">{data.tagName}</div>
    else return <div className="rounded-full py-0.5 px-2 bg-red-800 text-red-400">Tag not found</div>
}