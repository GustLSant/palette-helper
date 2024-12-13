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