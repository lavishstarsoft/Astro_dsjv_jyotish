export class VargaEngine {
  static getVargas(planets: any[], ascendantDegree: number) {
    const ascendant = { name: 'Lagna', longitude: ascendantDegree, isRetrograde: false };
    const bodies = [ascendant, ...planets];

    const vargas: any = {
      D1: [], D2: [], D3: [], D4: [], D7: [], D9: [], D10: [], 
      D12: [], D16: [], D20: [], D24: [], D27: [], D30: [], 
      D40: [], D45: [], D60: []
    };

    for (const p of bodies) {
      const sign = Math.floor(p.longitude / 30) + 1;
      const deg = p.longitude % 30;

      // D-1 Rasi
      vargas.D1.push({ ...p, zodiacSign: sign, degreeInSign: deg });

      // D-2 Hora
      let d2Sign = sign;
      if (sign % 2 !== 0) { // Odd
        d2Sign = deg < 15 ? 5 : 4;
      } else { // Even
        d2Sign = deg < 15 ? 4 : 5;
      }
      vargas.D2.push({ ...p, zodiacSign: d2Sign });

      // D-3 Drekkana
      const d3Part = Math.floor(deg / 10);
      let d3Sign = ((sign + (d3Part * 4) - 1) % 12) + 1;
      vargas.D3.push({ ...p, zodiacSign: d3Sign });

      // D-4 Chaturthamsha
      const d4Part = Math.floor(deg / 7.5);
      let d4Sign = ((sign + (d4Part * 3) - 1) % 12) + 1;
      vargas.D4.push({ ...p, zodiacSign: d4Sign });

      // D-7 Saptamamsa
      const d7Part = Math.floor(deg / (30/7));
      let d7Start = sign % 2 !== 0 ? sign : sign + 6;
      let d7Sign = ((d7Start + d7Part - 1) % 12) + 1;
      vargas.D7.push({ ...p, zodiacSign: d7Sign });

      // D-9 Navamsa
      const totalNavamsas = Math.floor(p.longitude / (30/9));
      let d9Sign = (totalNavamsas % 12) + 1;
      vargas.D9.push({ ...p, zodiacSign: d9Sign });

      // D-10 Dasamamsa
      const d10Part = Math.floor(deg / 3);
      let d10Start = sign % 2 !== 0 ? sign : sign + 8;
      let d10Sign = ((d10Start + d10Part - 1) % 12) + 1;
      vargas.D10.push({ ...p, zodiacSign: d10Sign });

      // D-12 Dwadasamsa
      const d12Part = Math.floor(deg / 2.5);
      let d12Sign = ((sign + d12Part - 1) % 12) + 1;
      vargas.D12.push({ ...p, zodiacSign: d12Sign });

      // D-16 Shodashamsa
      const d16Part = Math.floor(deg / (30/16));
      let d16Start = sign;
      if (sign % 3 === 1) d16Start = 1;
      else if (sign % 3 === 2) d16Start = 5;
      else d16Start = 9;
      let d16Sign = ((d16Start + d16Part - 1) % 12) + 1;
      vargas.D16.push({ ...p, zodiacSign: d16Sign });

      // D-20 Vimsamsa
      const d20Part = Math.floor(deg / 1.5);
      let d20Start = sign;
      if (sign % 3 === 1) d20Start = 1;
      else if (sign % 3 === 2) d20Start = 9;
      else d20Start = 5;
      let d20Sign = ((d20Start + d20Part - 1) % 12) + 1;
      vargas.D20.push({ ...p, zodiacSign: d20Sign });

      // D-24 Chaturvimsamsa
      const d24Part = Math.floor(deg / 1.25);
      let d24Start = sign % 2 !== 0 ? 5 : 4;
      let d24Sign = ((d24Start + d24Part - 1) % 12) + 1;
      vargas.D24.push({ ...p, zodiacSign: d24Sign });

      // D-27 Saptavimsamsa
      const d27Part = Math.floor(deg / (30/27));
      let d27Start = sign;
      if (sign % 3 === 1) d27Start = 1;
      else if (sign % 3 === 2) d27Start = 4;
      else d27Start = 7;
      let d27Sign = ((d27Start + d27Part - 1) % 12) + 1;
      vargas.D27.push({ ...p, zodiacSign: d27Sign });

      // D-30 Trimsamsa
      let d30Sign = sign;
      if (sign % 2 !== 0) {
        if (deg <= 5) d30Sign = 1;
        else if (deg <= 10) d30Sign = 11;
        else if (deg <= 18) d30Sign = 9;
        else if (deg <= 25) d30Sign = 3;
        else d30Sign = 7;
      } else {
        if (deg <= 5) d30Sign = 2;
        else if (deg <= 12) d30Sign = 6;
        else if (deg <= 20) d30Sign = 12;
        else if (deg <= 25) d30Sign = 10;
        else d30Sign = 8;
      }
      vargas.D30.push({ ...p, zodiacSign: d30Sign });

      // D-40 Khavedamsa
      const d40Part = Math.floor(deg / 0.75);
      let d40Start = sign % 2 !== 0 ? 1 : 7;
      let d40Sign = ((d40Start + d40Part - 1) % 12) + 1;
      vargas.D40.push({ ...p, zodiacSign: d40Sign });

      // D-45 Akshavedamsa
      const d45Part = Math.floor(deg / (30/45));
      let d45Start = sign;
      if (sign % 3 === 1) d45Start = 1;
      else if (sign % 3 === 2) d45Start = 5;
      else d45Start = 9;
      let d45Sign = ((d45Start + d45Part - 1) % 12) + 1;
      vargas.D45.push({ ...p, zodiacSign: d45Sign });

      // D-60 Shashtiamsa
      const d60Part = Math.floor(deg * 2);
      let d60Sign = ((sign + d60Part - 1) % 12) + 1;
      vargas.D60.push({ ...p, zodiacSign: d60Sign });
    }

    const formatVarga = (vargaArray: any[]) => {
      const asc = vargaArray.find(p => p.name === 'Lagna');
      const planets = vargaArray.filter(p => p.name !== 'Lagna');
      return {
        ascendantSign: asc ? asc.zodiacSign : 1,
        ascendantDegreeInSign: asc ? asc.degreeInSign : undefined,
        planets
      };
    };

    return {
      D1: formatVarga(vargas.D1),
      D2: formatVarga(vargas.D2),
      D3: formatVarga(vargas.D3),
      D4: formatVarga(vargas.D4),
      D7: formatVarga(vargas.D7),
      D9: formatVarga(vargas.D9),
      D10: formatVarga(vargas.D10),
      D12: formatVarga(vargas.D12),
      D16: formatVarga(vargas.D16),
      D20: formatVarga(vargas.D20),
      D24: formatVarga(vargas.D24),
      D27: formatVarga(vargas.D27),
      D30: formatVarga(vargas.D30),
      D40: formatVarga(vargas.D40),
      D45: formatVarga(vargas.D45),
      D60: formatVarga(vargas.D60)
    };
  }
}
