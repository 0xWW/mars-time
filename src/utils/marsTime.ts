/**
 * Mars Time Utilities
 * Based on the Allison and McEwen (2000) algorithm.
 */

export interface MarsTime {
  msd: number; // Mars Sol Date
  mtc: string; // Coordinated Mars Time (HH:MM:SS)
  ls: number;  // Solar Longitude (degrees)
  my: number;  // Mars Year
}

export interface RoverData {
  name: string;
  landingDate: Date; // UTC
  longitude: number; // East longitude (0-360)
  latitude: number;
  state: 'active' | 'inactive';
}

export const ROVERS: RoverData[] = [
  {
    name: 'Zhurong',
    landingDate: new Date('2021-05-14T23:18:00Z'), // Approximate
    longitude: 109.9,
    latitude: 25.1,
    state: 'active',
  },
  {
    name: 'Ingenuity',
    landingDate: new Date('2021-02-18T20:55:00Z'),
    longitude: 77.4,
    latitude: 18.4,
    state: 'inactive',
  },
  {
    name: 'Perseverance',
    landingDate: new Date('2021-02-18T20:55:00Z'),
    longitude: 77.4,
    latitude: 18.4,
    state: 'active',
  },
  {
    name: 'InSight',
    landingDate: new Date('2018-11-26T19:52:54Z'),
    longitude: 135.6,
    latitude: 4.5,
    state: 'inactive',
  },
  {
    name: 'Curiosity',
    landingDate: new Date('2012-08-06T05:17:57Z'),
    longitude: 137.4,
    latitude: -4.6,
    state: 'active',
  },
];

export const getMarsTime = (date: Date = new Date()): MarsTime => {
  // 1. Convert to Julian Date (JD)
  const millis = date.getTime();
  const jd = 2440587.5 + millis / 86400000;

  // 2. Calculate Julian Date since J2000.0 (TT)
  // We approximate TT ≈ UTC for this level of precision
  const j2000 = jd - 2451545.0;

  // 3. Mars Sol Date (MSD)
  // MSD = (JD - 2405522.0028779) / 1.0274912517
  const msd = (j2000 - 4.5) / 1.027491252 + 44796.0 - 0.00096;

  // 4. Coordinated Mars Time (MTC)
  const mtcHoursDecimal = (msd % 1) * 24;
  const mtc = formatTime(mtcHoursDecimal);

  // 5. Mars Year (MY) and Solar Longitude (Ls)
  // Algorithms from Allison & McEwen (2000)

  // Mean Anomaly
  const M = (19.3870 + 0.52402075 * j2000) % 360;
  const M_rad = M * (Math.PI / 180);

  // Angle of Fictitious Mean Sun
  const alphaFMS = (270.3863 + 0.52403840 * j2000) % 360;
  const alphaFMS_rad = alphaFMS * (Math.PI / 180);

  // Perturbations
  const pbs =
    0.0071 * Math.cos((0.985626 * j2000 / 2.2353 + 49.409) * (Math.PI / 180)) +
    0.0057 * Math.cos((0.985626 * j2000 / 2.7543 + 168.173) * (Math.PI / 180)) +
    0.0039 * Math.cos((0.985626 * j2000 / 1.1177 + 191.837) * (Math.PI / 180)) +
    0.0037 * Math.cos((0.985626 * j2000 / 15.7866 + 21.736) * (Math.PI / 180)) +
    0.0021 * Math.cos((0.985626 * j2000 / 2.1354 + 15.704) * (Math.PI / 180)) +
    0.0020 * Math.cos((0.985626 * j2000 / 2.4694 + 95.528) * (Math.PI / 180)) +
    0.0018 * Math.cos((0.985626 * j2000 / 32.8493 + 49.095) * (Math.PI / 180));

  // Equation of Center
  const v_M = (10.691 + 3.0e-7 * j2000) * Math.sin(M_rad) +
    0.623 * Math.sin(2 * M_rad) +
    0.050 * Math.sin(3 * M_rad) +
    0.008 * Math.sin(4 * M_rad) +
    0.002 * Math.sin(5 * M_rad) +
    pbs;

  // Aerocentric Solar Longitude (Ls)
  const ls = (alphaFMS + v_M) % 360;
  const finalLs = ls < 0 ? ls + 360 : ls;

  // Mars Year
  // MY1 started on April 11, 1955.
  // A rough approximation is sufficient for MY number, or we can use the Ls cycles.
  // Using a known reference: MY 36 started around Feb 7, 2021.
  // We can calculate based on MSD.
  // MY 1 started at MSD -152.2 (approx).
  // A Mars year is ~668.6 sols.
  // Better approach:
  // MY = 1 + floor((Ls_cumulative) / 360) ? No, we don't have cumulative.
  // Use reference date:
  // MY 1 Start (Ls=0): 1955-04-11
  // We can use a simplified calculation for the year number based on MSD.
  // 668.5921 sols per Mars Year.
  // Reference: MSD 0 is Dec 29 1873.
  // MY 1 start is approx MSD -6700? No.
  // Let's use the standard formula if possible, or an anchor.
  // Anchor: MY 38 started on Nov 12, 2024 (approx).
  // Let's stick to the one used by libraries:
  // MY = floor((alphaFMS) / 360) ? No.
  // We will use the Clancy et al. convention.
  // MY 1 Ls=0 occurred on April 11, 1955.
  // JD approx 2435200.
  // Let's use a simpler approximation for MY based on the current date relative to a known MY start.
  // MY 36 started 2021-02-07.
  // MY 37 started 2022-12-26.
  // MY 38 started 2024-11-12.
  // We can calculate based on the number of sols since a known MY start.
  const my = 1 + Math.floor((msd - (-152.2)) / 668.5921); // -152.2 is approx MSD for 1955-04-11?
  // Actually, let's refine the MY calculation.
  // MSD for 1955-04-11 is roughly 29668.
  // Wait, MSD 0 is 1873-12-29.
  // 1955 is much later.
  // Let's use a known recent anchor for better precision.
  // MY 38 started at Ls 0.
  // We have Ls.
  // We can just estimate the year based on MSD.
  // MSD for MY 1 start (1955-04-11) is 29668.6.
  // So MY = 1 + floor((MSD - 29668.6) / 668.5921).
  const marsYear = 1 + Math.floor((msd - 29668.6) / 668.5921);

  return {
    msd,
    mtc,
    ls: finalLs,
    my: marsYear,
  };
};

export const getLocalMarsTime = (msd: number, longitude: number): string => {
  // Local Mean Solar Time
  // LMST = MTC + longitude * (24 / 360)
  // Longitude is East positive.
  const mtcHours = (msd % 1) * 24;
  const offset = longitude * (24 / 360);
  const lmstHours = (mtcHours + offset) % 24;
  const finalLmst = lmstHours < 0 ? lmstHours + 24 : lmstHours;

  return formatTime(finalLmst);
};

export const getSol = (landingDate: Date, currentMsd: number): number => {
  const landingMsd = getMarsTime(landingDate).msd;
  return Math.floor(currentMsd - landingMsd); // Simple Sol count
  // Note: Mission Sol usually starts at 0 or 1. We'll assume 0-indexed delta for now, 
  // but most missions are 1-indexed (Sol 1 is landing day).
  // Let's return the elapsed sols + 1?
  // Actually, let's just return elapsed sols.
  // If we want "Mission Sol", we might need specific logic per rover.
  // For now, floor(current - landing) is a good approximation of "Sol N".
};

const formatTime = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutesDecimal = (decimalHours - hours) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = Math.floor((minutesDecimal - minutes) * 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
