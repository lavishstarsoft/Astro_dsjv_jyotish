/**
 * Kubera Pada calculation.
 *
 * Formula:
 *   kuberaPada = (moonPada × secondLordPada) mod 108
 *   if the remainder is 0, treat it as 108 (the 108th pada), because
 *   the pada range is 1..108.
 *
 * moonPada / secondLordPada / kuberaPada are all in the 1..108 numbering
 * (27 nakshatras × 4 padas). Overall pada = nakshatraIndex(0..26) * 4 + padaInNakshatra(1..4).
 */

const NAKSHATRA_SPAN = 13 + 1 / 3;

/** Ruler of each rasi (1..12). Names match the planet names used in ephemeris.ts. */
export const SIGN_LORDS: Record<number, string> = {
  1: 'Mars',      // Mesham
  2: 'Venus',     // Vrushabham
  3: 'Mercury',   // Mithunam
  4: 'Moon',      // Karkataka
  5: 'Sun',       // Simham
  6: 'Mercury',   // Kanya
  7: 'Venus',     // Tula
  8: 'Mars',      // Vrischika
  9: 'Jupiter',   // Dhanus
  10: 'Saturn',   // Makara
  11: 'Saturn',   // Kumbha
  12: 'Jupiter'   // Meena
};

/** Convert an ecliptic longitude (0..360) to the 1..108 overall pada. */
export function longitudeToOverallPada(longitude: number): number {
  // Avoid ((x % 360) + 360) % 360 — the +360 addition loses float precision
  // at nakshatra boundaries (e.g. exactly 13°20') and can bump a pada down by 1.
  let wrapped = longitude % 360;
  if (wrapped < 0) wrapped += 360;
  const nIdx = Math.floor(wrapped / NAKSHATRA_SPAN);           // 0..26
  const posInNakshatra = wrapped - nIdx * NAKSHATRA_SPAN;
  const padaInNakshatra = Math.floor(posInNakshatra / (NAKSHATRA_SPAN / 4)) + 1; // 1..4
  return nIdx * 4 + padaInNakshatra;                            // 1..108
}

/** Given ascendant sign (1..12), return the sign of the 2nd house (1..12). */
export function secondHouseSign(ascendantSign: number): number {
  return ((ascendantSign - 1 + 1) % 12) + 1; // (ascSign % 12) + 1
}

export interface KuberaPadaInput {
  moonLongitude: number;
  ascendantSign: number;                        // 1..12
  planets: Array<{ name: string; longitude: number }>;
}

export interface KuberaPadaResult {
  moonPada: number;                             // 1..108
  moonNakshatraIndex: number;                   // 0..26
  moonPadaInNakshatra: number;                  // 1..4

  secondHouseSign: number;                      // 1..12
  secondLordName: string;                       // e.g. 'Jupiter'
  secondLordLongitude: number;
  secondLordPada: number;                       // 1..108
  secondLordNakshatraIndex: number;             // 0..26
  secondLordPadaInNakshatra: number;            // 1..4

  product: number;                              // moonPada × secondLordPada
  divisor: 108;
  quotient: number;                             // floor(product / 108)
  remainder: number;                            // product mod 108 (0..107)
  kuberaPada: number;                           // 1..108 (0 remainder -> 108)
}

/**
 * Pure function — compute Kubera Pada using ONLY values already
 * available from the app's existing horoscope calculation. Does not
 * re-do any astronomical calc; it just picks the required planet
 * longitudes and applies the formula.
 */
export function computeKuberaPada(input: KuberaPadaInput): KuberaPadaResult {
  const { moonLongitude, ascendantSign, planets } = input;

  // Moon Pada (1..108) from Moon's longitude
  let moonWrapped = moonLongitude % 360;
  if (moonWrapped < 0) moonWrapped += 360;
  const moonNakshatraIndex = Math.floor(moonWrapped / NAKSHATRA_SPAN);
  const moonPadaInNakshatra = Math.floor(
    (moonWrapped - moonNakshatraIndex * NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)
  ) + 1;
  const moonPada = moonNakshatraIndex * 4 + moonPadaInNakshatra;

  // 2nd house sign and its lord
  const secondSign = secondHouseSign(ascendantSign);
  const secondLordName = SIGN_LORDS[secondSign];

  const lordPlanet = planets.find(p => p.name === secondLordName);
  if (!lordPlanet) {
    throw new Error(`2nd house lord '${secondLordName}' not found in planets array`);
  }

  let lordWrapped = lordPlanet.longitude % 360;
  if (lordWrapped < 0) lordWrapped += 360;
  const lordNakshatraIndex = Math.floor(lordWrapped / NAKSHATRA_SPAN);
  const lordPadaInNakshatra = Math.floor(
    (lordWrapped - lordNakshatraIndex * NAKSHATRA_SPAN) / (NAKSHATRA_SPAN / 4)
  ) + 1;
  const secondLordPada = lordNakshatraIndex * 4 + lordPadaInNakshatra;

  // Kubera Pada formula
  const product = moonPada * secondLordPada;
  const divisor = 108 as const;
  const quotient = Math.floor(product / divisor);
  const remainder = product % divisor;              // 0..107
  const kuberaPada = remainder === 0 ? 108 : remainder;

  return {
    moonPada,
    moonNakshatraIndex,
    moonPadaInNakshatra,
    secondHouseSign: secondSign,
    secondLordName,
    secondLordLongitude: lordPlanet.longitude,
    secondLordPada,
    secondLordNakshatraIndex: lordNakshatraIndex,
    secondLordPadaInNakshatra: lordPadaInNakshatra,
    product,
    divisor,
    quotient,
    remainder,
    kuberaPada
  };
}

/**
 * Pure formula variant — useful for unit tests.
 * Handles the 0-remainder rule explicitly.
 */
export function kuberaPadaFromPadas(moonPada: number, secondLordPada: number): number {
  const remainder = (moonPada * secondLordPada) % 108;
  return remainder === 0 ? 108 : remainder;
}
