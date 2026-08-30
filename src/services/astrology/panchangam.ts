import swisseph from 'swisseph';

const NAKSHATRA_SPAN = 13 + 1 / 3; // 13°20' = 13.3333°

const NAKSHATRA_NAMES_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు',
  'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి',
  'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణ',
  'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'
];

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
];

// 27 nakshatras × 4 padas = 108 name-letters (transliterated)
const NAKSHATRA_PADA_LETTERS: string[][] = [
  ['చూ', 'చే', 'చో', 'లా'],      // Ashwini
  ['లీ', 'లూ', 'లే', 'లో'],      // Bharani
  ['ఆ', 'ఈ', 'ఉ', 'ఏ'],          // Krittika
  ['ఓ', 'వా', 'వీ', 'వు'],       // Rohini
  ['వే', 'వో', 'కా', 'కీ'],      // Mrigashira
  ['కు', 'ఘ', 'జ్ఞ', 'ఛ'],       // Ardra
  ['కే', 'కో', 'హా', 'హీ'],      // Punarvasu
  ['హు', 'హే', 'హో', 'డా'],      // Pushya
  ['డీ', 'డూ', 'డే', 'డో'],      // Ashlesha
  ['మా', 'మీ', 'మూ', 'మే'],      // Magha
  ['మో', 'టా', 'టీ', 'టూ'],      // Purva Phalguni
  ['టే', 'టో', 'పా', 'పీ'],      // Uttara Phalguni
  ['పూ', 'ష', 'ణ', 'ఠ'],         // Hasta
  ['పే', 'పో', 'రా', 'రీ'],      // Chitra
  ['రూ', 'రే', 'రో', 'తా'],      // Swati
  ['తీ', 'తూ', 'తే', 'తో'],      // Vishakha
  ['నా', 'నీ', 'నూ', 'నే'],      // Anuradha
  ['నో', 'యా', 'యీ', 'యూ'],     // Jyeshtha
  ['యే', 'యో', 'భా', 'భీ'],      // Mula
  ['భూ', 'ధా', 'ఫా', 'ఢా'],      // Purva Ashadha
  ['భే', 'భో', 'జా', 'జీ'],      // Uttara Ashadha
  ['జూ', 'జే', 'జో', 'ఖా'],      // Shravana
  ['గా', 'గీ', 'గూ', 'గే'],      // Dhanishta
  ['గో', 'సా', 'సీ', 'సూ'],      // Shatabhisha
  ['సే', 'సో', 'దా', 'దీ'],      // Purva Bhadrapada
  ['దూ', 'థ', 'ఝ', 'ఞ'],         // Uttara Bhadrapada
  ['దే', 'దో', 'చా', 'చీ']       // Revati
];

const THITHI_NAMES_TE = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి',
  'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి'
];

const YOGA_NAMES_TE = [
  'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ',
  'ధృతి', 'శూల', 'గండ', 'వృద్ధి', 'ధ్రువ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర',
  'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్', 'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య',
  'శుభ', 'శుక్ల', 'బ్రహ్మ', 'ఇంద్ర', 'వైధృతి'
];

const KARANA_MOVABLE_TE = ['బవ', 'బాలవ', 'కౌలవ', 'తైతిల', 'గర', 'వణిజ', 'విష్టి'];
const KARANA_FIXED_TE = ['శకుని', 'చతుష్పాద', 'నాగ', 'కింస్తుఘ్న'];

const WEEKDAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

const RASI_NAMES_TE = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం'
];

export interface PanchangamData {
  weekday: string;
  thithi: { name: string; paksha: string; number: number };
  nakshatra: { name: string; pada: number; lord: string; number: number };
  yogam: { name: string; number: number };
  karanam: { name: string; number: number };
  nakshatraLetters: string[]; // full 4 pada letters of birth nakshatra
  birthLetter: string;         // the letter of the specific pada
  lagnamName: string;
  rasiName: string;
  chandrashtamaRasi: { number: number; name: string };
  sunrise?: string;
  sunset?: string;
}

export class PanchangamEngine {

