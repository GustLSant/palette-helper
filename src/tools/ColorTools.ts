import { HslColor, RgbColor } from "react-colorful";


export function clamp(num:number, lower:number, upper:number):number{
  return Math.min(Math.max(num, lower), upper);
}


export function getAbsoluteHueValue(_value:number):number{
  return ((_value % 360) + 360) % 360;
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


export function HSLToRGB(_hslColor:HslColor):RgbColor{
  const { h, s, l } = _hslColor;

  const hDecimal = h / 100;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  if (s === 0) {
    return { r: lDecimal, g: lDecimal, b: lDecimal };
  }

  const HueToRGB = (p:number, q:number, t:number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q =
    (lDecimal < 0.5)
      ? lDecimal * (1 + sDecimal)
      : lDecimal + sDecimal - lDecimal * sDecimal;
  const p = 2 * lDecimal - q;

  const r:number = HueToRGB(p, q, hDecimal + 1 / 3);
  const g:number = HueToRGB(p, q, hDecimal);
  const b:number = HueToRGB(p, q, hDecimal - 1 / 3);

  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) } as RgbColor;
}


export function RGBToHSL(_rgbColor:RgbColor):HslColor{
  const { r: r255, g: g255, b: b255 } = _rgbColor;

  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;

  const max:number = Math.max(r, g, b);
  const min:number = Math.min(r, g, b);

  let h:number = (max + min) / 2;
  let s:number = h;
  const l:number = h;

  if (max === min) {
    // Achromatic
    return { h: 0, s: 0, l };
  }

  const d:number = max - min;
  s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
  switch (max) {
    case r:
      h = ((g - b) / d + 0) * 60;
      break;
    case g:
      h = ((b - r) / d + 2) * 60;
      break;
    case b:
      h = ((r - g) / d + 4) * 60;
      break;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}