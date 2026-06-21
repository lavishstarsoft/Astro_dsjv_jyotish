import { Request, Response } from 'express';
import { AstrologyEngine } from './src/services/astrology/ephemeris';
import { VargaEngine } from './src/services/astrology/vargaEngine';

const julianDay = AstrologyEngine.getJulianDay(1990, 6, 21, 12.366666666);
const planets = AstrologyEngine.getPlanetaryPositions(julianDay);
const ascendantDegree = AstrologyEngine.getAscendant(julianDay, 16.5033, 80.6465);
const vargas = VargaEngine.getVargas(planets, ascendantDegree);

console.log("D1 Ascendant Sign:", vargas.D1.ascendantSign);
console.log("D1 Planets:");
vargas.D1.planets.forEach((p: any) => {
  console.log(`${p.name}: Sign ${p.zodiacSign} (${p.longitude.toFixed(2)} deg)`);
});
