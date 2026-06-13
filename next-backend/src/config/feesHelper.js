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
        // Ensure phases is an array before spreading
        if (!Array.isArray(phases)) {
            phases = [
                phases['Phase 1 (Admission)'] || 0,
                phases['Phase 2 (After Admission)'] || 0,
                phases['Phase 3 (Pre-enrollment)'] || 0,
                phases['Phase 4 (Visa Support)'] || 0
            ];
        } else {
            phases = [...phases];
        }
        phases[0] = Math.round(phases[0] * (1 - discountPct / 100));
    }

    if (!Array.isArray(phases)) {
        phases = [
            phases['Phase 1 (Admission)'] || 0,
            phases['Phase 2 (After Admission)'] || 0,
            phases['Phase 3 (Pre-enrollment)'] || 0,
            phases['Phase 4 (Visa Support)'] || 0
        ];
    }

    return phases;
};

const getTaxRate = (countryId) => {
    return 0.18;
};

module.exports = { getPhases, getTaxRate };
