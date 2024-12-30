import React from "react";
import html2canvas from 'html2canvas';
import { HslColor } from "react-colorful";
import ColorBox from "./ColorBox";
import { hslToHex, hexToHsl } from '../tools/ColorTools';
import { BiBookAdd } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { BiExport } from "react-icons/bi";
import { BiImport } from "react-icons/bi";


interface PaletteSection {
    currentColorsArray: HslColor[];
    handleChangeCurrentColor: (_color:HslColor) => void;
}


export default function PaletteSection({ currentColorsArray, handleChangeCurrentColor }:PaletteSection){
    const paletteDivRef = React.useRef<HTMLDivElement | null>(null);
    const [paletteColors, setPaletteColors] = React.useState<HslColor[][]>([])
    const inputImportPaletteRef = React.useRef<HTMLInputElement | null>(null);
    const [isExportingImage, setIsExportingImage] = React.useState<boolean>(false); // precisa disso para nao exportar a paleta com os icones de excluir os gradientes


    function handleClickAddToColorPalette():void{
        const newPalette:HslColor[][] = paletteColors.map((gradient) => [...gradient]);

        // gradiente atual
        newPalette.push([]);
        const lastIdx:number = newPalette.length - 1;
        newPalette[lastIdx] = [...currentColorsArray];

        setPaletteColors(newPalette);
    }


    function handleClickRemoveColorGradient(_idx:number):void{
        const newColorPalette:HslColor[][] = paletteColors.map((gradient) => [...gradient]);
        newColorPalette.splice(_idx, 1);
        setPaletteColors(newColorPalette);
    }


    function handleClickExportColorPaletteImage():void{
        setIsExportingImage(true)
        return;
    }

    async function exportPaletteAsImage():Promise<void>{
        if(paletteDivRef.current){
            const canvas = await html2canvas(paletteDivRef.current, {
                backgroundColor: null, // Fundo transparente
            });

            const image = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = image;
            link.download = 'captura.png';
            link.click();
        }
    }


    React.useEffect(()=>{
        if(isExportingImage){
            exportPaletteAsImage()
            setIsExportingImage(false)
        }
    }, [isExportingImage])


    function handleClickExportColorPaletteText():void{
        let content:string = '';
        const paletteLastIdx:number = paletteColors.length - 1;

        paletteColors.forEach((gradient, gradientIdx)=>{
            const gradientLastIdx:number = gradient.length - 1;

            gradient.forEach((color, colorIdx)=>{
                content = content.concat(hslToHex(color));
                if(colorIdx !== gradientLastIdx){ content = content.concat("-"); }
            })
            
            if(gradientIdx !== paletteLastIdx){ content = content.concat("/"); }
        })

        // resultado: #ff0000-#ff0000-#ff0000/#00ff00-#00ff00-#00ff00/#0000ff-#0000ff-#0000ff

        const blob:Blob = new Blob([content], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = 'ColorPalette.txt';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }


    function handleClickImportColorPalette():void{
        if(inputImportPaletteRef.current !== null){ inputImportPaletteRef.current.click(); }
        else{ console.error("ref to input is null"); }
    }


    function importPalette(event:React.ChangeEvent<HTMLInputElement>):void{
        if (event.target.files && event.target.files[0]) {
            const file:File = event.target.files[0];
            if(file){
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const text = fileReader.result as string;
                    
                    // Divide o texto em linhas
                    const lines:string[] = text.split("/"); // fica em formato ['#xxx-#xxx-#xxx', '#xxx-#xxx-#xxx']
                    const newColorPalette:HslColor[][] = [];
                    let currentFreeIdx:number = 0;
                    lines.forEach((gradient:string)=>{
                        newColorPalette.push([]); // adicionando o array do novo gradiente q sera adicionado na paleta
                        gradient.split("-").forEach((color:string)=>{ // fica em formato ['#xxx', '#xxx', '#xxx']
                            if(color !== ''){ newColorPalette[currentFreeIdx].push(hexToHsl(color)); }
                        })
                        currentFreeIdx += 1;
                    })
                    
                    setPaletteColors(newColorPalette);
                };
                fileReader.readAsText(file);
            }
        }


    }


    return(
        <div className='main-page__mini-section'>
            <p className='main-page__text-section'>Palette:</p>

            <div className='flex gap-1 items-center mb-2'>
                <div className='button-01' onClick={handleClickAddToColorPalette}>
                    <BiBookAdd  />
                </div>
                <p>Add Current Gradient To Palette</p>
            </div>

            {
                paletteColors.length > 0 &&

                <div className='flex flex-wrap flex-col gap-1' ref={paletteDivRef}>
                    {
                        paletteColors.map((gradient, key)=>{
                            return(
                                <div key={key} className='flex gap-1 items-start max-w-full'>
                                    {
                                        !isExportingImage &&
                                        <div className='button-01 !bg-red-600' onClick={()=>{handleClickRemoveColorGradient(key)}}>
                                            <MdDeleteOutline />
                                        </div>
                                    }
                                    <div className='flex max-w-full overflow-x-auto'>
                                        {
                                            gradient.map((color, key2)=>{
                                                return <ColorBox key={key2} hslColor={color} hexColor={hslToHex(color)} hasShadow={false} handleChangeCurrentColor={handleChangeCurrentColor} />
                                            })
                                        }
                                    </div>
                                </div>   
                            )
                        })
                    }
                </div>
            }

            {
                paletteColors.length > 0 &&
                <>
                    <div className='flex gap-1 items-center mt-4'>
                        <div className='button-01' onClick={handleClickExportColorPaletteImage}>
                            <BiExport  />
                        </div>
                        <p>Export Color Palette (.png)</p>
                    </div>

                    <div className='flex gap-1 items-center'>
                        <div className='button-01' onClick={handleClickExportColorPaletteText}>
                            <BiExport  />
                        </div>
                        <p>Export Color Palette (.txt)</p>
                    </div>
                </>
            }

            <div className='flex gap-1 items-center'>
                <div className='button-01' onClick={handleClickImportColorPalette}>
                    <BiImport />
                    <input type='file' accept='.txt' style={{display: 'none'}} ref={inputImportPaletteRef} onChange={importPalette} />
                </div>
                    
                <p>Import Color Palette</p>
            </div>
        </div>
    )
}