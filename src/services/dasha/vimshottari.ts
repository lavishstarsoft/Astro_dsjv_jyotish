export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  antardashas?: DashaPeriod[];
}

// Vimshottari Mahadasha durations in years
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const PLANET_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

/**
 * Total Vimshottari Dasha cycle duration is 120 years.
 */
const TOTAL_YEARS = 120;

export class DashaEngine {
  /**
   * Calculates the Vimshottari Dasha based on Moon's longitude.
   * @param moonLongitude Absolute longitude of Moon (0-360)
   * @param dateOfBirth Date of birth
   */
  static calculateVimshottari(moonLongitude: number, dateOfBirth: Date): DashaPeriod[] {
    // 1 Nakshatra = 13 degrees 20 minutes = 13.333333 degrees
    const nakshatraSpan = 13 + 1 / 3;
    
    // Total Nakshatras = 27
    const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan);
    
    // Find the starting Dasha ruler based on Nakshatra index
    const startingPlanetIndex = nakshatraIndex % 9;
    
    // Exact position of moon within the Nakshatra
    const moonPassedInNakshatra = moonLongitude % nakshatraSpan;
    const fractionPassed = moonPassedInNakshatra / nakshatraSpan;
    const fractionRemaining = 1 - fractionPassed;

    const startingPlanet = PLANET_ORDER[startingPlanetIndex];
    const firstDashaTotalYears = DASHA_YEARS[startingPlanet];
    
    // Remaining years for the first Dasha
    const firstDashaRemainingYears = firstDashaTotalYears * fractionRemaining;

    return this.generateDashaSequence(startingPlanetIndex, firstDashaRemainingYears, dateOfBirth);
  }

  private static generateDashaSequence(startIndex: number, firstDashaRemaining: number, dob: Date): DashaPeriod[] {
    const dashas: DashaPeriod[] = [];
    let currentDate = new Date(dob);

    for (let i = 0; i < 9; i++) {
      const pIndex = (startIndex + i) % 9;
      const planet = PLANET_ORDER[pIndex];
      const durationYears = (i === 0) ? firstDashaRemaining : DASHA_YEARS[planet];

      // Convert years to milliseconds (ignoring leap year variations for simplicity in this MVP)
      const durationMs = durationYears * 365.25 * 24 * 60 * 60 * 1000;
      const endDate = new Date(currentDate.getTime() + durationMs);

      // We can also recursively calculate Antardashas (sub-periods) here
      const antardashas = this.calculateAntardasha(planet, currentDate, durationYears);

      dashas.push({
        planet,
        startDate: new Date(currentDate),
        endDate,
        antardashas,
      });

      currentDate = endDate;
    }

    return dashas;
  }

  private static calculateAntardasha(mahadashaPlanet: string, mahadashaStart: Date, mahadashaDuration: number): DashaPeriod[] {
    const antardashas: DashaPeriod[] = [];
    const startIndex = PLANET_ORDER.indexOf(mahadashaPlanet);
    let currentDate = new Date(mahadashaStart);

    for (let i = 0; i < 9; i++) {
      const pIndex = (startIndex + i) % 9;
      const antardashaPlanet = PLANET_ORDER[pIndex];
      
      // Antardasha duration = (Mahadasha Years * Antardasha Planet Years) / 120
      const adYears = (DASHA_YEARS[mahadashaPlanet] * DASHA_YEARS[antardashaPlanet]) / TOTAL_YEARS;
      
      // Scale if Mahadasha is partial (i.e. first one)
      const actualAdYears = adYears * (mahadashaDuration / DASHA_YEARS[mahadashaPlanet]);
      const durationMs = actualAdYears * 365.25 * 24 * 60 * 60 * 1000;
      
      const endDate = new Date(currentDate.getTime() + durationMs);

      antardashas.push({
        planet: antardashaPlanet,
        startDate: new Date(currentDate),
        endDate,
      });

      currentDate = endDate;
    }

    return antardashas;
  }
}
