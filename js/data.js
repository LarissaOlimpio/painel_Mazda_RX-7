const rx7Database = {
  model: "Mazda RX-7 FD3S",

  engine: "13B-REW twin-rotor sequential twin-turbo (1.3L / 2x654cc)",

  transmission: "5-speed manual",

  featured: {
    year: 1997,
    trim: "Type R Bathurst",
    powerHp: 265,
    torqueKgm: 31.0,
    weightKg: 1230,
    zeroToHundredS: 5.5,
    topSpeedKmh: 255,
  },

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

  versions: [
    {
      year: 1991,
      trim: "Base",
      powerHp: 205,
      torqueKgm: 27.0,
      weightKg: 1300,
      zeroToHundredS: 6.8,
      topSpeedKmh: 230,
      estimatedPrice: 280000,
    },

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
      year: 1994,
      trim: "GT",
      powerHp: 220,
      torqueKgm: 28.0,
      weightKg: 1290,
      zeroToHundredS: 6.5,
      topSpeedKmh: 240,
      estimatedPrice: 300000,
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
      year: 1996,
      trim: "Type S",
      powerHp: 250,
      torqueKgm: 29.5,
      weightKg: 1180,
      zeroToHundredS: 5.9,
      topSpeedKmh: 250,
      estimatedPrice: 335000,
    },

    {
      year: 1996,
      trim: "Grand Touring",
      powerHp: 230,
      torqueKgm: 28.5,
      weightKg: 1340,
      zeroToHundredS: 6.4,
      topSpeedKmh: 240,
      estimatedPrice: 310000,
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
      year: 1998,
      trim: "Type RS",
      powerHp: 270,
      torqueKgm: 31.5,
      weightKg: 1160,
      zeroToHundredS: 5.4,
      topSpeedKmh: 258,
      estimatedPrice: 365000,
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
      year: 2000,
      trim: "RZ Lightweight",
      powerHp: 285,
      torqueKgm: 32.0,
      weightKg: 1120,
      zeroToHundredS: 5.1,
      topSpeedKmh: 262,
      estimatedPrice: 395000,
    },

    {
      year: 2001,
      trim: "Competition",
      powerHp: 300,
      torqueKgm: 33.0,
      weightKg: 1080,
      zeroToHundredS: 5.0,
      topSpeedKmh: 265,
      estimatedPrice: 405000,
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

    {
      year: 2002,
      trim: "Track Edition",
      powerHp: 310,
      torqueKgm: 33.5,
      weightKg: 1100,
      zeroToHundredS: 4.9,
      topSpeedKmh: 268,
      estimatedPrice: 425000,
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
