const feesData = require('./fees.json');
const { COUPONS } = require('./coupons');

const getPhases = (countryId, uniType, level, couponCode) => {
    const countryObj = feesData[countryId] || feesData['other'];
    const typeObj = countryObj[uniType] || countryObj['Public'];
    
    let baseLevel = level;
    if (!typeObj.base[level]) {
        baseLevel = 'Bachelors';
    }
    
    let phases = typeObj.base[baseLevel];
    
    if (couponCode && typeObj.coupons && typeObj.coupons[couponCode] && typeObj.coupons[couponCode][baseLevel]) {
        phases = typeObj.coupons[couponCode][baseLevel];
    } else if (couponCode && COUPONS[couponCode]) {
        const discountPct = COUPONS[couponCode];
        phases = [...phases];
        phases[0] = Math.round(phases[0] * (1 - discountPct / 100));
    }
    
    return phases;
};

module.exports = { getPhases };
