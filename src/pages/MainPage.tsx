import React from 'react'
import { HslColor, HslColorPicker } from "react-colorful";
import { clamp, getAbsoluteHueValue, hexToHsl, hslToHex } from '../tools/ColorTools';
import ColorBox from '../components/ColorBox';
import ConfigContainer from '../components/ConfigContainer';
import HistoricSection from '../components/HistoricSection';
import PaletteSection from '../components/PaletteSection';
import { BiTransfer } from "react-icons/bi";
import { BiShapeTriangle } from "react-icons/bi";


// hue do amarelo: 60
// hue do azul: 240

export type TypeConfigSlideChange = 'lgh-hue' | 'drk-hue' | 'sat' | 'lig'


export default function MainPage(){
    const [currentColor, setCurrentColor] = React.useState<HslColor>({h: 120.0, s: 75.0, l: 45.0})
    const [currentColorsArray, setCurrentColorsArray] = React.useState<HslColor[]>([])
    const [currentHexColorsArray, setCurrentHexColorsArray] = React.useState<string[]>([])
    const [mouseUpWatcher, setMouseUpWatcher] = React.useState<number>(0) // state para verificar se o mouse selecionou (soltou o click, e n arrastou) uma cor no picker (para atualizar o historico de cores)
    const [selectedColorText, setSelectedColorText] = React.useState<string>('')
    
    const defaultHueShifting:number = 16.0;
    const defaultSaturationShifting:number = 0.0; // 6.0
    const defaultLightnessShifting:number = 6.0;

    const [colorCount, setColorCount] = React.useState<number>(5)
    const [lightHueShifting, setLightHueShifting] = React.useState<number>(defaultHueShifting)
    const [darkHueShifting, setDarkHueShifting] = React.useState<number>(defaultHueShifting)
    const [saturationShifting, setSaturationShifting] = React.useState<number>(defaultSaturationShifting)
    const [lightnessShifting, setLightnessShifting] = React.useState<number>(defaultLightnessShifting)

    const divContainerGeneral = React.useRef<HTMLDivElement | null>(null);


    function getNextColor(_originalColor:HslColor, _step:number, _lighterOrDarker:number):HslColor{
        let hueDirection:number = 0.0;
        
        // para cores mais claras, _lighterOrDarker = 1.0, para cores mais escuras, = -1.0

        // para definir se a cor mais clara esta a direita da cor atual ou a esquerda (os tons mais claros tendem pro amarelo)
        const clockwise = (60.0 - _originalColor.h + 360) % 360;
        const counterClockwise = (_originalColor.h - 60.0 + 360) % 360;
        if (clockwise < counterClockwise) { hueDirection = 1.0 * _lighterOrDarker; } // a cor esta a esquerda do amarelo
        else { hueDirection = -1.0 * _lighterOrDarker; }                             // a cor esta a direita do amarelo

        
        let normalizedShiftedHue:number = 0.0;

        if(_lighterOrDarker > 0){ // clareando
            const absoluteShiftedHue:number = (_originalColor.h + lightHueShifting*_step*hueDirection); // hue sem respeitar o limite 0 ~ 360
            // limitando o valor do hue para o amarelo mesmo fora do intervalo [0-360] // intervalo geral do amarelo: -60 ~ 0 ~ 60 ~ 420
            if(_originalColor.h < 60.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, -60.0, 60.0); }
            else if(_originalColor.h > 60.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, 60.0, 420.0); }
            else{ normalizedShiftedHue = 60.0; }
        }
        else{ // escurecendo
            const absoluteShiftedHue:number = (_originalColor.h + darkHueShifting*_step*hueDirection); // hue sem respeitar o limite 0 ~ 360
            // limitando o valor do hue para o azul mesmo fora do intervalo [0-360] // intervalo geral do azul: -240 ~ 0 ~ 240 ~ 480
            if(_originalColor.h < 240.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, -240.0, 240.0); }
            else if(_originalColor.h > 240.0){ normalizedShiftedHue = clamp(absoluteShiftedHue, 240.0, 480.0); }
            else{ normalizedShiftedHue = 240.0; }
        }
        
        // tratando o valor do hue caso esteja fora do limite [0-360]
        if(normalizedShiftedHue < 0.0){ normalizedShiftedHue = ((normalizedShiftedHue % 360) + 360) % 360; }
        else if(normalizedShiftedHue > 360.0){ normalizedShiftedHue = normalizedShiftedHue % 360.0; }
    
        const shiftedSaturation:number = _originalColor.s + saturationShifting*_step*_lighterOrDarker;
        const shiftedLightness:number = _originalColor.l + lightnessShifting*_step*_lighterOrDarker
        const shiftedColor:HslColor = {h:  normalizedShiftedHue, s: shiftedSaturation, l: shiftedLightness};
    
        return shiftedColor;
    }


    function handleChangeCurrentColor(_newColor:HslColor, _forceColorHistoricUpdate:boolean=false):void{
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

        setSelectedColorText(hslToHex(_newColor));

        if(_forceColorHistoricUpdate){ setMouseUpWatcher((prev)=>{if(prev === 1000){return 0}else{return prev+1}}) } // o mouseUpWatcher eh oq determina quando o user selecionou uma cor no picker, e so adiciona uma cor no historico quando isso acontece
    }


    function handleClickButtonColorCount(_increment:number):void{
        if(colorCount == 3 && _increment < 0){ return }
        else if(colorCount == 15 && _increment > 0){ return }
        setColorCount((prev)=>{return prev+_increment})
    }

    function handleConfigSliderChange(_shiftingType:TypeConfigSlideChange, value:number):void{
        switch(_shiftingType){
            case 'lgh-hue' : {
                setLightHueShifting(value);
                break;
            }
            case 'drk-hue' : {
                setDarkHueShifting(value);
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
            case 'lgh-hue' : {
                setLightHueShifting(defaultHueShifting);
                break;
            }
            case 'drk-hue' : {
                setDarkHueShifting(defaultHueShifting);
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
        handleChangeCurrentColor(currentColor) // atualizando a cor atual
    }, [colorCount, lightHueShifting, darkHueShifting, saturationShifting, lightnessShifting])


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


    function handleChangeInputSelectedColor(e:React.ChangeEvent<HTMLInputElement>):void{
        const content:string = e.target.value.replace(/[^0-9a-fA-F#]/g, '');
        const stringHasHashtag:number = Number(content.charAt(0) === '#');
        if(content.length === 3+stringHasHashtag || content.length === 6+stringHasHashtag){
            handleChangeCurrentColor(hexToHsl(content));
        }
        setSelectedColorText(content);
    }


    function handleClickSelectComplementary():void{
        const newColor:HslColor = {
            h: currentColor.h,
            s: currentColor.s,
            l: currentColor.l
        }
        newColor.h = getAbsoluteHueValue(newColor.h + 180);
        handleChangeCurrentColor(newColor, false); // passa true no segundo argumento para considerar essa mudanca de cor como se fosse uma mudanca do picker
    }
    function handleClickSelectTriadic():void{
        const newColor:HslColor = {
            h: currentColor.h,
            s: currentColor.s,
            l: currentColor.l
        }
        newColor.h = getAbsoluteHueValue(newColor.h + 120);
        handleChangeCurrentColor(newColor, false); // passa true no segundo argumento para considerar essa mudanca de cor como se fosse uma mudanca do picker
    }


    React.useEffect(()=>{
        if(divContainerGeneral.current){
            divContainerGeneral.current.scrollLeft = (divContainerGeneral.current.scrollWidth - divContainerGeneral.current.clientWidth) / 2;
        }
    }, [])
    


    return(
        <div className='flex flex-col'>
            <div className='flex justify-center items-center bg-white shadow-md'>
                <h1 className='text-4xl text-center py-4'>Palette Helper</h1>
            </div>

            <div className='overflow-auto pb-2 flex flex-col gap-4 pt-6' ref={divContainerGeneral}>
                <div className='flex md:hidden gap-2 justify-center font-sm w-full min-w-[750px]'>
                    <p>&#10218;</p>
                    <p>Horizontal Scroll</p>
                    <p>&#10219;</p>
                </div>

                <div className='grid grid-cols-3 w-full gap-6 px-4 min-w-[750px]'>

                    <section className='flex flex-col gap-4 justify-start'>
                        
                        <HistoricSection currentColor={currentColor} mouseUpWatcher={mouseUpWatcher} handleChangeCurrentColor={handleChangeCurrentColor} />

                        <div className='main-page__mini-section'>
                            <p className='text-lg'>Color Count in Gradient: </p>
                            <div className='flex gap-2 items-center'>
                                <button data-testid={'buttonDecreaseColorCount'} className='button-01' onClick={()=>{handleClickButtonColorCount(-1)}}>&minus;</button>
                                <p className='text-center text-xl' data-testid={'labelValueColorCount'}>{colorCount}</p>
                                <button data-testid={'buttonIncreaseColorCount'} className='button-01' onClick={()=>{handleClickButtonColorCount(1)}}>+</button>
                            </div>
                        </div>

                        <ConfigContainer label='Lighter Hue Shifting Value: ' type={'lgh-hue'} value={lightHueShifting} maxValue={40} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />
                        
                        <ConfigContainer label='Darker Hue Shifting Value: ' type={'drk-hue'} value={darkHueShifting} maxValue={40} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />

                        {/* <ConfigContainer label='Saturation Shifting Value: ' type={'sat'} value={saturationShifting} maxValue={30} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} /> */}

                        <ConfigContainer label='Lightness Shifting Value: ' type={'lig'} value={lightnessShifting} maxValue={20} step={2} setterFunction={handleConfigSliderChange} resetFunction={handleClickResetShiftingButton} />
                    </section>
                    
                    <section className='flex flex-col gap-2'>
                        <HslColorPicker className='!w-auto shadow-md' onMouseUp={()=>{setMouseUpWatcher((prev)=>{if(prev === 1000){return 0}else{return prev+1}})}} color={currentColor} onChange={(newColor:HslColor)=>{handleChangeCurrentColor(newColor)}} />
                        
                        <div className="main-page__mini-section">
                            <div className='flex flex-col gap-2'>
                                <p>Selected Color:</p>
                                <div className='flex gap-2 items-center'>
                                    <div className='w-8 h-8 shadow-md' style={{backgroundColor: hslToHex(currentColor)}} />
                                    <input data-testid={'textInputCurrentColor'} type="text" className='bg-gray-300 rounded-sm p-1 px-2 focus:outline-none max-w-[150px]' value={selectedColorText} onChange={handleChangeInputSelectedColor} name="color-code-input" style={{boxShadow: '4px 4px 4px rgba(0,0,0, 0.2) inset'}} id="color-code-input" />
                                    {/* <p>{hslToHex(currentColor)}</p> */}
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
                                    <input data-testid={'sliderSaturation'} className='w-full' value={currentColor.s} onChange={handleChangeSliderSaturation} max={100} min={0} type="range" name="input-range-sat" id="input-range-sat" />
                                </div>
                                <div>
                                    <div className='flex justify-between'>
                                        <p>Lightness:</p>
                                        <p>{currentColor.l}</p>
                                    </div>
                                    <input data-testid={'sliderLightness'} className='w-full' value={currentColor.l} onChange={handleChangeSliderLightness} max={100} min={0} type="range" name="input-range-lig" id="input-range-lig" />
                                </div>
                            </div>

                            <div className='flex justify-center max-w-full overflow-x-auto' data-testid={'divCurrentColors'}>
                                {
                                    currentColorsArray.map((item, key)=>{
                                        return(
                                            <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={handleChangeCurrentColor} isMainColor={item == currentColor} />
                                        )
                                    })
                                }
                            </div>
                            

                            <div className='flex p-1 gap-1 items-center'>
                                <div className='button-01' data-testid={'buttonComplementaryColor'} onClick={handleClickSelectComplementary}>
                                    <BiTransfer  />
                                </div>
                                <p>Select Complementary Color</p>
                            </div>

                            <div className='flex p-1 gap-1 items-center'>
                                <div className='button-01' data-testid={'buttonTriadicColor'} onClick={handleClickSelectTriadic}>
                                    <BiShapeTriangle  />
                                </div>
                                <p>Select Next Triadic Color</p>
                            </div>
                            
                        </div>
                    </section>
                    
                    <section className='flex flex-col gap-4 justify-start'>
                        <PaletteSection currentColorsArray={currentColorsArray} handleChangeCurrentColor={handleChangeCurrentColor} />
                        
                        <div className='main-page__mini-section'>
                            <p className='main-page__text-section'>Preview:</p>

                            <div className='w-full h-6' data-testid={'previewGradientRect'} style={{backgroundImage: `linear-gradient(to right, ${currentHexColorsArray.join(', ')})`}}></div>

                            <div className='overflow-hidden flex justify-center items-center p-6  mx-12 aspect-square w-full max-w-4xl self-center rounded-md bg-gray-300' style={{boxShadow: '4px 4px 4px rgba(0,0,0, 0.15) inset', zIndex: 1}}>
                                {/* esfera */}
                                <div className='relative w-full max-w-sm aspect-square rounded-full' data-testid={'previewGradientSphere'} style={{backgroundPosition: 'top left', backgroundImage: `radial-gradient(at 30% 30%, ${currentHexColorsArray.join(', ')})`}}>
                                    {/* sombra */}
                                    <div className='absolute w-[80%] aspect-square rounded-full bottom-[-30%] right-0' style={{backgroundImage: 'radial-gradient(rgba(0,0,0, 1.0), rgba(0,0,0, 0.6), rgba(0,0,0, 0.3), transparent)', zIndex: -1, transform: 'scaleY(0.4)'}} />
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

        </div>
    )
}