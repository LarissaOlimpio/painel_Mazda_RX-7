const rx7Database = {
  model: "Mazda RX-7 FD3S",
  engine: "13B-REW twin-rotor sequential twin-turbo (1.3L / 2x654cc)",
  transmission: "5-speed manual",

  // The "featured car" shown in the page hero
  featured: {
    year: 1997,
    trim: "Type R Bathurst",
    powerHp: 265,
    torqueKgm: 31.0,
    weightKg: 1230,
    zeroToHundredS: 5.5,
    topSpeedKmh: 255,
  },

  // Power x torque curve by RPM (fictional dyno data),
  // used in the Highcharts line chart
  powerCurve: [
    { rpm: 2000, hp: 60, torqueNm: 140 },
    { rpm: 3000, hp: 110, torqueNm: 230 },
    { rpm: 4000, hp: 165, torqueNm: 290 },
    { rpm: 5000, hp: 210, torqueNm: 310 },
    { rpm: 6000, hp: 245, torqueNm: 300 },
    { rpm: 6500, hp: 260, torqueNm: 290 },
    { rpm: 7000, hp: 265, torqueNm: 275 },
    { rpm: 7500, hp: 255, torqueNm: 250 },
    { rpm: 8000, hp: 230, torqueNm: 220 },
  ],

  // Timeline of trims, used in the comparison chart and the table
  versions: [
    {
      year: 1992,
      trim: "Type R",
      powerHp: 255,
      torqueKgm: 30.0,
      weightKg: 1250,
      zeroToHundredS: 5.8,
      topSpeedKmh: 250,
      estimatedPrice: 320000,
    },
    {
      year: 1993,
      trim: "Touring X",
      powerHp: 239,
      torqueKgm: 28.5,
      weightKg: 1270,
      zeroToHundredS: 6.1,
      topSpeedKmh: 245,
      estimatedPrice: 295000,
    },
    {
      year: 1995,
      trim: "Type RZ",
      powerHp: 265,
      torqueKgm: 30.5,
      weightKg: 1218,
      zeroToHundredS: 5.6,
      topSpeedKmh: 255,
      estimatedPrice: 340000,
    },
    {
      year: 1997,
      trim: "Type R Bathurst",
      powerHp: 265,
      torqueKgm: 31.0,
      weightKg: 1230,
      zeroToHundredS: 5.5,
      topSpeedKmh: 255,
      estimatedPrice: 350000,
    },
    {
      year: 1999,
      trim: "Spirit R Type A",
      powerHp: 280,
      torqueKgm: 32.0,
      weightKg: 1210,
      zeroToHundredS: 5.3,
      topSpeedKmh: 260,
      estimatedPrice: 380000,
    },
    {
      year: 2002,
      trim: "Spirit R Type A Final",
      powerHp: 280,
      torqueKgm: 32.0,
      weightKg: 1200,
      zeroToHundredS: 5.2,
      topSpeedKmh: 260,
      estimatedPrice: 410000,
    },
  ],
};

function fetchRx7Data() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        const responseAsJson = JSON.stringify(rx7Database);
        const data = JSON.parse(responseAsJson);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }, 50);
  });
}
