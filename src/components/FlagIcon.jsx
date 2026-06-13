import React from 'react';

const FlagIcon = ({ emoji, className = "w-6 h-6 rounded-sm object-cover shadow-sm", style = {} }) => {
    if (!emoji) return null;
    
    const getCountryCode = (e) => {
        if (e.length === 4) {
            return (String.fromCharCode(e.codePointAt(0) - 127397) + 
                    String.fromCharCode(e.codePointAt(2) - 127397)).toLowerCase();
        }
        return '';
    };

    const code = getCountryCode(emoji);
    
    if (/^[a-z]{2}$/.test(code)) {
        return (
            <img 
                src={`https://flagcdn.com/w80/${code}.png`} 
                alt={`${code} flag`} 
                className={className} 
                style={{ display: 'inline-block', ...style }}
            />
        );
    }
    
    return <span className={className} style={style}>{emoji}</span>;
};

export default FlagIcon;
