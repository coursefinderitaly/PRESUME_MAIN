import feesData from './fees.json';
import { COUPONS } from './coupons';

export const getPhases = (countryId, uniType, level, couponCode) => {
    // 1. Fallback to 'other' if country not found
    const countryObj = feesData[countryId] || feesData['other'];
    
    // 2. Fallback to 'Public' if uniType not found
    const typeObj = countryObj[uniType] || countryObj['Public'];
    
    // 3. Fallback to 'Bachelors' if level not found in base
    let baseLevel = level;
    if (!typeObj.base[level]) {
        baseLevel = 'Bachelors';
    }
    
    let phases = typeObj.base[baseLevel];
    
    // 4. Apply explicit coupon structure if defined in JSON
    if (couponCode && typeObj.coupons && typeObj.coupons[couponCode] && typeObj.coupons[couponCode][baseLevel]) {
        phases = typeObj.coupons[couponCode][baseLevel];
    } 
    // 5. Fallback percentage application for arbitrary coupons
    else if (couponCode && COUPONS[couponCode]) {
        const discountPct = COUPONS[couponCode];
        phases = [...phases];
        phases[0] = Math.round(phases[0] * (1 - discountPct / 100));
    }
    
    return phases;
};
