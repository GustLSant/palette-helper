import React from 'react';
import { HslColor } from 'react-colorful';
import { hslToHex } from '../tools/ColorTools';
import ColorBox from './ColorBox';


interface HistoricSectionProps {
    currentColor: HslColor;
    mouseUpWatcher:number;
    handleChangeCurrentColor: (_newColor:HslColor) => void;
}


export default function HistoricSection({currentColor, mouseUpWatcher, handleChangeCurrentColor} : HistoricSectionProps){
    const [historicColors, setHistoricColors] = React.useState<HslColor[]>([])
    const maxHistoricSize:number = 20


    React.useEffect(()=>{
        const newHistoricColors:HslColor[] = [...historicColors]
        if(newHistoricColors.length < maxHistoricSize){ newHistoricColors.push(currentColor) }
        else{
            newHistoricColors.shift()
            newHistoricColors.push(currentColor)
        }
        setHistoricColors(newHistoricColors)
    }, [mouseUpWatcher])


    return(
        <div className='main-page__mini-section'>
            <p className='main-page__text-section'>Historic:</p>
            <div className='flex flex-wrap'>
                {
                    historicColors.map((item, key)=>{
                        return(
                            <ColorBox key={key} hslColor={item} hexColor={hslToHex(item)} handleChangeCurrentColor={()=>{handleChangeCurrentColor(item)}} />
                        )
                    })
                }
            </div>
        </div>
    )
}