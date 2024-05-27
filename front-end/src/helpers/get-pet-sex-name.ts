import { PetSex } from "./fetch-options/pet-fetch-options"

export default function getPetSexName(sex: PetSex) {
    switch (sex) {
        case PetSex.MALE: return 'Male'
        case PetSex.FEMALE: return 'Female'
        case PetSex.NOT_APPLICABLE: return 'N/A'
    }
}