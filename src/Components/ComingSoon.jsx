import React from 'react';

export default function ComingSoon() {
    return (
        <div className="font-medium flex flex-col gap-0 items-center justify-center h-11/12 ">
            <h1 className='text-[180px] leading-31 w-[60%] text-left ' >C<span className='text-red-500'>O</span>MING</h1>  
            <h1 className='text-[180px] leading-31 w-[62%] text-right  '>S<span className='text-red-500'>O</span><span className='text-red-500'>O</span>N</h1>  
            <p className='text-2xl absolute left-118 top-122 font-albert-sans italic'>- A new design experience is on its way</p>   
            <p className='text-2xl absolute right-118 top-153 font-albert-sans italic'>Click to solve our creative puzzle and piece <br /> together what is coming soon.</p>     
        </div>
    );
}