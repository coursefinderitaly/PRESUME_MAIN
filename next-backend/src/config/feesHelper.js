const feesData = require('./fees.json');
const { COUPONS } = require('./coupons');

const getPhases = (countryId, uniType, level, couponCode) => {
    const normalizedCountry = (countryId || 'other').toLowerCase();
    const countryObj = feesData[normalizedCountry] || feesData['other'];
    const typeObj = countryObj[uniType] || countryObj['Public'];
    
    let baseLevel = level;
    if (!typeObj.base[level]) {
        baseLevel = 'Bachelors';
    }
    
    let phases = typeObj.base[baseLevel];
    
    let effectiveCouponCode = couponCode;
    if (couponCode && couponCode.startsWith('PRESUME-')) {
        effectiveCouponCode = 'PRESUME50';
    }
    
    if (effectiveCouponCode && typeObj.coupons && typeObj.coupons[effectiveCouponCode] && typeObj.coupons[effectiveCouponCode][baseLevel]) {
        phases = typeObj.coupons[effectiveCouponCode][baseLevel];
    } else if (effectiveCouponCode && COUPONS[effectiveCouponCode]) {
        const discountPct = COUPONS[effectiveCouponCode];
        phases = [...phases];
        phases[0] = Math.round(phases[0] * (1 - discountPct / 100));
    }
    // TEMPORARY TEST OVERRIDE: Set Phase 1 to 1 rupee
    phases[0] = 1;
    
    return phases;
};

module.exports = { getPhases };
