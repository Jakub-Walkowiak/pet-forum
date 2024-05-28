import PetFetchOptions from '@/helpers/fetch-options/pet-fetch-options'
import getPets from '@/helpers/infinite-scroll-generators/get-pets'
import DynamicFeed from '..'
import PetPanel from '../../pet/pet-panel'

interface PetFeedProps {
    options?: PetFetchOptions,
    allowRescindButton?: boolean,
}

export default function PetFeed({ options, allowRescindButton = false }: PetFeedProps) {
    return <DynamicFeed generator={getPets} generatorOptions={options} mapper={id => (
        <li key={id}><PetPanel id={id} allowRescindButton={allowRescindButton}/></li>
    )}/>
}