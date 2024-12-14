import { HslColor } from "react-colorful";


export function getAbsoluteHueValue(_value:number):number{
    return _value % 360.0;
    if(_value < 0.0){ return 360.0 + _value}
    else if(_value > 360.0){ return 360.0 - _value }
    else{ return _value }
}


export function hslToHex(_color:HslColor):string{
    const h = _color.h;
    const s = _color.s / 100;
    const l = _color.l / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n:number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * Math.min(Math.max(color, 0), 1)) // Clamp between 0 and 1
            .toString(16)
            .padStart(2, "0");
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}


export function hexToHsl(hexColor:string):HslColor{
    hexColor = hexColor.replace('#', "");
    hexColor = hexColor.replace(' ', "");
  
    // Divide o HEX em componentes RGB
    let r = 0, g = 0, b = 0;
  
    if (hexColor.length === 3) {
      r = parseInt(hexColor[0] + hexColor[0], 16);
      g = parseInt(hexColor[1] + hexColor[1], 16);
      b = parseInt(hexColor[2] + hexColor[2], 16);
    }
    else{
      r = parseInt(hexColor.slice(0, 2), 16);
      g = parseInt(hexColor.slice(2, 4), 16);
      b = parseInt(hexColor.slice(4, 6), 16);
    }
  
    // Converte valores RGB para a escala de 0 a 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
  
    // Calcula a luminosidade
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
  
    // Calcula saturação e matiz
    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  
      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
  
      h /= 6;
    }

    // Converte matiz para graus
    const result:HslColor = {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    }
  
    return result;
  }
  