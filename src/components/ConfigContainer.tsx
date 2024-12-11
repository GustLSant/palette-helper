
interface ConfigContainerProps {
    label:string;
    type:string;
    value:number;
    setterFunction: (_type:string, _increment:number) => void;
    increment:number;
}



export default function ConfigContainer({label, type, value, setterFunction, increment} : ConfigContainerProps){


    return(
        <div className='main-page__mini-section'>
            
            <p className='text-sm font-pixel'>{ label }</p>
            
            <div className='flex gap-2 items-center'>
                <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{setterFunction(type, -increment)}}>&minus;</button>
                <p className='text-center text-xl font-pixel'>{value}</p>
                <button className='bg-gray-400 basis-8 text-white text-2xl' onClick={()=>{setterFunction(type, increment)}}>+</button>
            </div>

        </div>
    )
}