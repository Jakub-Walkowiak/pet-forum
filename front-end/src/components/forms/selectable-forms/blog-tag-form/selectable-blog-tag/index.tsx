'use client'

import useTag from '@/hooks/use-tag'
import LabeledCheckbox from '../../../utils/labeled-checkbox'

interface SelectableBlogTagProps {
    tagId: number,
    checkHandler?: (value: number) => void,
    uncheckHandler?: (value: number) => void,
    createChecked?: boolean,
}

export default function SelectableBlogTag({ tagId,  checkHandler, uncheckHandler, createChecked = false }: SelectableBlogTagProps) {
    const tagInfo = useTag(tagId) 

    if (tagInfo !== undefined) 
        return <LabeledCheckbox createChecked={createChecked} text={tagInfo.tagName} value={tagId} postfix={`${tagInfo.timesUsed}`} checkHandler={checkHandler} uncheckHandler={uncheckHandler}/>
}