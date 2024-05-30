import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import FormImage from '.'

describe('Form image', () => {
  const props = {
    src: '/',
    remove: () => {},
  }

  it('should display an image', () => {
    const { getByAltText } = render(<FormImage {...props} />)
    expect(getByAltText('Uploaded image')).toBeTruthy()
  })

  it('should go fullscreen when clicked', () => {
    const { getByAltText } = render(<FormImage {...props} />)
    act(() => getByAltText('Uploaded image').click())
    expect(getByAltText('Fullscreen image')).toBeTruthy()
  })
})
