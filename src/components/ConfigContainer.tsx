import React from "react";
import { BiReset } from "react-icons/bi";


interface ConfigContainerProps {
    label:string;
    type:string; // 'hue' 'sat' 'lig'
    value:number;
    maxValue:number;
    step: number;
    setterFunction: (_type:string, _value:number) => void;
    resetFunction: (_type:string) => void;
}



export default function ConfigContainer({label, type, value, maxValue, step, setterFunction, resetFunction} : ConfigContainerProps){


    return(
        <div className='main-page__mini-section'>
            
            <p className='text-lg'>{ label }</p>
            
            <div className='flex gap-2 items-center'>
                <input data-testid={'slider'+type} className="grow" type="range" value={value} max={maxValue} step={step} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setterFunction(type, Number(e.target.value))}} /> 
                <p data-testid={'labelValue'+type}>{value}</p>
                <button data-testid={'buttonReset'+type} className='button-01' onClick={()=>{resetFunction(type)}}><BiReset /></button>
            </div>

        </div>
    )
}