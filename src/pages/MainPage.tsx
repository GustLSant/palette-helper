import React from 'react'
import { HslColor, HslColorPicker } from "react-colorful";
import { clamp, getAbsoluteHueValue, hslToHex } from '../tools/ColorTools';
import ColorBox from '../components/ColorBox';
import ConfigContainer from '../components/ConfigContainer';
import HistoricSection from '../components/HistoricSection';
import PaletteSection from '../components/PaletteSection';
import { BiTransfer } from "react-icons/bi";
import { BiShapeTriangle } from "react-icons/bi";


// hue do amarelo: 60
// hue do azul: 240


export default function MainPage(){
    const [currentColor, setCurrentColor] = React.useState<HslColor>({h: 120.0, s: 75.0, l: 45.0})
    const [currentColorsArray, setCurrentColorsArray] = React.useState<HslColor[]>([])
    const [currentHexColorsArray, setCurrentHexColorsArray] = React.useState<string[]>([])
    const [mouseUpWatcher, setMouseUpWatcher] = React.useState<number>(0)

    
    const defaultHueShifting:number = 18.0;
    const defaultSaturationShifting:number = 6.0;
    const defaultLightnessShifting:number = 6.0;

    const [colorCount, setColorCount] = React.useState<number>(5)
    const [hueShifting, setHueShifting] = React.useState<number>(defaultHueShifting)
    const [saturationShifting, setSaturationShifting] = React.useState<number>(defaultSaturationShifting)
    const [lightnessShifting, setLightnessShifting] = React.useState<number>(defaultLightnessShifting)


    function getNextColor(_originalColor:HslColor, _step:number, _lighterOrDarker:number):HslColor{
        let hueDirection:number = 0.0;
        
        // para cores mais claras, _lighterOrDarker = 1.0, para cores mais escuras, = -1.0

        // para definir se a cor mais clara esta a direita da cor atual ou a esquerda (os tons mais claros tendem pro amarelo)
        const clockwise = (60.0 - _originalColor.h + 360) % 360;
        const counterClockwise = (_originalColor.h - 60.0 + 360) % 360;
        if (clockwise < counterClockwise) { hueDirection = 1.0 * _lighterOrDarker; } // a cor esta a esquerda do amarelo
        else { hueDirection = -1.0 * _lighterOrDarker; }                             // a cor esta a direita do amarelo

        const absoluteShiftedHue:number = (_originalColor.h + hueShifting*_step*hueDirection); // hue sem respeitar o limite 0 ~ 360
        let normalizedShiftedHue:number = 0.0;

        if(_lighterOrDarker > 0){ // clareando
            // limitando o valor do hue para o amarelo mesmo fora do intervalo [0-360] // intervalo geral do amarelo: -60 ~ 0 ~ 60 ~ 420
            if(_originalColor.h < 60.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, -60.0, 60.0); }
            else if(_originalColor.h > 60.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, 60.0, 420.0); }
            else{ normalizedShiftedHue = 60.0; }
        }
        else{ // escurecendo
            // limitando o valor do hue para o azul mesmo fora do intervalo [0-360] // intervalo geral do azul: -240 ~ 0 ~ 240 ~ 480
            if(_originalColor.h < 240.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, -240.0, 240.0); }
            else if(_originalColor.h > 240.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, 240.0, 480.0); }
            else{ normalizedShiftedHue = 240.0; }
        }
        
        // tratando o valor do hue caso esteja fora do limite [0-360]
        if(normalizedShiftedHue < 0.0){ normalizedShiftedHue = Math.abs(normalizedShiftedHue); }
        else if(normalizedShiftedHue > 360.0){ normalizedShiftedHue = normalizedShiftedHue % 360.0; }
    
        const shiftedSaturation:number = _originalColor.s + saturationShifting*_step*_lighterOrDarker;
        const shiftedLightness:number = _originalColor.l + lightnessShifting*_step*_lighterOrDarker
        const shiftedColor:HslColor = {h:  normalizedShiftedHue, s: shiftedSaturation, l: shiftedLightness};
    
        return shiftedColor;
    }


    function handleChangeCurrentColor(_newColor:HslColor, _updateMouseUpWatcher:boolean=false):void{
        setCurrentColor(_newColor)
        const newCurrentColorsArray:HslColor[] = []
        const middleIdx:number = Math.floor(colorCount/2.0)

        for(let i=middleIdx; i>0; i--){ newCurrentColorsArray.push(getNextColor(_newColor, i, 1.0)); } // cores mais claras (o meio ate o inicio)

        newCurrentColorsArray.push(_newColor) // cor do meio

        for(let i=1; i<colorCount-middleIdx; i++){ newCurrentColorsArray.push(getNextColor(_newColor, i, -1.0)); } // cores mais escuras (do meio ate o final)

        setCurrentColorsArray(newCurrentColorsArray)

        // atualizando o array de cores no formato HEX (para o preview e gradiente)
        const newCurrentHexColorsArray:string[] = []
        newCurrentColorsArray.forEach((item)=>{ newCurrentHexColorsArray.push(hslToHex(item)) })
        setCurrentHexColorsArray(newCurrentHexColorsArray)

        if(_updateMouseUpWatcher){ setMouseUpWatcher((prev)=>{if(prev === 1000){return 0}else{return prev+1}}) }
    }


    function handleClickButtonColorCount(_increment:number):void{
        if(colorCount == 3 && _increment < 0){ return }
        else if(colorCount == 15 && _increment > 0){ return }
        setColorCount((prev)=>{return prev+_increment})
    }

    function handleConfigSliderChange(_shiftingType:string, value:number):void{
        switch(_shiftingType){
            case 'hue' : {
                setHueShifting(value);
                break;
            }
            case 'sat' : {
                setSaturationShifting(value);
                break;
            }
            case 'lig' : {
                setLightnessShifting(value);
                break;
            }
            default: { 
                console.error("default case do handleClickShiftingButton")
                break; 
            } 
        }
    }
    function handleClickResetShiftingButton(_shiftingType:string):void{
        switch(_shiftingType){
            case 'hue' : {
                setHueShifting(defaultHueShifting);
                break;
            }
            case 'sat' : {
                setSaturationShifting(defaultSaturationShifting);
                break;
            }
            case 'lig' : {
                setLightnessShifting(defaultLightnessShifting);
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


    function handleChangeSliderSaturation(e:React.ChangeEvent<HTMLInputElement>):void{
        const updatedColor:HslColor = {
            h: currentColor.h,
            s: Number(e.target.value),
            l: currentColor.l
        }
        handleChangeCurrentColor(updatedColor);
    }

    function handleChangeSliderLightness(e:React.ChangeEvent<HTMLInputElement>):void{
        const updatedColor:HslColor = {
            h: currentColor.h,
            s: currentColor.s,
            l: Number(e.target.value)
        }
        handleChangeCurrentColor(updatedColor);
    }


    function handleClickSelectComplementary():void{
        const newColor:HslColor = {
            h: currentColor.h,
            s: currentColor.s,
            l: currentColor.l
        }
        newColor.h = getAbsoluteHueValue(newColor.h + 180);
        handleChangeCurrentColor(newColor, true);
    }
    function handleClickSelectTriadic():void{
        const newColor:HslColor = {
            h: currentColor.h,
            s: currentColor.s,
            l: currentColor.l
        }
        newColor.h = getAbsoluteHueValue(newColor.h + 120);
        handleChangeCurrentColor(newColor, true);
    }

    


    return(
        <div className='flex flex-col gap-12'>
            <div className='flex justify-center items-center min-h-28 bg-white shadow-md'>
                <h1 className='text-5xl text-center'>Palette Helper</h1>
            </div>

            <div className='flex w-full items-stretch gap-6 px-4'>

                <section className='flex flex-col gap-4 justify-start basis-200px grow'>
                    
                    <HistoricSection currentColor={currentColor} mouseUpWatcher={mouseUpWatcher} handleChangeCurrentColor={handleChangeCurrentColor} />

                    <div className='main-page__mini-section'>
                        <p className='text-lg'>Color Count in Gradient: </p>
                        <div className='flex gap-2 items-center'>
                            <button className='button-01' onClick={()=>{handleClickButtonColorCount(-1)}}>&minus;</button>
                            <p className='text-center text-xl'>{colorCount}</p>
                            <button className='button-01' onClick={()=>{handleClickButtonColorCount(1)}}>+</button>
                        </div>
                    </div>

                    <ConfigContainer label='Hue Shifting Value: ' type={'hue'} value={hueShifting} maxValue={40} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />
                    
                    <ConfigContainer label='Saturation Shifting Value: ' type={'sat'} value={saturationShifting} maxValue={30} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />

                    <ConfigContainer label='Lightness Shifting Value: ' type={'lig'} value={lightnessShifting} maxValue={20} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />
                </section>
                
                <section className='flex flex-col basis-200px grow gap-2'>
                    <HslColorPicker className='grow !w-auto shadow-md' onMouseUp={()=>{setMouseUpWatcher((prev)=>{if(prev === 1000){return 0}else{return prev+1}})}} color={currentColor} onChange={(newColor:HslColor)=>{handleChangeCurrentColor(newColor)}} />
                    
                    <div className="main-page__mini-section">
                        <div className='flex flex-col gap-2'>
                            <p>Selected Color:</p>
                            <div className='flex gap-2 items-center'>
                                <div className='w-8 h-8 shadow-md' style={{backgroundColor: hslToHex(currentColor)}} />
                                <p>{hslToHex(currentColor)}</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between'>
                                <p>HUE:</p>
                                <p>{currentColor.h}º</p>
                            </div>
                            <div>
                                <div className='flex justify-between'>
                                    <p>Saturation:</p>
                                    <p>{currentColor.s}</p>
                                </div>
                                <input className='w-full' value={currentColor.s} onChange={handleChangeSliderSaturation} max={100} min={0} type="range" name="input-range-sat" id="input-range-sat" />
                            </div>
                            <div>
                                <div className='flex justify-between'>
                                    <p>Lightness:</p>
                                    <p>{currentColor.l}</p>
                                </div>
                                <input className='w-full' value={currentColor.l} onChange={handleChangeSliderLightness} max={100} min={0} type="range" name="input-range-lig" id="input-range-lig" />
                            </div>
                        </div>

                        <div className='flex justify-center max-w-[30vw] overflow-x-auto'>
                            {
                                currentColorsArray.map((item, key)=>{
                                    return(
                                        <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={handleChangeCurrentColor} isMainColor={item == currentColor} />
                                    )
                                })
                            }
                        </div>
                        

                        <div className='flex p-1 gap-1 items-center'>
                            <div className='button-01' onClick={handleClickSelectComplementary}>
                                <BiTransfer  />
                            </div>
                            <p>Select Complementary Color</p>
                        </div>

                        <div className='flex p-1 gap-1 items-center'>
                            <div className='button-01' onClick={handleClickSelectTriadic}>
                                <BiShapeTriangle  />
                            </div>
                            <p>Select Next Triadic Color</p>
                        </div>
                        
                    </div>
                </section>
                
                
                <section className='flex flex-col gap-4 justify-start basis-200px grow'>
                    <PaletteSection currentColorsArray={currentColorsArray} handleChangeCurrentColor={handleChangeCurrentColor} />
                    
                    <div className='main-page__mini-section'>
                        <p className='main-page__text-section'>Preview:</p>

                        <div className='w-full h-6' style={{backgroundImage: `linear-gradient(to right, ${currentHexColorsArray.join(', ')})`}}></div>

                        <div className='overflow-hidden flex justify-center items-center p-6  mx-12 aspect-square max-w-[20vw] w-full self-center rounded-md bg-gray-300' style={{boxShadow: '4px 4px 4px rgba(0,0,0, 0.25) inset', zIndex: 1}}>
                            {/* esfera */}
                            <div className='relative w-full aspect-square rounded-full' style={{backgroundPosition: 'top left', backgroundImage: `radial-gradient(at 35% 35%, ${currentHexColorsArray.join(', ')})`}}>
                                {/* sombra */}
                                <div className='absolute w-[80%] aspect-square rounded-full bottom-[-30%] right-0' style={{backgroundImage: 'radial-gradient(rgba(0,0,0, 1.0), rgba(0,0,0, 0.6), rgba(0,0,0, 0.3), transparent)', zIndex: -1, transform: 'scaleY(0.4)'}} />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}