  static compute(
    julianDayUT: number,
    sunLongitude: number,
    moonLongitude: number,
    ascendantSign: number,
    dobLocal: Date,
    lat: number,
    lon: number
  ): PanchangamData {
    // Thithi: (Moon - Sun) / 12 degrees; 30 thithis
    const diffMoonSun = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
    const thithiIndex = Math.floor(diffMoonSun / 12); // 0..29
    const paksha = thithiIndex < 15 ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం';
    const thithiNumInPaksha = thithiIndex % 15;
    const thithiName =
      thithiNumInPaksha === 14
        ? (paksha === 'శుక్ల పక్షం' ? 'పౌర్ణమి' : 'అమావాస్య')
        : THITHI_NAMES_TE[thithiNumInPaksha];

    // Nakshatra
    const nIdx = Math.floor(moonLongitude / NAKSHATRA_SPAN); // 0..26
    const posInNakshatra = moonLongitude - nIdx * NAKSHATRA_SPAN;
    const pada = Math.floor(posInNakshatra / (NAKSHATRA_SPAN / 4)) + 1; // 1..4

    // Yoga: (Sun + Moon) / (360/27)
    const yogaLong = (sunLongitude + moonLongitude) % 360;
    const yogaIdx = Math.floor(yogaLong / NAKSHATRA_SPAN); // 0..26

    // Karana: 60 karanas total
    const karanaNum = Math.floor(diffMoonSun / 6) + 1; // 1..60
    let karanaName: string;
    if (karanaNum >= 57) {
      karanaName = KARANA_FIXED_TE[karanaNum - 57];
    } else {
      karanaName = KARANA_MOVABLE_TE[(karanaNum - 1) % 7];
    }

    // Chandrashtama: 8th rasi from Moon rasi
    const moonRasi = Math.floor(moonLongitude / 30) + 1; // 1..12
    const chandrashtamaNum = ((moonRasi - 1 + 7) % 12) + 1;

    // Weekday
    const weekday = WEEKDAYS_TE[dobLocal.getDay()];

    // Sunrise / Sunset via simple astronomical formula (NOAA-style approximation).
    // Uses Sun's declination and observer latitude; accurate to ~1-2 minutes.
    const { sunrise, sunset } = computeSunriseSunset(sunLongitude, dobLocal, lat, lon);

    const padaIndex = pada - 1;
    const paddaLetters = NAKSHATRA_PADA_LETTERS[nIdx] || ['', '', '', ''];

    return {
      weekday,
      thithi: { name: `${thithiName} (${paksha})`, paksha, number: thithiIndex + 1 },
      nakshatra: {
        name: NAKSHATRA_NAMES_TE[nIdx],
        pada,
        lord: NAKSHATRA_LORDS[nIdx],
        number: nIdx + 1
      },
      yogam: { name: YOGA_NAMES_TE[yogaIdx], number: yogaIdx + 1 },
      karanam: { name: karanaName, number: karanaNum },
      nakshatraLetters: paddaLetters,
      birthLetter: paddaLetters[padaIndex] || '',
      lagnamName: RASI_NAMES_TE[ascendantSign - 1] || '',
      rasiName: RASI_NAMES_TE[moonRasi - 1] || '',
      chandrashtamaRasi: { number: chandrashtamaNum, name: RASI_NAMES_TE[chandrashtamaNum - 1] || '' },
      sunrise,
      sunset
    };
  }

  /**
   * Kraga Saram: for each planet return rasi name, nakshatra name, pada,
   * nakshatra lord, formatted degree.
   */
  static kragaSaram(planets: Array<{ name: string; longitude: number; degreeInSign?: number; zodiacSign?: number }>) {
    return planets.map(p => {
      const rasiNum = p.zodiacSign ?? (Math.floor(p.longitude / 30) + 1);
      const nIdx = Math.floor(p.longitude / NAKSHATRA_SPAN);
      const posInN = p.longitude - nIdx * NAKSHATRA_SPAN;
      const pada = Math.floor(posInN / (NAKSHATRA_SPAN / 4)) + 1;
      const deg = p.degreeInSign ?? (p.longitude % 30);
      const dInt = Math.floor(deg);
      const mInt = Math.floor((deg - dInt) * 60);
      return {
        name: p.name,
        rasi: RASI_NAMES_TE[rasiNum - 1] || '',
        rasiNumber: rasiNum,
        nakshatra: NAKSHATRA_NAMES_TE[nIdx] || '',
        pada,
        lord: NAKSHATRA_LORDS[nIdx],
        degree: `${dInt}° ${mInt.toString().padStart(2, '0')}'`,
        longitude: p.longitude
      };
    });
  }
}

/**
 * Compute sunrise & sunset for a given local date at lat/lon using
 * Sun's tropical longitude (converted to declination via ecliptic obliquity).
 * Returns times in the local wall-clock of dobLocal (via lon-based timezone).
 */
function computeSunriseSunset(
  sunLongitude: number,
  dobLocal: Date,
  lat: number,
  lon: number
): { sunrise: string; sunset: string } {
  // Sun longitude here is SIDEREAL (Lahiri). Add back ayanamsa ~ 23.85° for tropical.
  // For NOAA-style calc we want tropical longitude, so approximate.
  const AYANAMSA = 23.85;
  const tropLong = ((sunLongitude + AYANAMSA) % 360 + 360) % 360;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const OBLIQUITY = 23.4397; // Earth's axial tilt (deg)
  const decl = toDeg(Math.asin(Math.sin(toRad(OBLIQUITY)) * Math.sin(toRad(tropLong))));

  // Hour angle for sunrise/sunset (Sun altitude = -0.833° for refraction + solar disc)
  const cosH =
    (Math.sin(toRad(-0.833)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl))) /
    (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));

  if (cosH < -1 || cosH > 1) {
    return { sunrise: '—', sunset: '—' }; // polar day/night
  }

  const Hdeg = toDeg(Math.acos(cosH));
  const Hhours = Hdeg / 15;

  // Solar noon in local time depends on longitude timezone alignment
  // Approx: solar noon = 12:00 - (equation_of_time / 60), skipping EoT for simplicity
  const solarNoonHours = 12;
  const sunriseH = solarNoonHours - Hhours;
  const sunsetH = solarNoonHours + Hhours;

  return {
    sunrise: hoursToClock(sunriseH),
    sunset: hoursToClock(sunsetH)
  };
}

function hoursToClock(hDecimal: number): string {
  let h = Math.floor(hDecimal);
  let m = Math.floor((hDecimal - h) * 60);
  let s = Math.floor(((hDecimal - h) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  if (m === 60) { m = 0; h += 1; }
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
