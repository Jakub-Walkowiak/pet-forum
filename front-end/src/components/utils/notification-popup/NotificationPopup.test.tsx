import { render } from "@testing-library/react"
import NotificationPopup from "."

describe('Notification popup', () => {
    const props = {
        text: 'testing-text'
    }

    const getClassesAndUnmount = (positive: boolean) => {
        const { unmount, getByText } = render(<NotificationPopup text={props.text} positive={positive}/>)
        const classes = getByText(`${props.text}`).classList
        unmount()
        return classes
    }

    it('should display text', () => {
        const { getByText } = render(<NotificationPopup {...props}/>)
        expect(getByText(props.text)).toBeTruthy()
    })

    it('should have different styles between positive and negative', () => {
        const classLists = [
            getClassesAndUnmount(true),
            getClassesAndUnmount(false)
        ]

        expect(classLists[0]).not.toStrictEqual(classLists[1])
    })
})