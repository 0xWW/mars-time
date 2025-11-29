import React, { useEffect, useState } from 'react';
import { RoverData, getLocalMarsTime, getSol, getMarsTime } from '@/utils/marsTime';

interface RoverCardProps {
    rover: RoverData;
}

const RoverCard: React.FC<RoverCardProps> = ({ rover }) => {
    const [time, setTime] = useState<string>('');
    const [sol, setSol] = useState<number>(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const marsTime = getMarsTime(now);

            setTime(getLocalMarsTime(marsTime.msd, rover.longitude));
            setSol(getSol(rover.landingDate, marsTime.msd));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [rover]);

    return (
        <div className="flex flex-col items-center justify-center text-center min-w-[200px]">
            <h3 className={`text-xl font-bold mb-2 ${rover.name === 'Zhurong' ? 'text-orange-500' : 'text-orange-400'}`}>
                {rover.name}
            </h3>
            <div className="text-sm text-zinc-400 mb-1">Sol: <span className="text-orange-500 font-mono">{sol}</span></div>
            <div className="text-3xl font-mono font-light text-white mb-3 tracking-wider">
                {time}
            </div>
            <div className="text-xs text-zinc-500 font-mono">
                Lat: {rover.latitude}°N <br />
                Lon: {rover.longitude}°E
            </div>
        </div>
    );
};

export default RoverCard;
