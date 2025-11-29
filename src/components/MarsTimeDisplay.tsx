import React, { useEffect, useState } from 'react';
import { getMarsTime, MarsTime } from '../utils/marsTime';

export default function MarsTimeDisplay() {
    const [marsTime, setMarsTime] = useState<MarsTime>(getMarsTime());
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
        <div className="flex flex-col items-center justify-center w-full text-center z-10 relative">
            {/* Main Mars Time */}
            <div className="mb-8">
                <h1 className="text-orange-500 font-bold text-6xl md:text-8xl tracking-tight mb-2 font-mono">
                    {marsTime.mtc}
                    <span className="text-2xl md:text-3xl ml-4 text-zinc-400 font-normal">MTC</span>
                </h1>

                <div className="flex items-center justify-center gap-12 text-2xl md:text-3xl font-light text-zinc-300 font-mono">
                    <div>
                        <span className="text-zinc-500 mr-2">L<sub>s</sub></span>
                        {marsTime.ls.toFixed(4)}°
                    </div>
                    <div>
                        <span className="text-zinc-500 mr-2">MY</span>
                        {marsTime.my}
                    </div>
                </div>
            </div>

            {/* Earth Time */}
            <div className="mt-4 flex flex-col items-center gap-1">
                <div className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-semibold">Earth Time • {timeZone}</div>
                <div className="text-xl text-zinc-400 font-mono">
                    {earthTimeStr}
                </div>
            </div>
        </div>
    );
}
