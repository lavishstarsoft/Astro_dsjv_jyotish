import { Request, Response } from 'express';
import { AstrologyEngine } from '../services/astrology/ephemeris';
import { VargaEngine } from '../services/astrology/vargaEngine';

export const calculateChart = (req: Request, res: Response) => {
  try {
    const { date, time, lat, lon, timezoneOffset } = req.body;
    
    // Basic parsing (assuming DD/MM/YYYY and HH:MM)
    const [day, month, year] = date.split('/').map(Number);
    
    // Parse time like "2:22 pm" or "14:22"
    let hour = 0;
    let minute = 0;
    if (time.toLowerCase().includes('pm') || time.toLowerCase().includes('am')) {
      const parts = time.toLowerCase().replace('pm', '').replace('am', '').trim().split(':');
      hour = parseInt(parts[0]);
      minute = parseInt(parts[1] || '0');
      if (time.toLowerCase().includes('pm') && hour !== 12) hour += 12;
      if (time.toLowerCase().includes('am') && hour === 12) hour = 0;
    } else {
      const parts = time.split(':');
      hour = parseInt(parts[0]);
      minute = parseInt(parts[1] || '0');
    }

    // Convert Local Time to UTC Decimal Hours
    // timezoneOffset should be in hours, e.g., 5.5 for IST
    const localDecimalHour = hour + (minute / 60);
    let utcDecimalHour = localDecimalHour - (timezoneOffset || 5.5);
    
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    // Adjust day if UTC hour wraps around
    if (utcDecimalHour < 0) {
      utcDecimalHour += 24;
      utcDay -= 1; // Simplified, doesn't handle month boundaries accurately for MVP
    } else if (utcDecimalHour >= 24) {
      utcDecimalHour -= 24;
      utcDay += 1;
    }

    const julianDay = AstrologyEngine.getJulianDay(utcYear, utcMonth, utcDay, utcDecimalHour);
    
    const planets = AstrologyEngine.getPlanetaryPositions(julianDay);
    
    // Default Chennai coordinates if not provided (13.0827 N, 80.2707 E)
    const ascendantDegree = AstrologyEngine.getAscendant(julianDay, lat || 13.0827, lon || 80.2707);
    const ascendantSign = Math.floor(ascendantDegree / 30) + 1;
    const ascendantDegreeInSign = ascendantDegree % 30;

    // Bhava Chalita (Equal House): planets grouped by the bhava they actually occupy
    const bhavaPlanets = AstrologyEngine.getBhavaChalita(ascendantDegree, planets);

    // Calculate all 16 Vargas
    const vargas = VargaEngine.getVargas(planets, ascendantDegree);

    res.status(200).json({
      success: true,
      data: {
        ascendantSign,
        ascendantDegree,
        ascendantDegreeInSign,
        planets,
        bhavaPlanets,
        vargas
      }
    });

  } catch (error: any) {
    console.error('Calculation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate chart accurately' });
  }
};
