import LabeledCheckbox from "@/components/form-utils/labeled-checkbox";
import useTag from "@/hooks/use-tag";

interface TagCheckboxProps {
    tagId: number,
    advice?: boolean,
    checkHandler?: (value: number) => void,
    uncheckHandler?: (value: number) => void,
    createChecked?: boolean,
}

export default function TagCheckbox({ tagId , advice = false, checkHandler, uncheckHandler, createChecked = false }: TagCheckboxProps) {
    const tagInfo = useTag(tagId, advice) 

    if (tagInfo !== undefined) return <LabeledCheckbox createChecked={createChecked} text={tagInfo.tagName} value={tagId} postfix={`${tagInfo.timesUsed}`} checkHandler={checkHandler} uncheckHandler={uncheckHandler}/>
}