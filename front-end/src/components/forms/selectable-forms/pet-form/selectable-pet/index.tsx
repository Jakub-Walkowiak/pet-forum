'use client'

import usePet from '@/hooks/use-pet'
import LabeledCheckbox from '../../../utils/labeled-checkbox'

interface SelectablePetProps {
    petId: number,
    checkHandler?: (value: number) => void,
    uncheckHandler?: (value: number) => void,
    createChecked?: boolean,
}

export default function SelectablePet({ petId,  checkHandler, uncheckHandler, createChecked = false }: SelectablePetProps) {
    const petInfo = usePet(petId) 

    if (petInfo !== undefined) 
        return <LabeledCheckbox createChecked={createChecked} text={petInfo.name} value={petId} postfix={`${petInfo.featureCount}`} checkHandler={checkHandler} uncheckHandler={uncheckHandler}/>
}