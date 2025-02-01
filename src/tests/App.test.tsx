import '@testing-library/jest-dom'
import { render, screen, fireEvent } from "@testing-library/react"
import App from '../App'

jest.mock('../assets/react.svg', () => 'test-file-stub');
const defaultColor:string = '#1dc91d';


describe('App page test', ()=>{

    test("Should render the Main Page", () => {
        const { getByText } = render(<App />);
        const text:HTMLElement = getByText(/Select Complementary Color/);
        expect(text).toBeInTheDocument();
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

        const sliderLightHue = screen.getByTestId('slider-lgh-hue');
        const sliderDarkHue = screen.getByTestId('slider-drk-hue');
        const labelValueLight = screen.getByTestId('labelValue-lgh-hue');
        const labelValueDark = screen.getByTestId('labelValue-drk-hue');
        const resetButtonLight = screen.getByTestId('buttonReset-lgh-hue')
        const resetButtonDark = screen.getByTestId('buttonReset-drk-hue')

        // default value
        expect(Number(labelValueLight.textContent)).toBe(16);
        expect(Number(labelValueDark.textContent)).toBe(16);

        // change event
        fireEvent.change(sliderLightHue, { target: { value: 10 } });
        fireEvent.change(sliderDarkHue, { target: { value: 12 } });
        expect(Number(labelValueLight.textContent)).toBe(10);
        expect(Number(labelValueDark.textContent)).toBe(12);

        // reset to default value
        fireEvent.click(resetButtonLight);
        fireEvent.click(resetButtonDark);
        expect(Number(labelValueLight.textContent)).toBe(16);
        expect(Number(labelValueDark.textContent)).toBe(16);
    })


    test('Should change Lightness Shifting Value', ()=>{
        render(<App />);

        const slider = screen.getByTestId('slider-lig');
        const labelValue = screen.getByTestId('labelValue-lig');
        const resetButton = screen.getByTestId('buttonReset-lig')

        // default value
        expect(Number(labelValue.textContent)).toBe(6);

        fireEvent.change(slider, { target: { value: 12 } });
        expect(Number(labelValue.textContent)).toBe(12);

        // reset to default value
        fireEvent.click(resetButton);
        expect(Number(labelValue.textContent)).toBe(6);
    })


    test('Should change Current Color (InputText, Triadic and Complementary Buttons)', ()=>{
        render(<App />);

        const complementaryButton:HTMLButtonElement = screen.getByTestId('buttonComplementaryColor');
        const triadicButton:HTMLButtonElement = screen.getByTestId('buttonTriadicColor');
        const textInputCurrentColor:HTMLInputElement = screen.getByTestId('textInputCurrentColor');

        // default value
        expect(textInputCurrentColor.value).toBe(defaultColor);
        
        // text input
        fireEvent.change(textInputCurrentColor, {target: {value: '#ff0000'}});
        expect(textInputCurrentColor.value).toBe('#ff0000');

        // complementary button
        fireEvent.click(complementaryButton);
        expect(textInputCurrentColor.value).toBe('#00ffff');
        fireEvent.click(complementaryButton);
        expect(textInputCurrentColor.value).toBe('#ff0000');
        
        // triadic button
        fireEvent.click(triadicButton);
        expect(textInputCurrentColor.value).toBe('#00ff00');
        fireEvent.click(triadicButton);
        expect(textInputCurrentColor.value).toBe('#0000ff');
        fireEvent.click(triadicButton);
        expect(textInputCurrentColor.value).toBe('#ff0000');
    })


    test('Should change Current Color (Saturation and Lightness Sliders', ()=>{
        render(<App />);

        const textInputCurrentColor:HTMLInputElement = screen.getByTestId('textInputCurrentColor');
        const sliderSaturation:HTMLInputElement = screen.getByTestId('sliderSaturation');
        const sliderLightness:HTMLInputElement = screen.getByTestId('sliderLightness');

        // sliders reading color changings
        fireEvent.change(textInputCurrentColor, {target: {value: '#ff0000'}});
        expect(Number(sliderSaturation.value)).toBe(100);
        expect(Number(sliderLightness.value)).toBe(50);

        // saturation slider
        fireEvent.change(sliderSaturation, {target: {value: 50}});
        expect(textInputCurrentColor.value).toBe('#bf4040');
        expect(Number(sliderLightness.value)).toBe(50);
        fireEvent.change(sliderSaturation, {target: {value: 100}});
        expect(textInputCurrentColor.value).toBe('#ff0000');
        expect(Number(sliderLightness.value)).toBe(50);

        // ligtness slider
        fireEvent.change(sliderLightness, {target: {value: 0}});
        expect(textInputCurrentColor.value).toBe('#000000');
        expect(Number(sliderSaturation.value)).toBe(100);
        fireEvent.change(sliderLightness, {target: {value: 100}});
        expect(textInputCurrentColor.value).toBe('#ffffff');
        expect(Number(sliderSaturation.value)).toBe(100);
    })


    test('Should update previews', ()=>{
        render(<App />);

        const textInputCurrentColor:HTMLInputElement = screen.getByTestId('textInputCurrentColor');
        const divPreviewRect:HTMLDivElement = screen.getByTestId('previewGradientRect');
        const divPreviewSphere:HTMLDivElement = screen.getByTestId('previewGradientSphere');

        // default color
        expect(divPreviewRect).toHaveStyle({ backgroundImage: `linear-gradient(to right, rgb(162, 228, 63), rgb(93, 224, 36), rgb(29, 201, 29), rgb(25, 174, 70), rgb(21, 147, 97))` })
        expect(divPreviewSphere).toHaveStyle({ backgroundImage: `radial-gradient(at 30% 30%, rgb(162, 228, 63), rgb(93, 224, 36), rgb(29, 201, 29), rgb(25, 174, 70), rgb(21, 147, 97))` })

        // new color
        fireEvent.change(textInputCurrentColor, {target: {value: '#ff0000'}});
        expect(divPreviewRect).toHaveStyle({ backgroundImage: `linear-gradient(to right, rgb(255, 177, 61), rgb(255, 98, 31), rgb(255, 0, 0), rgb(224, 0, 67), rgb(194, 0, 116))` })
        expect(divPreviewSphere).toHaveStyle({ backgroundImage: `radial-gradient(at 30% 30%, rgb(255, 177, 61), rgb(255, 98, 31), rgb(255, 0, 0), rgb(224, 0, 67), rgb(194, 0, 116))` })
    })


    
})

