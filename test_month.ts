import swisseph from 'swisseph';
const jd1 = swisseph.swe_julday(1990, 6, 1, -3.5, swisseph.SE_GREG_CAL);
const jd2 = swisseph.swe_julday(1990, 6, 0, 20.5, swisseph.SE_GREG_CAL);
const jd3 = swisseph.swe_julday(1990, 5, 31, 20.5, swisseph.SE_GREG_CAL);
console.log("JD1 (June 1, -3.5h):", jd1);
console.log("JD2 (June 0, 20.5h):", jd2);
console.log("JD3 (May 31, 20.5h):", jd3);
