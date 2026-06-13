import razorpayFees from '../../next-backend/src/config/razorpayFees.json';
import feesData from '../../next-backend/src/config/fees.json';
import { COUPONS } from './coupons';

export const getPhases = (countryId, uniType, level, couponCode) => {
    const cId = (countryId || 'other').toLowerCase();
    const uType = (uniType || 'Public').toLowerCase();
    const sLevel = (level || 'Bachelors').toLowerCase();
    
    const key = `${cId}_${uType}_${sLevel}`;
    const feeObj = razorpayFees[key];
    
    if (feeObj) {
        // Return base amount (divided by 1.18 since frontend will visually add 18% GST back to reach final total)
        const getPhaseValue = (phaseConfig) => {
            let finalAmount = phaseConfig.base;
            let effCoupon = couponCode ? couponCode.toUpperCase() : '';
            if (effCoupon) {
                if (effCoupon.startsWith('PRESUME-') || effCoupon === 'PRESUME50') {
                    finalAmount = phaseConfig.discount_50;
                } else if (effCoupon === 'PRESUME30') {
                    finalAmount = phaseConfig.discount_30;
                } else if (COUPONS[effCoupon]) {
                    finalAmount = Math.round(phaseConfig.base * (1 - COUPONS[effCoupon] / 100));
                }
            }
            return Math.round(finalAmount / 1.18);
        };
        
        return [
            getPhaseValue(feeObj.phase1),
            getPhaseValue(feeObj.phase2),
            getPhaseValue(feeObj.phase3),
            getPhaseValue(feeObj.phase4)
        ];
    }
    
    // Legacy fallback
    const countryObj = feesData[cId] || feesData['other'];
    const typeObj = countryObj[uniType || 'Public'] || countryObj['Public'];
    let baseLevel = level;
    if (!typeObj.base[level]) baseLevel = 'Bachelors';
    let phases = typeObj.base[baseLevel];
    
    let effectiveCouponCode = couponCode;
    if (couponCode && couponCode.startsWith('PRESUME-')) {
        effectiveCouponCode = 'PRESUME50';
    }
    
    if (effectiveCouponCode && typeObj.coupons && typeObj.coupons[effectiveCouponCode] && typeObj.coupons[effectiveCouponCode][baseLevel]) {
        phases = typeObj.coupons[effectiveCouponCode][baseLevel];
    } 
    else if (effectiveCouponCode && COUPONS[effectiveCouponCode]) {
        const discountPct = COUPONS[effectiveCouponCode];
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

export const getTaxRate = (countryId) => {
    return 0.18; // 18% GST globally
};
