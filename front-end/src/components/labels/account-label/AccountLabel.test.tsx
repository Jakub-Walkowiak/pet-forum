import { render } from "@testing-library/react"
import AccountLabel from "."

describe('Account label', () => {
    const props = {
        text: 'testing-text',
        id: 0,
    }

    const getClassesAndUnmount = (size: 'normal' | 'large' | 'extra_large', displayName = false) => {
        const { unmount, getByText } = render(<AccountLabel {...props} size={size} displayName={displayName}/>)
        const classes = getByText(`${displayName ? '' : '@'}${props.text}`).classList
        unmount()
        return classes
    }

    it('should display text with @', () => {
        const { getByText } = render(<AccountLabel {...props} text={props.text}/>)
        expect(getByText(`@${props.text}`)).toBeTruthy()
    })

    it('should display text without @ if set to display name', () => {
        const { getByText } = render(<AccountLabel {...props} text={props.text} displayName/>)
        expect(getByText(`${props.text}`)).toBeTruthy()
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

    it('should have different size if its a display name', () => {
        const classLists = [
            [getClassesAndUnmount('normal'), getClassesAndUnmount('normal', true)],
            [getClassesAndUnmount('large'), getClassesAndUnmount('large', true)],
            [getClassesAndUnmount('extra_large'), getClassesAndUnmount('extra_large', true)],
        ]

        classLists.forEach(([first, second]) => expect(first).not.toStrictEqual(second))
    })
})