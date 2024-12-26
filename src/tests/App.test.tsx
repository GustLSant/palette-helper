import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import App from '../App'

jest.mock('../assets/react.svg', () => 'test-file-stub');


describe('App page test', ()=>{

    test("Renders the main page", () => {
        const { getByText } = render(<App />);
        const text:HTMLElement = getByText(/Select Complementary Color/);
        expect(text).toBeInTheDocument();
    })

    test('Should show tradic button', ()=>{
        render(<App />);
        screen.getByText(/Select Next Triadic Color/);
    })


    test('Should increase hue shifting', ()=>{
        render(<App />);
        // document.getElementById()
    })

})

