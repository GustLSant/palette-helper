import { HslColor } from "react-colorful";


interface ColorBoxProps {
    hslColor: HslColor; // Define a prop 'color' como uma string
    hexColor: string;
    handleChangeCurrentColor: (_newColor:HslColor) => void;
    hasShadow?: boolean;
    isMainColor?: boolean;
}


export default function ColorBox({hslColor, hexColor, handleChangeCurrentColor, hasShadow=true, isMainColor=false}:ColorBoxProps){

    function handleClickColor():void{
        handleChangeCurrentColor(hslColor)
    }

    return(
        <div className="flex flex-col">
            <div className={`w-8 h-8 hover:cursor-pointer ${(hasShadow) ? 'shadow-md' : ''}`} onClick={handleClickColor} title={hexColor} style={{backgroundColor: hexColor}}></div>
            { isMainColor && <p className="text-black text-2xl text-center">^</p> }
        </div>
    )
}