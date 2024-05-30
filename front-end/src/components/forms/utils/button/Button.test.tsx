import { render } from "@testing-library/react"
import Button from "."

describe('Button', () => {
    const props = {
        text: 'testing-text'
    }

    const getClassesAndUnmount = (dark: boolean) => {
        const { unmount, getByText } = render(<Button {...props} dark={dark}/>)
        const classes = getByText(props.text).classList
        unmount()
        return classes
    }

    it('should render with text', () => {
        const { getByText } = render(<Button {...props}/>)
        expect(getByText(props.text)).toBeTruthy()
    })

    it('should respond to clicks', () => {
        const callback = jest.fn()
        const { getByText } = render(<Button {...props} onClickHandler={callback}/>)
        getByText(props.text).click()
        expect(callback).toHaveBeenCalled()
    })

    it('should not be clickable when disabled', () => {
        const callback = jest.fn()
        const { getByText } = render(<Button {...props} onClickHandler={callback} disabled/>)
        getByText(props.text).click()
        expect(callback).not.toHaveBeenCalled()
    })

    it('should not be clickable when loading', () => {
        const callback = jest.fn()
        const { getByRole } = render(<Button {...props} onClickHandler={callback} loading/>)
        getByRole('button').click()
        expect(callback).not.toHaveBeenCalled()
    })

    it('should not display text when loading', () => {
        const { queryByText } = render(<Button {...props} loading/>)
        expect(queryByText(props.text)).toBeNull()
    })

    it('should be styled differently when dark', () => {
        const classLists = [
            getClassesAndUnmount(true),
            getClassesAndUnmount(false)
        ]

        expect(classLists[0]).not.toStrictEqual(classLists[1])
    })
})