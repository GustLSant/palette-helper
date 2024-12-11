import React from 'react'
import { HslColor, HslColorPicker } from "react-colorful";
import ColorBox from '../components/ColorBox';
import ConfigContainer from '../components/ConfigContainer';



function getAbsoluteHueValue(_value:number):number{
    if(_value < 0.0){ return 360.0 + _value}
    else if(_value > 360.0){ return 360.0 - _value }
    else{ return _value }
}


function hslToHex(_color:HslColor):string{
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

// hue do amarelo: 60
// hue do azul: 240


export default function MainPage(){
    const [currentColor, setCurrentColor] = React.useState<HslColor>({h: 120.0, s: 75.0, l: 45.0})
    const [currentColorsArray, setCurrentColorsArray] = React.useState<HslColor[]>([])
    const [currentHexColorsArray, setCurrentHexColorsArray] = React.useState<string[]>([])
    const [historicColors, setHistoricColors] = React.useState<HslColor[]>([])
    const [paletteColors, setPaletteColors] = React.useState<HslColor[]>([])
    
    const [colorCount, setColorCount] = React.useState<number>(5)
    const [hueShifting, setHueShifting] = React.useState<number>(8.0)
    const [saturationShifting, setSaturationShifting] = React.useState<number>(6.0)
    const [lightnessShifting, setLightnessShifting] = React.useState<number>(2.0)

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

    function handleClickShiftingButton(_shiftingType:string, _increment:number):void{
        switch(_shiftingType){
            case 'hue' : {
                setHueShifting((prev)=>{return (prev + _increment)});
                break;
            }
            case 'sat' : {
                setSaturationShifting((prev)=>{return (prev + _increment)});
                break;
            }
            case 'lig' : {
                setLightnessShifting((prev)=>{return (prev + _increment)});
                break;
            }
            default: { 
                console.error("default case do handleClickShiftingButton")
                break; 
            } 
        }
    }


    React.useEffect(()=>{
        handleChangeCurrentColor(currentColor) // atualizando a cor atual apos mudar o tamanho do gradiente
    }, [colorCount, hueShifting, saturationShifting, lightnessShifting])


    return(
        <>
            <div className='flex justify-center items-center min-h-28 mb-20 bg-white shadow-md'>
                <h1 className='font-pixel text-5xl text-center'>Palette Helper</h1>
            </div>

            <div className='flex w-full items-stretch gap-6 px-4'>

                <div className='flex flex-col gap-4 justify-start'>
                    <div className='main-page__mini-section'>
                        <p className='main-page__text-section'>Historic:</p>
                        <div className='flex flex-wrap'>
                            {
                                historicColors.map((item, key)=>{
                                    return(
                                        <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={handleChangeCurrentColor} />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className='main-page__mini-section'>
                        <p className='text-sm font-pixel'>Color Count in Gradient: </p>
                        <div className='flex gap-2 items-center'>
                            <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{handleClickButtonColorCount(-1)}}>&minus;</button>
                            <p className='text-center text-xl font-pixel'>{colorCount}</p>
                            <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{handleClickButtonColorCount(1)}}>+</button>
                        </div>
                    </div>

                    <ConfigContainer label='Hue Shifting Value: ' type={'hue'} value={hueShifting} setterFunction={handleClickShiftingButton} increment={4} />
                    
                    <ConfigContainer label='Saturation Shifting Value: ' type={'sat'} value={saturationShifting} setterFunction={handleClickShiftingButton} increment={2} />

                    <ConfigContainer label='Lightness Shifting Value: ' type={'lig'} value={lightnessShifting} setterFunction={handleClickShiftingButton} increment={1} />
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
                                    <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={handleChangeCurrentColor} isMainColor={item == currentColor} />
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
                                    <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={handleChangeCurrentColor} />
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        </>
    )
}