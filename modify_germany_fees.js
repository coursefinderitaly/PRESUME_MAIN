const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/config/fees.json', 'utf8'));

if (data.germany) {
  // Public = 150,000 base
  data.germany.Public = {
    base: {
      Bachelors: [50000, 40000, 30000, 30000],
      Masters: [50000, 40000, 30000, 30000],
      MBBS: [50000, 40000, 30000, 30000]
    },
    coupons: {
      PRESUME50: {
        Bachelors: [25000, 20000, 15000, 15000],
        Masters: [25000, 20000, 15000, 15000],
        MBBS: [25000, 20000, 15000, 15000]
      }
    }
  };

  // Private = 20,000 base
  data.germany.Private = {
    base: {
      Bachelors: [5000, 5000, 5000, 5000],
      Masters: [5000, 5000, 5000, 5000],
      MBBS: [5000, 5000, 5000, 5000]
    },
    coupons: {
      PRESUME50: {
        Bachelors: [2500, 2500, 2500, 2500],
        Masters: [2500, 2500, 2500, 2500],
        MBBS: [2500, 2500, 2500, 2500]
      }
    }
  };
}

fs.writeFileSync('src/config/fees.json', JSON.stringify(data, null, 2));
