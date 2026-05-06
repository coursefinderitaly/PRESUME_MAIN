import React from 'react';
import { PlaneTakeoff, GraduationCap, Coins, BookOpen, MapPin, Landmark, ArrowRight, ShieldCheck, Euro, Briefcase, HeartHandshake, Building2, Stethoscope, FileText, CheckCircle2, Sparkles, DollarSign, PoundSterling } from 'lucide-react';

import ausVideo from '../univideo/Australia.mp4';
import canVideo from '../univideo/canada.mp4';
import fraVideo from '../univideo/France.mp4';
import gerVideo from '../univideo/Germany.mp4';
import ireVideo from '../univideo/Ireland.mp4';
import ukVideo from '../univideo/UK.mp4';
import usaVideo from '../univideo/USA.mp4';
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

export const countryData = {
    australia: {
        name: "Australia",
        subtitle: "Land of Opportunities",
        heroText: "STUDY",
        heroHighlight: "AUSTRALIA.",
        heroDesc: "Experience high-quality education, vibrant student life, and a strong economy with incredible post-study work rights.",
        videoSrc: ausVideo,
        currencyIcon: <DollarSign className="w-10 h-10 text-accent-gold" />,
        currencyText: "Post-Study Visa",
        currencyValue: "Up to 4 Yrs",
        floatingCards: [
            { title: "Globally Recognized", subtitle: "Education", icon: <GraduationCap /> },
            { title: "Part-Time", subtitle: "Work Allowed", icon: <Briefcase /> },
            { title: "High Quality", subtitle: "Of Life", icon: <HeartHandshake /> },
            { title: "Diverse", subtitle: "Course Options", icon: <BookOpen /> }
        ],
        opportunities: [
            { title: "Post-Study Work Visa", desc: "Work for up to 4 years post-graduation depending on your degree and location.", icon: <Briefcase className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "Group of Eight", desc: "Access to world-renowned research-intensive universities.", icon: <Building2 className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "High Minimum Wage", desc: "Earn well while studying with part-time work rights.", icon: <DollarSign className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Vibrant Lifestyle", desc: "Enjoy a safe, multicultural society with beautiful landscapes.", icon: <HeartHandshake className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Global Recognition", desc: "Degrees are recognized globally by top employers.", icon: <GraduationCap className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "IT & Computer Science", programs: ["Data Science", "Cybersecurity", "Software Eng"], institutions: "Uni of Melbourne, UNSW", icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" /> },
            { category: "Business & Accounting", programs: ["MBA", "Master of Professional Accounting"], institutions: "Monash Uni, Uni of Sydney", icon: <Building2 className="w-6 h-6 text-accent-gold" /> },
            { category: "Healthcare & Nursing", programs: ["BSc Nursing", "Public Health", "Medicine"], institutions: "Uni of Queensland, Deakin", icon: <Stethoscope className="w-6 h-6 text-emerald-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Choose your course and apply to Australian universities." },
            { step: "02", title: "Offer & CoE", desc: "Receive an offer, pay tuition deposit, and get Confirmation of Enrollment (CoE)." },
            { step: "03", title: "OSHC", desc: "Purchase Overseas Student Health Cover." },
            { step: "04", title: "Visa", desc: "Apply for Subclass 500 Student Visa." },
            { step: "05", title: "Arrive", desc: "Fly to Australia and commence your studies!" }
        ],
        studyLevels: [
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
                id: "diploma",
                title: "Diplomas & Certs",
                icon: <FileText className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["High school completion.","IELTS 5.5 - 6.0.","Vocational focus."],
                exam: "No specific entrance exam.",
                docs: genericUGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Bachelors Degree",
                description: "Undergraduate programs offering strong foundational and practical knowledge.",
                rows: [
                    { year: "Tuition", tuition: "AUD 30,000 - 45,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "AUD 24,500 / yr" }
                ]
            },
            {
                university: "Masters Degree",
                description: "Postgraduate programs focused on specialization and research.",
                rows: [
                    { year: "Tuition", tuition: "AUD 35,000 - 50,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "AUD 24,500 / yr" }
                ]
            }
        ]
    },
    canada: {
        name: "Canada",
        subtitle: "The Welcoming North",
        heroText: "STUDY",
        heroHighlight: "CANADA.",
        heroDesc: "Join one of the world's most welcoming countries with exceptional academic quality and clear pathways to permanent residency.",
        videoSrc: canVideo,
        currencyIcon: <DollarSign className="w-10 h-10 text-accent-gold" />,
        currencyText: "PGWP Visa",
        currencyValue: "Up to 3 Yrs",
        floatingCards: [
            { title: "Post-Graduation", subtitle: "Work Permit", icon: <Briefcase /> },
            { title: "Welcoming", subtitle: "Society", icon: <HeartHandshake /> },
            { title: "Strong Job", subtitle: "Market", icon: <Building2 /> },
            { title: "Affordable", subtitle: "Education", icon: <Coins /> }
        ],
        opportunities: [
            { title: "PR Pathway", desc: "Clear points-based immigration system (Express Entry) favors international graduates.", icon: <ShieldCheck className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "Co-op Programs", desc: "Gain paid, professional work experience integrated into your degree.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Affordable North America", desc: "Tuition is generally lower compared to the US and UK.", icon: <Coins className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Safe & Multicultural", desc: "Consistently ranked as one of the safest countries globally.", icon: <HeartHandshake className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Top Universities", desc: "Home to globally ranked institutions like UofT and UBC.", icon: <Building2 className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Business & Finance", programs: ["MBA", "Finance", "Supply Chain Management"], institutions: "Rotman (UofT), Sauder (UBC)", icon: <Building2 className="w-6 h-6 text-blue-400" /> },
            { category: "Engineering", programs: ["Civil Eng", "Mechanical Eng", "Software Eng"], institutions: "Waterloo, McGill", icon: <PlaneTakeoff className="w-6 h-6 text-accent-gold" /> },
            { category: "Media & Arts", programs: ["Animation", "Digital Media", "Film Studies"], institutions: "Sheridan, Ryerson", icon: <Sparkles className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Apply to a Designated Learning Institution (DLI)." },
            { step: "02", title: "Acceptance", desc: "Receive your Letter of Acceptance (LOA) and pay tuition." },
            { step: "03", title: "GIC", desc: "Open a Guaranteed Investment Certificate (GIC) if applying via SDS." },
            { step: "04", title: "Permit", desc: "Apply for your Canadian Study Permit and Biometrics." },
            { step: "05", title: "Travel", desc: "Fly to Canada and receive your permit at the border." }
        ],
        studyLevels: [
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
                id: "diploma",
                title: "Diplomas & Certs",
                icon: <FileText className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["High school completion.","IELTS 5.5 - 6.0.","Vocational focus."],
                exam: "No specific entrance exam.",
                docs: genericUGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Colleges (Diplomas)",
                description: "Practical, career-focused programs (1-3 years).",
                rows: [
                    { year: "Tuition", tuition: "CAD 15,000 - 20,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "CAD 20,635 / yr" }
                ]
            },
            {
                university: "Universities (Degrees)",
                description: "Academic and research-focused undergraduate and graduate degrees.",
                rows: [
                    { year: "Tuition", tuition: "CAD 25,000 - 40,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "CAD 20,635 / yr" }
                ]
            }
        ]
    },
    france: {
        name: "France",
        subtitle: "The Heart of Europe",
        heroText: "STUDY",
        heroHighlight: "FRANCE.",
        heroDesc: "Immerse yourself in culture, innovation, and top-tier business and engineering schools with heavily subsidized tuition.",
        videoSrc: fraVideo,
        currencyIcon: <Euro className="w-10 h-10 text-accent-gold" />,
        currencyText: "Post-Study Visa",
        currencyValue: "Up to 2 Yrs",
        floatingCards: [
            { title: "Learn", subtitle: "French", icon: <BookOpen /> },
            { title: "European", subtitle: "Job Market", icon: <Briefcase /> },
            { title: "Cultural", subtitle: "Exposure", icon: <MapPin /> },
            { title: "Industry", subtitle: "Connections", icon: <Building2 /> }
        ],
        opportunities: [
            { title: "Subsidized Education", desc: "Public universities have extremely low tuition fees subsidized by the state.", icon: <Euro className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "Grandes Écoles", desc: "Access to elite, world-renowned Business and Engineering schools.", icon: <Building2 className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Housing Aid (CAF)", desc: "International students can apply for a state housing subsidy.", icon: <Coins className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Post-Study Work", desc: "Up to 2-year job seeker visa for Master's graduates.", icon: <Briefcase className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Cultural Epicenter", desc: "Live in a country famous for art, cuisine, and history.", icon: <HeartHandshake className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Business & Management", programs: ["MiM (Master in Management)", "MBA", "Luxury Brand Management"], institutions: "HEC Paris, INSEAD, ESSEC", icon: <Building2 className="w-6 h-6 text-blue-400" /> },
            { category: "Engineering", programs: ["Aerospace", "Data Science", "Renewable Energy"], institutions: "École Polytechnique, CentraleSupélec", icon: <PlaneTakeoff className="w-6 h-6 text-accent-gold" /> },
            { category: "Fashion & Design", programs: ["Fashion Design", "Interior Architecture", "Fine Arts"], institutions: "Institut Français de la Mode", icon: <Sparkles className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Apply via Études en France or directly to the institution." },
            { step: "02", title: "Campus France", desc: "Complete the Campus France interview and academic screening." },
            { step: "03", title: "Acceptance", desc: "Receive acceptance and arrange accommodation." },
            { step: "04", title: "Visa", desc: "Apply for a long-stay student visa (VLS-TS) at VFS." },
            { step: "05", title: "Arrive", desc: "Validate your visa online, apply for CAF, and start classes." }
        ],
        studyLevels: [
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
                id: "diploma",
                title: "Diplomas & Certs",
                icon: <FileText className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["High school completion.","IELTS 5.5 - 6.0.","Vocational focus."],
                exam: "No specific entrance exam.",
                docs: genericUGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Public Universities",
                description: "State-funded institutions offering standard degrees.",
                rows: [
                    { year: "Bachelor's", tuition: "€ 2,770 / yr", admin: "CVEC €100", total: "€ 2,870" },
                    { year: "Master's", tuition: "€ 3,770 / yr", admin: "CVEC €100", total: "€ 3,870" }
                ]
            },
            {
                university: "Grandes Écoles (Private)",
                description: "Elite institutions focused on Business and Engineering.",
                rows: [
                    { year: "Business", tuition: "€ 10k - 30k / yr", admin: "-", total: "Varies" },
                    { year: "Engineering", tuition: "€ 5k - 20k / yr", admin: "-", total: "Varies" }
                ]
            }
        ]
    },
    germany: {
        name: "Germany",
        subtitle: "The Engineering & Tech Hub",
        heroText: "STUDY",
        heroHighlight: "GERMANY.",
        heroDesc: "Experience world-class education with zero to low tuition fees at prestigious public universities.",
        videoSrc: gerVideo,
        currencyIcon: <Euro className="w-10 h-10 text-accent-gold" />,
        currencyText: "Post-Study Visa",
        currencyValue: "18 Months",
        floatingCards: [
            { title: "Zero", subtitle: "Tuition Fees", icon: <Euro /> },
            { title: "English", subtitle: "Taught Programs", icon: <GraduationCap /> },
            { title: "Pathway", subtitle: "To PR", icon: <ShieldCheck /> },
            { title: "Strong", subtitle: "Economy", icon: <Building2 /> }
        ],
        opportunities: [
            { title: "Zero Tuition Fees", desc: "Most public universities charge no tuition, only a small semester contribution.", icon: <Euro className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "18-Month Work Visa", desc: "Generous post-study visa to find employment in Europe's largest economy.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Industry Connections", desc: "Direct pathways to giants like VW, Siemens, and SAP.", icon: <Building2 className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Research Excellence", desc: "Home to the Max Planck and Fraunhofer institutes.", icon: <BookOpen className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "English Programs", desc: "Thousands of degrees fully taught in English.", icon: <GraduationCap className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Engineering", programs: ["Mechanical Engineering", "Automotive Engineering", "Robotics"], institutions: "TU Munich, RWTH Aachen", icon: <Building2 className="w-6 h-6 text-blue-400" /> },
            { category: "IT & Data Science", programs: ["MSc Artificial Intelligence", "Data Engineering", "Cybersecurity"], institutions: "TU Berlin, Uni Stuttgart", icon: <PlaneTakeoff className="w-6 h-6 text-accent-gold" /> },
            { category: "Business", programs: ["MBA", "MSc Management", "Finance"], institutions: "Frankfurt School, Mannheim", icon: <Sparkles className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Research", desc: "Use DAAD to shortlist universities and check eligibility (Studienkolleg)." },
            { step: "02", title: "Apply", desc: "Submit your application via uni-assist or direct university portals." },
            { step: "03", title: "Blocked Account", desc: "Open a blocked account and deposit living expenses (€11,904)." },
            { step: "04", title: "Visa", desc: "Apply for a German national student visa at the embassy." },
            { step: "05", title: "Enroll", desc: "Arrive, register your address, get insurance, and start classes." }
        ],
        studyLevels: [
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
                id: "phd",
                title: "PhD & Research",
                icon: <Sparkles className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["Master's Degree.","Strong research proposal.","Academic publications (bonus)."],
                exam: "Interviews with potential supervisors.",
                docs: genericPGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Public Universities",
                description: "State-funded institutions offering virtually free education to international students.",
                rows: [
                    { year: "Per Semester", tuition: "€ 0", admin: "€ 150 - 350", total: "€ 150 - 350" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "€ 934 / month" }
                ]
            },
            {
                university: "Private Universities",
                description: "Specialized institutions focusing on smaller classes and industry networking.",
                rows: [
                    { year: "Bachelor's", tuition: "€ 10,000", admin: "-", total: "€ 10,000 / yr" },
                    { year: "Master's", tuition: "€ 15,000", admin: "-", total: "€ 15,000 / yr" }
                ]
            }
        ]
    },
    ireland: {
        name: "Ireland",
        subtitle: "The Silicon Valley of Europe",
        heroText: "STUDY",
        heroHighlight: "IRELAND.",
        heroDesc: "Study in an English-speaking tech hub and launch your global career with top multinational companies.",
        videoSrc: ireVideo,
        currencyIcon: <Euro className="w-10 h-10 text-accent-gold" />,
        currencyText: "Post-Study Visa",
        currencyValue: "Up to 2 Yrs",
        floatingCards: [
            { title: "Gateway", subtitle: "To Europe", icon: <MapPin /> },
            { title: "English", subtitle: "Speaking", icon: <BookOpen /> },
            { title: "Global", subtitle: "Tech Hub", icon: <Building2 /> },
            { title: "High", subtitle: "Employability", icon: <Briefcase /> }
        ],
        opportunities: [
            { title: "Tech & Pharma Hub", desc: "European headquarters for Google, Meta, Apple, and Pfizer.", icon: <Building2 className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "2-Year Work Visa", desc: "Master's graduates can stay back for 2 years to find a job.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "English Speaking", desc: "The only fully English-speaking country in the Eurozone.", icon: <BookOpen className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "High Employability", desc: "Strong links between universities and industries.", icon: <PlaneTakeoff className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Friendly Culture", desc: "Known for its welcoming people, safety, and rich heritage.", icon: <HeartHandshake className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Computer Science", programs: ["Data Analytics", "Cloud Computing", "Software Engineering"], institutions: "Trinity College, UCD", icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" /> },
            { category: "Pharmaceuticals", programs: ["Biotechnology", "Pharmacy", "Regulatory Affairs"], institutions: "RCSI, University of Galway", icon: <Stethoscope className="w-6 h-6 text-accent-gold" /> },
            { category: "Business", programs: ["Digital Marketing", "Finance", "MBA"], institutions: "UCD Smurfit, DCU", icon: <Building2 className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Apply directly to Irish universities or through an agent." },
            { step: "02", title: "Offer", desc: "Receive conditional/unconditional offer and pay deposit." },
            { step: "03", title: "Finances", desc: "Arrange proof of funds (approx. €10,000 living costs)." },
            { step: "04", title: "Visa", desc: "Apply for the Irish Study Visa online and submit docs." },
            { step: "05", title: "Arrive", desc: "Travel to Ireland and register with the Garda National Immigration Bureau (GNIB)." }
        ],
        studyLevels: [
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
                id: "phd",
                title: "PhD & Research",
                icon: <Sparkles className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["Master's Degree.","Strong research proposal.","Academic publications (bonus)."],
                exam: "Interviews with potential supervisors.",
                docs: genericPGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Undergraduate",
                description: "3 to 4 year Bachelor degree programs.",
                rows: [
                    { year: "Tuition", tuition: "€ 12,000 - 20,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "€ 10,000 - 15,000 / yr" }
                ]
            },
            {
                university: "Postgraduate",
                description: "1-year intensive Master degree programs.",
                rows: [
                    { year: "Tuition", tuition: "€ 14,000 - 30,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "€ 10,000 - 15,000 / yr" }
                ]
            }
        ]
    },
    uk: {
        name: "United Kingdom",
        subtitle: "A Legacy of Excellence",
        heroText: "STUDY IN",
        heroHighlight: "THE UK.",
        heroDesc: "Fast-track your career with 1-year Master's programs and a 2-year post-study work visa at world-leading institutions.",
        videoSrc: ukVideo,
        currencyIcon: <PoundSterling className="w-10 h-10 text-accent-gold" />,
        currencyText: "Graduate Route",
        currencyValue: "2 Years",
        floatingCards: [
            { title: "Flexible", subtitle: "Courses", icon: <BookOpen /> },
            { title: "Global", subtitle: "Exposure", icon: <MapPin /> },
            { title: "Post-Study", subtitle: "Work Visa", icon: <Briefcase /> },
            { title: "Multicultural", subtitle: "Environment", icon: <HeartHandshake /> }
        ],
        opportunities: [
            { title: "1-Year Master's", desc: "Save time and money with intensive one-year postgraduate degrees.", icon: <GraduationCap className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "Graduate Route Visa", desc: "Stay in the UK for 2 years (3 for PhD) to work after graduating.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Russell Group", desc: "Access to 24 world-class, research-intensive universities.", icon: <Building2 className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "High Standard", desc: "Strict quality standards guarantee a premium education.", icon: <ShieldCheck className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Global Hub", desc: "London and other cities are epicenters of finance, arts, and tech.", icon: <MapPin className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Business & Management", programs: ["MBA", "MSc Management", "International Business"], institutions: "LBS, Imperial College, Warwick", icon: <Building2 className="w-6 h-6 text-blue-400" /> },
            { category: "Law", programs: ["LLM", "Corporate Law", "Human Rights Law"], institutions: "UCL, King's College", icon: <Landmark className="w-6 h-6 text-accent-gold" /> },
            { category: "Data & IT", programs: ["Data Science", "Artificial Intelligence", "Cyber Security"], institutions: "Edinburgh, Manchester", icon: <PlaneTakeoff className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Use UCAS for UG, or apply directly to universities for PG." },
            { step: "02", title: "Offer", desc: "Receive conditional/unconditional offer." },
            { step: "03", title: "CAS", desc: "Pay deposit to receive Confirmation of Acceptance for Studies (CAS)." },
            { step: "04", title: "Visa", desc: "Apply for the UK Student Visa (Tier 4) and pay IHS surcharge." },
            { step: "05", title: "Arrive", desc: "Collect your BRP (Biometric Residence Permit) upon arrival." }
        ],
        studyLevels: [
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
                id: "phd",
                title: "PhD & Research",
                icon: <Sparkles className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["Master's Degree.","Strong research proposal.","Academic publications (bonus)."],
                exam: "Interviews with potential supervisors.",
                docs: genericPGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Undergraduate",
                description: "Standard 3-year Bachelor degree programs.",
                rows: [
                    { year: "Tuition", tuition: "£ 15,000 - 25,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "£ 9,000 - 12,000 / yr" }
                ]
            },
            {
                university: "Postgraduate",
                description: "Intensive 1-year Master degree programs.",
                rows: [
                    { year: "Tuition", tuition: "£ 18,000 - 35,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "£ 9,000 - 12,000 / yr" }
                ]
            }
        ]
    },
    usa: {
        name: "United States",
        subtitle: "The American Dream",
        heroText: "STUDY",
        heroHighlight: "IN USA.",
        heroDesc: "Unlock limitless potential in the world's leading destination for higher education, innovation, and research.",
        videoSrc: usaVideo,
        currencyIcon: <DollarSign className="w-10 h-10 text-accent-gold" />,
        currencyText: "OPT Extension",
        currencyValue: "Up to 3 Yrs",
        floatingCards: [
            { title: "World-Leading", subtitle: "Universities", icon: <GraduationCap /> },
            { title: "Flexible", subtitle: "Education", icon: <BookOpen /> },
            { title: "Up to 36 Months", subtitle: "STEM OPT", icon: <Briefcase /> },
            { title: "Global", subtitle: "Network", icon: <HeartHandshake /> }
        ],
        opportunities: [
            { title: "STEM OPT", desc: "STEM graduates can work in the US for up to 3 years without an H1B visa.", icon: <ShieldCheck className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
            { title: "Academic Flexibility", desc: "Change majors and explore diverse subjects before declaring a focus.", icon: <BookOpen className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Campus Life", desc: "Unmatched collegiate experience with sprawling campuses and sports.", icon: <HeartHandshake className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Funding Options", desc: "Abundant RA/TA positions and merit scholarships available.", icon: <Coins className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
            { title: "Global Network", desc: "Build connections in the world's largest economy.", icon: <Building2 className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
        ],
        popularCourses: [
            { category: "Computer Science", programs: ["Software Eng", "AI & ML", "Data Science"], institutions: "MIT, Stanford, CMU", icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" /> },
            { category: "Business", programs: ["MBA", "Finance", "Business Analytics"], institutions: "Wharton, Harvard, Columbia", icon: <Building2 className="w-6 h-6 text-accent-gold" /> },
            { category: "Engineering", programs: ["Aerospace", "Electrical", "Biomedical"], institutions: "Caltech, Georgia Tech", icon: <Sparkles className="w-6 h-6 text-purple-400" /> }
        ],
        journeySteps: [
            { step: "01", title: "Apply", desc: "Shortlist universities, clear GRE/GMAT and TOEFL/IELTS." },
            { step: "02", title: "I-20 Form", desc: "Receive admission offer and the I-20 form from your university." },
            { step: "03", title: "SEVIS Fee", desc: "Pay the SEVIS fee online." },
            { step: "04", title: "F-1 Visa", desc: "Fill DS-160, schedule and clear your F-1 Visa interview." },
            { step: "05", title: "Arrive", desc: "Travel to the US up to 30 days before classes start." }
        ],
        studyLevels: [
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
                id: "mba",
                title: "MBA Programs",
                icon: <Briefcase className="w-8 h-8 text-accent-gold" />,
                themeColor: "text-accent-gold",
                bgGlow: "bg-accent-gold/10",
                bgBox: "bg-accent-gold/5",
                borderBox: "border-accent-gold/20",
                checkedBg: "bg-accent-gold/10",
                checkedBorder: "border-accent-gold/40",
                checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
                eligibility: ["Bachelor's Degree.","2-5 years work experience.","IELTS 6.5+ / TOEFL 90+."],
                exam: "GMAT or GRE usually required for top B-Schools.",
                docs: genericPGDocs
            }
        ],
        tuitionCards: [
            {
                university: "Public Universities",
                description: "State-funded institutions (Out-of-state tuition applies).",
                rows: [
                    { year: "Tuition", tuition: "$ 25,000 - 40,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "$ 15,000 - 20,000 / yr" }
                ]
            },
            {
                university: "Private Universities",
                description: "Ivy League and other top-tier private institutions.",
                rows: [
                    { year: "Tuition", tuition: "$ 40,000 - 65,000", admin: "-", total: "Varies" },
                    { year: "Living Cost", tuition: "-", admin: "-", total: "$ 15,000 - 25,000 / yr" }
                ]
            }
        ]
    }
};
