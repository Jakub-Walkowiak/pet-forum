import showNotificationPopup from '../show-notification-popup'

export async function* getPetTypes(query?: string) {
  let offset = 0
  const getFetchUrl = (offset: number) => {
    return query === undefined
      ? `http://localhost:3000/pets/types?limit=10&offset=${offset}`
      : `http://localhost:3000/pets/types?limit=10&offset=${offset}&nameQuery=${query}`
  }

  while (true) {
    try {
      const response = await fetch(getFetchUrl(offset))
      if (response.ok) {
        const result = await response.json()

        if (result.length !== 0) {
          yield result
          offset += 10
        } else yield undefined
      } else yield undefined
    } catch (err) {
      showNotificationPopup(false, 'Error contacting server')
    }
  }
}
