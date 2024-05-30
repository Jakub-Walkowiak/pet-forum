import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import LabeledCheckbox from "."

describe('Labeled checkbox', () => {
    const props = {
        text: 'testing-text',
        value: 1
    }

    it('should be labeled with text', () => {
        const { getByLabelText } = render(<LabeledCheckbox {...props}/>)
        expect(getByLabelText(props.text)).toBeTruthy()
    })

    it('should start checked if createChecked is true', () => {
        const { getByLabelText } = render(<LabeledCheckbox {...props} createChecked/>)
        expect((getByLabelText(props.text) as HTMLInputElement).checked).toBeTruthy()
    })

    it('should fire check and uncheck callbacks', () => {
        const check = jest.fn()
        const uncheck = jest.fn()

        const { getByLabelText } = render(<LabeledCheckbox {...props} checkHandler={check} uncheckHandler={uncheck}/>)
        act(() => getByLabelText(props.text).click()) 
        act(() => getByLabelText(props.text).click()) 

        expect(check).toHaveBeenCalled()
        expect(uncheck).toHaveBeenCalled()
    })
})