const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/config/fees.json', 'utf8'));

// Delete australia (since 'other' handles it)
if(data.australia) {
    delete data.australia;
}

// Update 'other'
data.other = {
  Public: {
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
  },
  Private: {
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
  }
};

fs.writeFileSync('src/config/fees.json', JSON.stringify(data, null, 2));
