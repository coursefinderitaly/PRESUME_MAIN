import feesData from './fees.json';
import { COUPONS } from './coupons';

export const getPhases = (countryId, uniType, level, couponCode) => {
    // 1. Fallback to 'other' if country not found
    const normalizedCountry = (countryId || 'other').toLowerCase();
    const countryObj = feesData[normalizedCountry] || feesData['other'];
    
    // 2. Fallback to 'Public' if uniType not found
    const typeObj = countryObj[uniType] || countryObj['Public'];
    
    // 3. Fallback to 'Bachelors' if level not found in base
    let baseLevel = level;
    if (!typeObj.base[level]) {
        baseLevel = 'Bachelors';
    }
    
    let phases = typeObj.base[baseLevel];
    
    // Treat dynamically generated PRESUME- coupons exactly like PRESUME50
    let effectiveCouponCode = couponCode;
    if (couponCode && couponCode.startsWith('PRESUME-')) {
        effectiveCouponCode = 'PRESUME50';
    }
    
    // 4. Apply explicit coupon structure if defined in JSON
    if (effectiveCouponCode && typeObj.coupons && typeObj.coupons[effectiveCouponCode] && typeObj.coupons[effectiveCouponCode][baseLevel]) {
        phases = typeObj.coupons[effectiveCouponCode][baseLevel];
    } 
    // 5. Fallback percentage application for arbitrary coupons
    else if (effectiveCouponCode && COUPONS[effectiveCouponCode]) {
        const discountPct = COUPONS[effectiveCouponCode];
        phases = [...phases];
        phases[0] = Math.round(phases[0] * (1 - discountPct / 100));
    }
    return phases;
};

export const getTaxRate = (countryId) => {
    const cId = (countryId || '').toLowerCase();
    if (['italy', 'germany', 'russia', 'georgia'].includes(cId)) {
        return 0.18;
    }
    return 0; // Default no tax for other countries
};
