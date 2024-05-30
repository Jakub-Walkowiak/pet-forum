import { PetSex } from '@/helpers/fetch-options/pet-fetch-options'
import getPetSexName from '@/helpers/get-pet-sex-name'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import Select from '../select'

interface PetSexSelectProps<T extends FieldValues> {
  register?: UseFormRegister<T>
  name?: Path<T>
  def?: PetSex
}

export default function PetSexSelect<T extends FieldValues>({ register, name, def }: PetSexSelectProps<T>) {
  const options = [PetSex.MALE, PetSex.FEMALE, PetSex.NOT_APPLICABLE]

  return (
    <Select
      register={register}
      name={name}
      def={def}
      options={new Map(options.map((option) => [option, getPetSexName(option)]))}
    />
  )
}
