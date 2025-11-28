import React, { useEffect, useState } from 'react';
import { getMarsTime } from '../utils/marsTime';

export default function MarsTimeDisplay() {
    const [marsTime, setMarsTime] = useState(getMarsTime());
    const [earthTime, setEarthTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setMarsTime(getMarsTime());
            setEarthTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const earthTimeStr = earthTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
            {/* Main Mars Time */}
            <div className="mb-12 p-8">
                <h2 className="text-orange-400 text-lg tracking-[0.5em] uppercase mb-2 font-bold drop-shadow-md">Mars Time</h2>
                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-red-600 drop-shadow-[0_0_25px_rgba(234,88,12,0.8)]">
                    {marsTime.mtc}
                </h1>
                <div className="flex items-center justify-center gap-4 mt-4 text-orange-200 font-bold drop-shadow-md">
                    <span className="text-xl tracking-widest">SOL {marsTime.msd.toFixed(4)}</span>
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"></span>
                    <span className="text-xl tracking-widest">MTC</span>
                </div>
            </div>

            {/* Earth Time */}
            <div className="mt-8 flex flex-col items-center gap-1 px-6 py-3">
                <div className="text-cyan-400 text-xs tracking-[0.2em] uppercase font-semibold drop-shadow-md">Earth Time • {timeZone}</div>
                <div className="text-3xl text-white font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {earthTimeStr}
                </div>
            </div>
        </div>
    );
}
