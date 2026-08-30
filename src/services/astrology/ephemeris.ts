import swisseph from 'swisseph';

// Optional: If you download exact ephemeris data files, you can point to them:
// swisseph.swe_set_ephe_path('/absolute/path/to/ephe');

export interface PlanetPosition {
  name: string;
  longitude: number;     // Absolute degrees from 0-360
  latitude: number;
  speed: number;
  isRetrograde: boolean;
  zodiacSign: number;    // 1 to 12 (Aries to Pisces)
  degreeInSign: number;  // 0-30 degrees
}

const PLANETS = {
  Sun: swisseph.SE_SUN,
  Moon: swisseph.SE_MOON,
  Mars: swisseph.SE_MARS,
  Mercury: swisseph.SE_MERCURY,
  Jupiter: swisseph.SE_JUPITER,
  Venus: swisseph.SE_VENUS,
  Saturn: swisseph.SE_SATURN,
  Rahu: swisseph.SE_TRUE_NODE, // Mean Node or True Node
};

export class AstrologyEngine {
  
  /**
   * Convert UTC Date and Time to Julian Day Number
   */
  static getJulianDay(year: number, month: number, day: number, hour: number): number {
    return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
  }

  /**
   * Calculate Planet Positions using Lahiri Ayanamsa (Vedic standard)
   */
  static getPlanetaryPositions(julianDay: number): PlanetPosition[] {
    const positions: PlanetPosition[] = [];
    // SEFLG_SIDEREAL = use sidereal zodiac
    // SEFLG_SPEED = calculate speed (needed for retrograde)
    const flags = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED;
    
    // Set Lahiri Ayanamsa
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

    for (const [name, seId] of Object.entries(PLANETS)) {
      // Get the calculation object and typecast it because TS union types
      // for swe_calc_ut include equatorial coordinates which don't have longitude
      const calc = swisseph.swe_calc_ut(julianDay, seId, flags) as any;
      
      const zodiacSign = Math.floor(calc.longitude / 30) + 1;
      const degreeInSign = calc.longitude % 30;

      positions.push({
        name,
        longitude: calc.longitude,
        latitude: calc.latitude,
        speed: calc.longitudeSpeed,
        isRetrograde: calc.longitudeSpeed < 0,
        zodiacSign,
        degreeInSign
      });
    }

    // Add Ketu (always 180 degrees opposite to Rahu)
    const rahu = positions.find(p => p.name === 'Rahu');
    if (rahu) {
      const ketuLong = (rahu.longitude + 180) % 360;
      positions.push({
        name: 'Ketu',
        longitude: ketuLong,
        latitude: -rahu.latitude,
        speed: rahu.speed,
        isRetrograde: rahu.isRetrograde,
        zodiacSign: Math.floor(ketuLong / 30) + 1,
        degreeInSign: ketuLong % 30
      });
    }

    return positions;
  }

  static getAscendant(julianDay: number, lat: number, lon: number): number {
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    const houses = swisseph.swe_houses(julianDay, lat, lon, 'P') as any;
    const ayanamsa = swisseph.swe_get_ayanamsa_ut(julianDay);
    let siderealAscendant = (houses.ascendant || 0) - ayanamsa;
    if (siderealAscendant < 0) {
      siderealAscendant += 360;
    }
    return siderealAscendant;
  }

  /**
   * Bhava Chalita (Equal House method): each bhava is exactly 30 degrees
   * starting from the Ascendant. A planet's bhava = floor((longitude - asc) / 30) + 1.
   * For South Indian display, the planet is placed in the SIGN that owns that bhava
   * (bhava N -> (N-1)th sign from the Ascendant sign).
   * degreeInSign is preserved as the planet's actual rasi degree so users can still
   * see the true position within its zodiac sign.
   */
  static getBhavaChalita(ascendantDegree: number, rasiPlanets: PlanetPosition[]): PlanetPosition[] {
    const ascSign = Math.floor(ascendantDegree / 30) + 1;

    return rasiPlanets.map(p => {
      const diff = ((p.longitude - ascendantDegree) % 360 + 360) % 360;
      const bhavaNumber = Math.floor(diff / 30) + 1; // 1..12
      const bhavaSign = ((ascSign - 1 + bhavaNumber - 1) % 12) + 1;
      return {
        ...p,
        zodiacSign: bhavaSign
      };
    });
  }
}
