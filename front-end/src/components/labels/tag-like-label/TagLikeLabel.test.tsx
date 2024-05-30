import { render } from "@testing-library/react"
import TagLikeLabel from "."

jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));

describe('Tag-like label', () => {
    const props = {
        text: 'testing-text',
        notFoundText: 'testing-not-found',
    }

    const getClassesAndUnmount = (size: 'small' | 'large') => {
        const { unmount, getByText } = render(<TagLikeLabel text={props.text} size={size}/>)
        const classes = getByText(`${props.text}`).classList
        unmount()
        return classes
    }

    it('should display text', () => {
        const { getByText } = render(<TagLikeLabel text={props.text}/>)
        expect(getByText(`${props.text}`)).toBeTruthy()
    })

    it('should display not found text if text is not provided', () => {
        const { getByText } = render(<TagLikeLabel notFoundText={props.notFoundText}/>)
        expect(getByText(`${props.notFoundText}`)).toBeTruthy()
    })

    it('should respect size prop', () => {
        const classLists = [
            getClassesAndUnmount('small'),
            getClassesAndUnmount('large'),
        ]

        expect(classLists[0]).not.toStrictEqual(classLists[1])
    })

    it('should call passed callback on click', () => {
        const callback = jest.fn()
        const { getByText } = render(<TagLikeLabel text={props.text} onClickReplacement={callback}/>)
        getByText(props.text).click()
        expect(callback).toHaveBeenCalled()
    })

    it('should not call callback if no text is passed', () => {
        const callback = jest.fn()
        const { getByText } = render(<TagLikeLabel notFoundText={props.notFoundText} onClickReplacement={callback}/>)
        getByText(props.notFoundText).click()
        expect(callback).not.toHaveBeenCalled()
    })
})