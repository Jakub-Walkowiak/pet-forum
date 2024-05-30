import { render } from '@testing-library/react'
import BlurOverlay from '.'

describe('Blur overlay', () => {
  it('should be clickable', () => {
    const callback = jest.fn()
    const { getByTestId } = render(<BlurOverlay onClick={callback} />)
    getByTestId('blur-overlay').click()
    expect(callback).toHaveBeenCalled()
  })
})
