export default function rescindOwnership(pet: number) {
  return fetch(`http://localhost:3000/pets/${pet}/owners/rescind`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
  })
}
