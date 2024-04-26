'use client'

import useTag from '@/hooks/use-tag'
import LabeledCheckbox from '../../utils/labeled-checkbox'

interface TagCheckboxProps {
    tagId: number,
    checkHandler?: (value: number) => void,
    uncheckHandler?: (value: number) => void,
    createChecked?: boolean,
}

export default function TagCheckbox({ tagId,  checkHandler, uncheckHandler, createChecked = false }: TagCheckboxProps) {
    const tagInfo = useTag(tagId) 

    if (tagInfo !== undefined) return <LabeledCheckbox createChecked={createChecked} text={tagInfo.tagName} value={tagId} postfix={`${tagInfo.timesUsed}`} checkHandler={checkHandler} uncheckHandler={uncheckHandler}/>
}