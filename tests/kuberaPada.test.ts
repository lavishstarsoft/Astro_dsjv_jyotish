/**
 * Kubera Pada tests. Run with:  npx ts-node tests/kuberaPada.test.ts
 * Exit status is non-zero if any assertion fails.
 */
import {
  kuberaPadaFromPadas,
  computeKuberaPada,
  longitudeToOverallPada,
  secondHouseSign,
  SIGN_LORDS
} from '../src/services/astrology/kuberaPada';

let passed = 0;
let failed = 0;

function eq(actual: any, expected: any, label: string) {
  if (actual === expected) {
    console.log(`PASS  ${label} = ${actual}`);
    passed++;
  } else {
    console.log(`FAIL  ${label}  expected ${expected}, got ${actual}`);
    failed++;
  }
}

// ---- kuberaPadaFromPadas formula tests ----
eq(kuberaPadaFromPadas(10, 41), 86, 'user sample (10 × 41)');
eq(kuberaPadaFromPadas(1, 1), 1, 'min case (1 × 1)');
eq(kuberaPadaFromPadas(108, 1), 108, 'remainder 0 → 108  (108 × 1)');
eq(kuberaPadaFromPadas(2, 54), 108, 'remainder 0 → 108  (2 × 54)');
eq(kuberaPadaFromPadas(108, 108), 108, 'max × max → 108');
eq(kuberaPadaFromPadas(1, 107), 107, 'remainder 107 (1 × 107)');
eq(kuberaPadaFromPadas(3, 36), 108, '3 × 36 = 108 → 108');
eq(kuberaPadaFromPadas(7, 20), 32, '7 × 20 = 140 → 32');
eq(kuberaPadaFromPadas(50, 50), 16, '50 × 50 = 2500  2500 % 108 = 16');

// ---- longitudeToOverallPada boundary tests ----
eq(longitudeToOverallPada(0), 1, '0° = Ashwini pada 1');
eq(longitudeToOverallPada(13 + 1/3 - 0.001), 4, 'end of Ashwini = pada 4');
eq(longitudeToOverallPada(13 + 1/3), 5, 'start of Bharani = pada 5');
eq(longitudeToOverallPada(359.9999), 108, 'end of Revati = pada 108');

// ---- secondHouseSign tests ----
eq(secondHouseSign(1), 2, 'Aries → 2nd = Taurus');
eq(secondHouseSign(12), 1, 'Pisces → 2nd = Aries');
eq(secondHouseSign(11), 12, 'Aquarius → 2nd = Pisces');

// ---- SIGN_LORDS lookup ----
eq(SIGN_LORDS[1], 'Mars', 'Aries lord = Mars');
eq(SIGN_LORDS[7], 'Venus', 'Libra lord = Venus');
eq(SIGN_LORDS[9], 'Jupiter', 'Sagittarius lord = Jupiter');

// ---- computeKuberaPada end-to-end ----
// Ascendant in Aries (1) -> 2nd sign = Taurus (2), lord = Venus.
// Moon overall pada 10 = nIdx=2, padaIn=2 → longitude in [30.0, 33.3333). Use 31°.
// Venus overall pada 41 = nIdx=10, padaIn=1 → longitude in [133.3333, 136.6667). Use 134°.
const eeResult = computeKuberaPada({
  moonLongitude: 31,
  ascendantSign: 1,
  planets: [{ name: 'Venus', longitude: 134 }]
});
eq(eeResult.moonPada, 10, 'end-to-end moonPada');
eq(eeResult.secondLordName, 'Venus', 'end-to-end 2nd lord name');
eq(eeResult.secondLordPada, 41, 'end-to-end secondLordPada');
eq(eeResult.product, 410, 'end-to-end product');
eq(eeResult.quotient, 3, 'end-to-end quotient');
eq(eeResult.remainder, 86, 'end-to-end remainder');
eq(eeResult.kuberaPada, 86, 'end-to-end kuberaPada');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) throw new Error(`${failed} test(s) failed`);
