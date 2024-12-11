import React from 'react'
import { HslColor, HslColorPicker } from "react-colorful";
import ColorBox from '../components/ColorBox';



function getAbsoluteHueValue(_value:number):number{
    if(_value < 0.0){ return 360.0 + _value}
    else if(_value > 360.0){ return 360.0 - _value }
    else{ return _value }
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


// hue do amarelo: 60
// hue do azul: 240


export default function MainPage(){
    const [currentColor, setCurrentColor] = React.useState<HslColor>({h: 120.0, s: 75.0, l: 45.0})
    const [currentColorsArray, setCurrentColorsArray] = React.useState<HslColor[]>([])
    const [currentHexColorsArray, setCurrentHexColorsArray] = React.useState<string[]>([])
    const [historicColors, setHistoricColors] = React.useState<HslColor[]>([])
    const [paletteColors, setPaletteColors] = React.useState<HslColor[]>([])
    
    const [colorCount, setColorCount] = React.useState<number>(5)
    const [hueShifting, setHueShifting] = React.useState<number>(10.0)
    const [saturationShifting, setSaturationShifting] = React.useState<number>(5.0)
    const [lightnessShifting, setLightnessShifting] = React.useState<number>(5.0)

    const maxHistoricSize:number = 20


    function getNextColor(_color:HslColor, _step:number, _lighterOrDarker:number):HslColor{
        let hueDirection:number = 0.0;
        
        // para cores mais claras, _lighterOrDarker = 1.0, para cores mais escuras, = -1.0

        // para definir se a cor mais clara esta a direita da cor atual ou a esquerda (os tons mais claros tendem pro amarelo)
        const clockwise = (60.0 - _color.h + 360) % 360;
        const counterClockwise = (_color.h - 60.0 + 360) % 360;
        if (clockwise < counterClockwise) { hueDirection = 1.0 * _lighterOrDarker; } // a cor esta a esquerda do amarelo
        else { hueDirection = -1.0 * _lighterOrDarker; }                             // a cor esta a direita do amarelo

        const shiftedHue:number = getAbsoluteHueValue((_color.h + hueShifting*_step*hueDirection) % 360);
        
        // clamp para nao passar do amarelo
        // if(clockwise < counterClockwise){ shiftedHue = Math.min(shiftedHue, 60.0); }
        // else{ shiftedHue = Math.max(shiftedHue, 60.0); }
    
        const shiftedSaturation:number = _color.s + saturationShifting*_step*_lighterOrDarker;
        const shiftedLightness:number = _color.l + lightnessShifting*_step*_lighterOrDarker
        const shiftedColor:HslColor = {h:  shiftedHue, s: shiftedSaturation, l: shiftedLightness};
    
        return shiftedColor;
    }


    function handleChangeCurrentColor(_newColor:HslColor):void{
        setCurrentColor(_newColor)
        const newCurrentColorsArray:HslColor[] = []
        const middleIdx:number = Math.floor(colorCount/2.0)

        for(let i=middleIdx; i>0; i--){ newCurrentColorsArray.push(getNextColor(_newColor, i, 1.0)); } // cores mais claras (o meio ate o inicio)

        newCurrentColorsArray.push(_newColor) // cor do meio

        for(let i=middleIdx+1; i<colorCount; i++){ newCurrentColorsArray.push(getNextColor(_newColor, i, -1.0)); } // cores mais escuras (do meio ate o final)

        setCurrentColorsArray(newCurrentColorsArray)

        // atualizando o array de cores no formato HEX (para o preview e gradiente)
        const newCurrentHexColorsArray:string[] = []
        newCurrentColorsArray.forEach((item)=>{ newCurrentHexColorsArray.push(hslToHex(item)) })
        setCurrentHexColorsArray(newCurrentHexColorsArray)
    }


    function handleMouseUp():void{
        const newHistoricColors:HslColor[] = [...historicColors]
        if(newHistoricColors.length < maxHistoricSize){ newHistoricColors.push(currentColor) }
        else{
            newHistoricColors.shift()
            newHistoricColors.push(currentColor)
        }
        setHistoricColors(newHistoricColors)
    }


    function handleClickButtonColorCount(_increment:number):void{
        if(colorCount == 3 && _increment < 0){ return }
        else if(colorCount == 15 && _increment > 0){ return }
        setColorCount((prev)=>{return prev+_increment})
    }


    React.useEffect(()=>{
        handleChangeCurrentColor(currentColor) // atualizando a cor atual apos mudar o tamanho do gradiente
    }, [colorCount])


    return(
        <>
            <div className='flex justify-center items-center min-h-28 mb-20 bg-white shadow-md'>
                <h1 className='font-pixel text-5xl text-center'>Palette Helper</h1>
            </div>

            <div className='flex w-full items-start gap-6 px-4'>

                <div className='main-page__section flex flex-col gap-4'>
                    <div>
                        <p className='main-page__text-section'>Historic:</p>
                        <div className='flex flex-wrap'>
                            {
                                historicColors.map((item, key)=>{
                                    return(
                                        <ColorBox key={key} color={item} handleChangeCurrentColor={handleChangeCurrentColor} />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div>
                        <p className='text-sm font-pixel'>Color Count in Gradient: </p>
                        <div className='flex gap-2 items-center'>
                            <button className='bg-gray-500 basis-8 text-white text-2xl' onClick={()=>{handleClickButtonColorCount(-1)}}>&minus;</button>
                            <p className='text-center text-xl font-pixel'>{colorCount}</p>
                            <button className='bg-gray-500 basis-8 text-white text-2xl' onClick={()=>{handleClickButtonColorCount(+1)}}>+</button>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col basis-200px grow gap-2'>
                    <HslColorPicker className='grow !w-auto' onMouseUp={()=>{handleMouseUp()}} color={currentColor} onChange={(newColor:HslColor)=>{handleChangeCurrentColor(newColor)}} />
                    
                    <div className='w-full h-6' style={{backgroundImage: `linear-gradient(to right, ${currentHexColorsArray.join(', ')})`}}></div>
                
                    <div className='main-page__section'>
                        <p>Preview:</p>
                        <div className=' w-16 h-16 rounded-full' style={{backgroundPosition: 'top left', backgroundImage: `radial-gradient(at 35% 35%, ${currentHexColorsArray.join(', ')})`}} />
                    </div>
                            
                    <div className='flex justify-center'>
                        {
                            currentColorsArray.map((item, key)=>{
                                return(
                                    <ColorBox key={key} color={item} handleChangeCurrentColor={handleChangeCurrentColor} isMainColor={item == currentColor} />
                                )
                            })
                        }
                    </div>
                </div>
                
                
                <div className='main-page__section'>
                    <p className='main-page__text-section'>Palette:</p>
                    <div className='flex flex-wrap'>
                        {
                            paletteColors.map((item, key)=>{
                                return(
                                    <ColorBox key={key} color={item} handleChangeCurrentColor={handleChangeCurrentColor} />
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        </>
    )
}