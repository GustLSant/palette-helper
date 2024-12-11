import { HslColor } from "react-colorful";


interface Props {
    color: HslColor; // Define a prop 'color' como uma string
    handleChangeCurrentColor: (_newColor:HslColor) => void;
    isMainColor: boolean
}

function hslToHex(_color:HslColor):string{
    // Converte saturação e luminosidade de porcentagem para fração
    const h = _color.h, s = _color.s, l = _color.l;
    
    const saturation = s / 100;
    const lightness = l / 100;

    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lightness - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h <= 360) {
        r = c; g = 0; b = x;
    }

    // Converte os valores RGB para escala de 0-255 e aplica o ajuste de luminosidade
    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);

    // Retorna a cor no formato HEX
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}


export default function ColorBox({color, handleChangeCurrentColor, isMainColor}:Props){

    function handleClickColor():void{
        handleChangeCurrentColor(color)
    }


    return(
        <div className="flex flex-col">
            <div className='w-8 h-8 hover:cursor-pointer shadow-md' onClick={handleClickColor} style={{backgroundColor: hslToHex(color)}}></div>
            { isMainColor && <p className="text-black text-2xl text-center">^</p> }
        </div>
    )
}

ColorBox.defaultProps = {
    isMainColor: false,
};