import { HslColor } from "react-colorful";


interface Props {
    hslColor: HslColor; // Define a prop 'color' como uma string
    hexColor: string;
    handleChangeCurrentColor: (_newColor:HslColor) => void;
    isMainColor: boolean
}


export default function ColorBox({hslColor, hexColor, handleChangeCurrentColor, isMainColor}:Props){

    function handleClickColor():void{
        handleChangeCurrentColor(hslColor)
    }

    return(
        <div className="flex flex-col">
            <div className='w-8 h-8 hover:cursor-pointer shadow-md' onClick={handleClickColor} style={{backgroundColor: hexColor}}></div>
            { isMainColor && <p className="text-black text-2xl text-center">^</p> }
        </div>
    )
}

ColorBox.defaultProps = {
    isMainColor: false,
};