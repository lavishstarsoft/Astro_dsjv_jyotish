import { Request, Response } from 'express';
import { AstrologyEngine } from '../services/astrology/ephemeris';
import { VargaEngine } from '../services/astrology/vargaEngine';
import { PanchangamEngine } from '../services/astrology/panchangam';
import { DashaEngine } from '../services/dasha/vimshottari';
import { computeKuberaPada } from '../services/astrology/kuberaPada';

export const calculateChart = (req: Request, res: Response) => {
  try {
    const { date, time, lat, lon, timezoneOffset } = req.body;

    if (!date || typeof date !== 'string' || !date.includes('/')) {
      return res.status(400).json({ success: false, message: 'Invalid or missing date (expected DD/MM/YYYY)' });
    }

    const [day, month, year] = date.split('/').map(Number);
    if (!day || !month || !year) {
      return res.status(400).json({ success: false, message: 'Date must be DD/MM/YYYY' });
    }

    // Parse time like "2:22 pm" or "14:22"; default to noon if missing
    const timeStr = (typeof time === 'string' && time.trim()) ? time.trim() : '12:00';
    let hour = 0;
    let minute = 0;
    if (timeStr.toLowerCase().includes('pm') || timeStr.toLowerCase().includes('am')) {
      const parts = timeStr.toLowerCase().replace('pm', '').replace('am', '').trim().split(':');
      hour = parseInt(parts[0]);
      minute = parseInt(parts[1] || '0');
      if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
      if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
    } else {
      const parts = timeStr.split(':');
      hour = parseInt(parts[0]);
      minute = parseInt(parts[1] || '0');
    }
    if (isNaN(hour) || isNaN(minute)) {
      return res.status(400).json({ success: false, message: 'Time must be HH:MM or "H:MM am/pm"' });
    }

    const tz = timezoneOffset || 5.5;

    // Local date object (for weekday) — constructed as if local wall clock time
    const localDob = new Date(year, month - 1, day, hour, minute, 0);

    // Convert Local Time to UTC Decimal Hours
    const localDecimalHour = hour + (minute / 60);
    let utcDecimalHour = localDecimalHour - tz;

    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    if (utcDecimalHour < 0) {
      utcDecimalHour += 24;
      utcDay -= 1;
    } else if (utcDecimalHour >= 24) {
      utcDecimalHour -= 24;
      utcDay += 1;
    }

    const julianDay = AstrologyEngine.getJulianDay(utcYear, utcMonth, utcDay, utcDecimalHour);

    const planets = AstrologyEngine.getPlanetaryPositions(julianDay);

    const latitude = lat || 13.0827;
    const longitude = lon || 80.2707;

    const ascendantDegree = AstrologyEngine.getAscendant(julianDay, latitude, longitude);
    const ascendantSign = Math.floor(ascendantDegree / 30) + 1;
    const ascendantDegreeInSign = ascendantDegree % 30;

    const bhavaPlanets = AstrologyEngine.getBhavaChalita(ascendantDegree, planets);
    const vargas = VargaEngine.getVargas(planets, ascendantDegree);

    // Panchangam
    const sun = planets.find(p => p.name === 'Sun');
    const moon = planets.find(p => p.name === 'Moon');
    const sunLong = sun ? sun.longitude : 0;
    const moonLong = moon ? moon.longitude : 0;

    const panchangam = PanchangamEngine.compute(
      julianDay, sunLong, moonLong, ascendantSign, localDob, latitude, longitude
    );

    // Kraga Saram (planet nakshatra details)
    const kragaSaram = PanchangamEngine.kragaSaram(planets);

    // Vimshottari Dasha timeline
    const dashaRaw = DashaEngine.calculateVimshottari(moonLong, localDob);
    // Compress to plain objects with ISO date strings for JSON transport
    const dasha = dashaRaw.map(d => ({
      planet: d.planet,
      startDate: d.startDate.toISOString(),
      endDate: d.endDate.toISOString(),
      antardashas: (d.antardashas || []).map(ad => ({
        planet: ad.planet,
        startDate: ad.startDate.toISOString(),
        endDate: ad.endDate.toISOString()
      }))
    }));

    // Current running dasha/bhukti (based on server time)
    const now = new Date();
    let currentDasha: any = null;
    let currentBhukti: any = null;
    for (const md of dasha) {
      const mdStart = new Date(md.startDate);
      const mdEnd = new Date(md.endDate);
      if (now >= mdStart && now <= mdEnd) {
        currentDasha = { planet: md.planet, startDate: md.startDate, endDate: md.endDate };
        for (const ad of md.antardashas) {
          const adStart = new Date(ad.startDate);
          const adEnd = new Date(ad.endDate);
          if (now >= adStart && now <= adEnd) {
            currentBhukti = ad;
            break;
          }
        }
        break;
      }
    }

    // Kubera Pada — reuses moon longitude, ascendant sign, and existing planet
    // longitudes; no duplicate astronomical calculation.
    let kuberaPada: any = null;
    try {
      kuberaPada = computeKuberaPada({
        moonLongitude: moonLong,
        ascendantSign,
        planets: planets.map(p => ({ name: p.name, longitude: p.longitude }))
      });
    } catch (kpErr) {
      console.error('Kubera Pada calc error:', kpErr);
    }

    res.status(200).json({
      success: true,
      data: {
        ascendantSign,
        ascendantDegree,
        ascendantDegreeInSign,
        planets,
        bhavaPlanets,
        vargas,
        panchangam,
        kragaSaram,
        dasha,
        currentDasha,
        currentBhukti,
        kuberaPada
      }
    });

  } catch (error: any) {
    console.error('Calculation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate chart accurately' });
  }
};
