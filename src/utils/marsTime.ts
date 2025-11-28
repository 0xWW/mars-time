/**
 * Mars Time Utilities
 * Based on the Allison and McEwen (2000) algorithm.
 */

export interface MarsTime {
  msd: number; // Mars Sol Date
  mtc: string; // Coordinated Mars Time (HH:MM:SS)
}

export const getMarsTime = (date: Date = new Date()): MarsTime => {
  // 1. Convert to Julian Date (JD)
  const millis = date.getTime();
  const jd = 2440587.5 + millis / 86400000;

  // 2. Calculate Julian Date since J2000.0 (TT)
  // We approximate TT ≈ UTC for this level of precision, or add leap seconds if needed.
  // For a visual app, UTC is sufficient.
  const j2000 = jd - 2451545.0;

  // 3. Mars Sol Date (MSD)
  // MSD = (JD - 2405522.0028779) / 1.0274912517
  const msd = (j2000 - 4.5) / 1.027491252 + 44796.0 - 0.00096;

  // 4. Coordinated Mars Time (MTC)
  // MTC is the mean solar time at the prime meridian.
  // MTC = (MSD % 1) * 24 hours
  const mtcHoursDecimal = (msd % 1) * 24;
  
  const hours = Math.floor(mtcHoursDecimal);
  const minutesDecimal = (mtcHoursDecimal - hours) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    msd,
    mtc: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
};
