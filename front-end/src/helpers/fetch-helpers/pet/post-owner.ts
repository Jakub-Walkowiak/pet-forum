export default function postOwner(account: number, pet: number) {
    return fetch(`http://localhost:3000/pets/${pet}/owners`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: account }),
        credentials: 'include',
    })
}