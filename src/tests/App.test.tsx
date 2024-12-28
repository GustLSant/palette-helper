import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import App from '../App'

jest.mock('../assets/react.svg', () => 'test-file-stub');


describe('App page test', ()=>{

    test("Should render the Main Page", () => {
        const { getByText } = render(<App />);
        const text:HTMLElement = getByText(/Select Complementary Color/);
        expect(text).toBeInTheDocument();
    })


    test('Should show Triadic button', ()=>{
        render(<App />);
        screen.getByText(/Select Next Triadic Color/);
    })


    test('Should change Color Count', ()=>{
        render(<App />);
        const buttonIncrease:HTMLButtonElement = screen.getByTestId('buttonIncreaseColorCount');
        const buttonDecrease:HTMLButtonElement = screen.getByTestId('buttonDecreaseColorCount');
        const divCurrentColors:HTMLDivElement = screen.getByTestId('divCurrentColors');
        const labelValueColorCount:HTMLParagraphElement = screen.getByTestId('labelValueColorCount');
        
        // default value
        expect(Number(labelValueColorCount.textContent)).toBe(5); 
        expect(divCurrentColors.children.length).toBe(5);

        fireEvent.click(buttonIncrease);
        expect(Number(labelValueColorCount.textContent)).toBe(6);
        expect(divCurrentColors.children.length).toBe(6);

        fireEvent.click(buttonDecrease);
        expect(Number(labelValueColorCount.textContent)).toBe(5);
        expect(divCurrentColors.children.length).toBe(5);

        fireEvent.click(buttonDecrease);
        expect(Number(labelValueColorCount.textContent)).toBe(4);
        expect(divCurrentColors.children.length).toBe(4);

        fireEvent.click(buttonIncrease);
        expect(Number(labelValueColorCount.textContent)).toBe(5);
        expect(divCurrentColors.children.length).toBe(5);
    })


    test('Should change Hue Shifting Value', ()=>{
        render(<App />);

        const slider = screen.getByTestId('sliderhue');
        const labelValue = screen.getByTestId('labelValuehue');
        const resetButton = screen.getByTestId('buttonResethue')

        // default value
        expect(Number(labelValue.textContent)).toBe(18);

        fireEvent.change(slider, { target: { value: 10 } });
        expect(Number(labelValue.textContent)).toBe(10);

        // reset to default value
        fireEvent.click(resetButton);
        expect(Number(labelValue.textContent)).toBe(18);
    })


    test('Should change Lightness Shifting Value', ()=>{
        render(<App />);

        const slider = screen.getByTestId('sliderlig');
        const labelValue = screen.getByTestId('labelValuelig');
        const resetButton = screen.getByTestId('buttonResetlig')

        // default value
        expect(Number(labelValue.textContent)).toBe(6);

        fireEvent.change(slider, { target: { value: 12 } });
        expect(Number(labelValue.textContent)).toBe(12);

        // reset to default value
        fireEvent.click(resetButton);
        expect(Number(labelValue.textContent)).toBe(6);
    })
})

