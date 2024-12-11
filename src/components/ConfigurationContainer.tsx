
interface ConfigurationContainerProps {
    label:string;
    value:number;
    setterFunction: (_direction:number) => void;
}



export default function ConfigurationContainer({label, value, setterFunction} : ConfigurationContainerProps){


    return(
        <div className='main-page__mini-section'>
            
            <p className='text-sm font-pixel'>{ label }</p>
            
            <div className='flex gap-2 items-center'>
                <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{setterFunction(-1)}}>&minus;</button>
                <p className='text-center text-xl font-pixel'>{value}</p>
                <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{setterFunction(+1)}}>+</button>
            </div>

        </div>
    )
}