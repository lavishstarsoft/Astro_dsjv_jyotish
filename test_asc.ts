import swisseph from 'swisseph';

// Set Lahiri
swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

// 21 June 1990, 17:52 IST -> 12:22 UTC -> 12.36666 UTC
const jd = swisseph.swe_julday(1990, 6, 21, 12.366666666, swisseph.SE_GREG_CAL);
console.log("Julian Day:", jd);

// Planets
const flags = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
const sun = swisseph.swe_calc_ut(jd, swisseph.SE_SUN, flags) as any;
console.log("Sun Longitude:", sun.longitude, "Sign:", Math.floor(sun.longitude / 30) + 1);

// Ascendant
const houses = swisseph.swe_houses(jd, 16.5033, 80.6465, 'P') as any;
const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
console.log("Tropical Asc:", houses.ascendant);
console.log("Ayanamsa:", ayanamsa);
let sidAsc = houses.ascendant - ayanamsa;
if (sidAsc < 0) sidAsc += 360;
console.log("Sidereal Asc:", sidAsc, "Sign:", Math.floor(sidAsc / 30) + 1);

