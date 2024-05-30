import { render } from '@testing-library/react'
import ValueAndText from '.'

describe('Value and text', () => {
  const props = {
    value: 0,
    text: 'testing-text',
  }

  it('should display value and text', () => {
    const { getByText } = render(<ValueAndText {...props} />)
    expect(getByText(props.text)).toBeTruthy()
    expect(getByText(props.value)).toBeTruthy()
  })

  it('should call passed callback on click', () => {
    const callback = jest.fn()
    const { getByText } = render(<ValueAndText {...props} onClick={callback} />)
    getByText(props.text).click()
    expect(callback).toHaveBeenCalled()
  })
})
