const fs = require('fs');

const genericUGDocs = [
    "10th & 12th Mark Sheets",
    "Valid Passport",
    "Passport-size photographs",
    "English Proficiency (IELTS/TOEFL)",
    "Motivation Letter / SOP",
    "LORs (if required)"
];

const genericPGDocs = [
    "Bachelor's Transcripts",
    "Valid Passport",
    "English Proficiency (IELTS/TOEFL)",
    "Motivation Letter / SOP",
    "2 LORs",
    "Updated CV"
];

function generateStudyLevels(country) {
    let thirdCard = {
        id: "diploma",
        title: "Diplomas & Certs",
        icon: "FileText",
        theme: "accent-gold",
        eligibility: ["High school completion.", "IELTS 5.5 - 6.0.", "Vocational focus."],
        exam: "No specific entrance exam.",
        docs: genericUGDocs
    };

    if (country === 'uk' || country === 'ireland' || country === 'germany') {
        thirdCard = {
            id: "phd",
            title: "PhD & Research",
            icon: "Sparkles",
            theme: "accent-gold",
            eligibility: ["Master's Degree.", "Strong research proposal.", "Academic publications (bonus)."],
            exam: "Interviews with potential supervisors.",
            docs: genericPGDocs
        };
    } else if (country === 'usa') {
        thirdCard = {
            id: "mba",
            title: "MBA Programs",
            icon: "Briefcase",
            theme: "accent-gold",
            eligibility: ["Bachelor's Degree.", "2-5 years work experience.", "IELTS 6.5+ / TOEFL 90+."],
            exam: "GMAT or GRE usually required for top B-Schools.",
            docs: genericPGDocs
        };
    }

    return `[
            {
                id: "bachelors",
                title: "Bachelors",
                icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
                themeColor: "text-blue-400",
                bgGlow: "bg-blue-500/10",
                bgBox: "bg-blue-500/5",
                borderBox: "border-blue-500/20",
                checkedBg: "bg-blue-500/10",
                checkedBorder: "border-blue-500/40",
                checkedInput: "checked:bg-blue-500 checked:border-blue-500",
                eligibility: [
                    "12 years of formal education.",
                    "Minimum 60-70% aggregate.",
                    "IELTS 6.0 or TOEFL equivalent."
                ],
                exam: "Standard entry. SAT may be needed for some US colleges.",
                docs: genericUGDocs
            },
            {
                id: "masters",
                title: "Masters",
                icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
                themeColor: "text-emerald-400",
                bgGlow: "bg-emerald-500/10",
                bgBox: "bg-emerald-500/5",
                borderBox: "border-emerald-500/20",
                checkedBg: "bg-emerald-500/10",
                checkedBorder: "border-emerald-500/40",
                checkedInput: "checked:bg-emerald-500 checked:border-emerald-500",
                eligibility: [
                    "Relevant Bachelor's degree.",
                    "Minimum CGPA of 6.5+.",
                    "IELTS 6.5 or TOEFL equivalent."
                ],
                exam: "GRE/GMAT required for specific programs (mostly US/CA).",
                docs: genericPGDocs
            },
            {
                id: "${thirdCard.id}",
                title: "${thirdCard.title}",
                icon: <${thirdCard.icon} className="w-8 h-8 text-${thirdCard.theme}" />,
                themeColor: "text-${thirdCard.theme}",
                bgGlow: "bg-${thirdCard.theme}/10",
                bgBox: "bg-${thirdCard.theme}/5",
                borderBox: "border-${thirdCard.theme}/20",
                checkedBg: "bg-${thirdCard.theme}/10",
                checkedBorder: "border-${thirdCard.theme}/40",
                checkedInput: "checked:bg-${thirdCard.theme} checked:border-${thirdCard.theme}",
                eligibility: ${JSON.stringify(thirdCard.eligibility)},
                exam: "${thirdCard.exam}",
                docs: ${thirdCard.id === 'phd' || thirdCard.id === 'mba' ? 'genericPGDocs' : 'genericUGDocs'}
            }
        ]`;
}

const currentFile = fs.readFileSync('src/data/countryData.jsx', 'utf8');

// Insert docs at the top
const newHeader = `import React from 'react';
import { PlaneTakeoff, GraduationCap, Coins, BookOpen, MapPin, Landmark, ArrowRight, ShieldCheck, Euro, Briefcase, HeartHandshake, Building2, Stethoscope, FileText, CheckCircle2, Sparkles, DollarSign, PoundSterling } from 'lucide-react';

const genericUGDocs = [
    "10th & 12th Mark Sheets",
    "Valid Passport",
    "Passport-size photographs",
    "English Proficiency (IELTS/TOEFL)",
    "Motivation Letter / SOP",
    "LORs (if required)"
];

const genericPGDocs = [
    "Bachelor's Transcripts",
    "Valid Passport",
    "English Proficiency (IELTS/TOEFL)",
    "Motivation Letter / SOP",
    "2 LORs",
    "Updated CV"
];
`;

let newContent = currentFile.replace(/import React[\s\S]*?export const countryData = \{/, newHeader + '\nexport const countryData = {');

const countries = ['australia', 'canada', 'france', 'germany', 'ireland', 'uk', 'usa'];

countries.forEach(country => {
    // Add videoSrc right after heroDesc
    const videoSrcRegex = new RegExp(`(heroDesc:[^\\n]+,)`);
    newContent = newContent.replace(videoSrcRegex, `$1\n        videoSrc: "/\${country}.mp4",`);
    
    // Add studyLevels after journeySteps
    const journeyRegex = new RegExp(`(journeySteps:\\s*\\[[\\s\\S]*?\\],)`);
    // Find the country block
    const countryStartIndex = newContent.indexOf(`${country}: {`);
    if(countryStartIndex > -1) {
        // We will just do a global replace carefully, or block specific
        // Actually, replacing journeySteps globally is bad. Let's do it per country block.
    }
});

// A better way is to parse/evaluate or just replace. Since I control the format, I can replace "tuitionCards:" with "studyLevels: ..., tuitionCards:"
countries.forEach(country => {
    const studyLevelsStr = generateStudyLevels(country);
    // Find the specific country block
    const countryRegex = new RegExp(`(${country}: \\{[\\s\\S]*?)(tuitionCards:)`);
    newContent = newContent.replace(countryRegex, `$1studyLevels: ${studyLevelsStr},\n        $2`);
});

fs.writeFileSync('src/data/countryData.jsx', newContent);
console.log("Updated countryData.jsx");
