import { render } from '@testing-library/react'
import PetLabel from '.'

describe('Pet label', () => {
  const props = {
    text: 'testing-text',
    id: 0,
  }

  const getClassesAndUnmount = (size: 'normal' | 'large' | 'extra_large') => {
    const { unmount, getByText } = render(<PetLabel {...props} size={size} />)
    const classes = getByText(`${props.text}`).classList
    unmount()
    return classes
  }

  it('should display text', () => {
    const text = 'sample-text'
    const { getByText } = render(<PetLabel {...props} text={text} />)

    expect(getByText(`${text}`)).toBeTruthy()
  })

  it('should respect size prop', () => {
    const classLists = [
      getClassesAndUnmount('normal'),
      getClassesAndUnmount('large'),
      getClassesAndUnmount('extra_large'),
    ]

    expect(classLists[0]).not.toStrictEqual(classLists[1])
    expect(classLists[0]).not.toStrictEqual(classLists[2])
    expect(classLists[1]).not.toStrictEqual(classLists[2])
  })
})
