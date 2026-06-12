import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Lock, ShieldCheck, Zap, ArrowRight, Loader2,
  Check, FileText, CheckCircle, Gift, Info, Trash2, Landmark, Briefcase, Award, Globe, X,
  BookOpen, HeartHandshake, Building2, Stethoscope, Search, FileCheck, ClipboardList, MailOpen, FileEdit, Fingerprint, Home, Plane, CheckCircle2, ChevronRight, GraduationCap, Euro, Coins, PlaneTakeoff
} from 'lucide-react';
import FeesTable from './FeesTable';
import { API_BASE_URL } from '../config';
import { getPhases } from '../config/feesHelper';
import { COUPONS } from '../config/coupons';
import { countryData } from '../data/countryData';
import { useTheme } from '../ThemeContext';
import useLocalLayoutScale from '../hooks/useLocalLayoutScale';

const ConfettiBlast = () => {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-[9999]">
      {particles.map((_, i) => {
        const angle = (i / 30) * 360;
        const radius = Math.random() * 120 + 60;
        const xTarget = Math.cos(angle * Math.PI / 180) * radius;
        const yTarget = Math.sin(angle * Math.PI / 180) * radius - 30;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: xTarget,
              y: yTarget,
              scale: Math.random() * 1.5 + 0.5,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#a78bfa' : '#c084fc',
              boxShadow: '0 0 8px rgba(167, 139, 250, 0.8)'
            }}
          />
        );
      })}
    </div>
  );
};

const countriesComparisonData = [
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    subtitle: 'Top Scholarships & Stipends',
    univTuition: 'No Tuition Fee',
    workRights: '12 Months Stay-back',
    benefits: [
      '€7,000 Stipend*/year',
      '12-Month Post-Study Work Visa',
      'Rich Culture, History & Art',
      'Globally Ranked Universities',
      'English-Taught Degrees (No IELTS Req.)'
    ],
    themeColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.15)'
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    subtitle: 'Zero Tuition & Tech Hub',
    univTuition: 'Public: €0 | Private: €10k - €20k / yr',
    workRights: '18 Months Stay-back',
    benefits: [
      'Zero Tuition at Public Universities',
      '18-Month Job Seeker Visa',
      'Direct Pathways to Global Giants',
      'World-Leading Research Institutes',
      'Fully English-Taught Degrees'
    ],
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    subtitle: 'Subsidized Fees & Housing Aid',
    univTuition: '€2,770 - €3,770 / yr',
    workRights: 'Up to 2 Years Stay-back',
    benefits: [
      'Highly Subsidized Public Tuition',
      'Elite Business & Engineering Schools',
      'State-Funded Housing Subsidies',
      '2-Year Job Seeker Visa (Masters)',
      'Rich Art, Cuisine & History'
    ],
    themeColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.15)'
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    subtitle: 'Fast-Track PR & Co-op Jobs',
    univTuition: 'CAD 15,000 - 40,000 / yr',
    workRights: 'Up to 3 Years PGWP',
    benefits: [
      'Clear Express Entry PR Pathways',
      'Paid Co-op Work Experience',
      'Affordable Tuition vs. US/UK',
      'Ranked Among Safest Countries',
      'Top Global Institutions (UofT, UBC)'
    ],
    themeColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.15)'
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    subtitle: 'STEM OPT & High Salaries',
    univTuition: '$25,000 - $65,000 / yr',
    workRights: 'Up to 3 Years STEM OPT',
    benefits: [
      'Up to 3-Year STEM OPT Work Visa',
      'Flexible Majors & Curriculum',
      'Unmatched Campus & Sports Life',
      'High Availability of RA/TA Funding',
      "Network in the World's Largest Economy"
    ],
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    subtitle: "1-Year Master's & Legacy",
    univTuition: '£15,000 - £35,000 / yr',
    workRights: '2 Years Graduate Route',
    benefits: [
      "Intensive 1-Year Master's Degrees",
      '2-Year Graduate Work Route',
      '24 Russell Group Universities',
      'Premium Academic Quality Standards',
      'Epicenter of Finance & Tech'
    ],
    themeColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.15)'
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    subtitle: 'High Wages & Warm Climate',
    univTuition: 'AUD 30,000 - 50,000 / yr',
    workRights: 'Up to 4 Years Post-Study',
    benefits: [
      'Up to 4-Year Post-Study Visa',
      'World-Renowned Research Hubs',
      'High Part-Time Wages for Students',
      'Safe, Multicultural Environment',
      'Globally Recognized Qualifications'
    ],
    themeColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.15)'
  },
  {
    id: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    subtitle: 'Tech Hub of Europe',
    univTuition: '€12,000 - €30,000 / yr',
    workRights: '2 Years Post-Study',
    benefits: [
      'European HQ for Tech Giants',
      '2-Year Stay-Back Visa for Masters',
      '100% English-Speaking Eurozone',
      'Strong Industry-University Links',
      'Safe & Welcoming Environment'
    ],
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'georgia',
    name: 'Georgia',
    flag: '🇬🇪',
    subtitle: 'Premier Medical Destination',
    univTuition: '$4,000 - $8,000 / yr',
    workRights: '1 Year Stay-back',
    benefits: [
      'WHO & NMC Recognized Universities',
      'English-Taught MBBS Programs',
      'No Entrance Exams (No IELTS/TOEFL)',
      'High FMGE Passing Rate',
      'European Standard of Living'
    ],
    themeColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.15)'
  },
  {
    id: 'russia',
    name: 'Russia',
    flag: '🇷🇺',
    subtitle: 'World-Class Medical Education',
    univTuition: '$3,000 - $6,000 / yr',
    workRights: 'Work Alongside Study',
    benefits: [
      'Top Ranked Medical Universities',
      'Highly Subsidized Education',
      'English-Taught MBBS Programs',
      'WHO, NMC, ECFMG Recognized',
      'Advanced Clinical Training'
    ],
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.15)'
  },

];

const italyData = {
  name: "Italy",
  subtitle: "DSU Scholarships & Subsidized Education",
  opportunities: [
    { title: "Regional Scholarships (DSU)", desc: "Need-based scholarships from regional governments covering tuition, accommodation, and offering a yearly €8,000 stipend.", icon: <Euro className="w-6 h-6 text-accent-gold" />, colSpan: "md:col-span-2 lg:col-span-2", bg: "bg-gradient-to-br from-accent-gold/10 to-transparent border-accent-gold/30" },
    { title: "Post-Study Work Visa", desc: "Non-EU graduates can apply for a 12-month work visa.", icon: <Briefcase className="w-6 h-6 text-blue-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
    { title: "Cultural Immersion", desc: "Live in an 'outdoor classroom' surrounded by thousands of years of history and art.", icon: <HeartHandshake className="w-6 h-6 text-rose-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
    { title: "Top-Tier Universities", desc: "Access to prestigious, globally-ranked institutions with very low tuition fees.", icon: <Building2 className="w-6 h-6 text-indigo-400" />, colSpan: "md:col-span-1 lg:col-span-1", bg: "bg-white/5 border-white/10" },
    { title: "English-Taught Programs", desc: "With/Without IELTS. Full degree programs taught entirely in English.", icon: <BookOpen className="w-6 h-6 text-emerald-400" />, colSpan: "md:col-span-2 lg:col-span-1", bg: "bg-white/5 border-white/10" }
  ],
  popularCourses: [
    {
      category: "Engineering & Technology",
      programs: ["BSc/MSc Computer Science", "MSc Artificial Intelligence", "Mechanical & Aerospace"],
      institutions: "Politecnico di Milano, Politecnico di Torino",
      icon: <PlaneTakeoff className="w-6 h-6 text-blue-400" />
    },
    {
      category: "Business & Economics",
      programs: ["BSc Business Administration", "MSc International Management", "Economics & Finance"],
      institutions: "Sapienza University, University of Bologna",
      icon: <Building2 className="w-6 h-6 text-accent-gold" />
    },
    {
      category: "Architecture & Design",
      programs: ["BSc Architectural Design", "MSc Interior Design", "Fashion Studies"],
      institutions: "Politecnico di Milano, Florence Design Academy",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />
    }
  ],
  journeySteps: [
    { step: "01", title: "Find a Program", desc: "Choose your course and university in Italy." },
    { step: "02", title: "Verify Requirements", desc: "Ensure your GPA, exams, and IELTS requirements match." },
    { step: "03", title: "Admission Process", desc: "Submit your application to the university portal." },
    { step: "04", title: "Receive Offer Letter", desc: "Get accepted and obtain your pre-acceptance letter." },
    { step: "05", title: "Scholarship & Docs", desc: "Compile your family income documents for the DSU regional scholarship." },
    { step: "06", title: "Pre-Enrollment", desc: "Register on the Universitaly portal for visa pre-evaluation." },
    { step: "07", title: "Apply for Visa", desc: "Submit documents to the embassy/VFS." },
    { step: "08", title: "Visa Granted", desc: "Receive your study visa to enter Italy." },
    { step: "09", title: "Fly to Italy", desc: "Commence your travel to your Italian city." },
    { step: "10", title: "Apply Tax Code", desc: "Get your Codice Fiscale (tax number) upon arrival." },
    { step: "11", title: "University Enroll", desc: "Complete official physical registration at the secretariat." },
    { step: "12", title: "Residence Permit", desc: "Apply for your Permesso di Soggiorno within 8 days of landing." }
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
        "Minimum 65% and above.",
        "With or without IELTS."
      ],
      exam: "Many programs require the CEnT-S or SAT exam for Engineering, Economics, etc.",
      docs: [
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "Passport-size photographs",
        "English Proficiency (IELTS/TOEFL)",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs"
      ]
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
        "Bachelor's degree (3 or 4 yrs).",
        "Minimum 70% and above.",
        "With or without IELTS."
      ],
      exam: "Based on academic profile, Portfolio and Interview (if required)",
      docs: [
        "Bachelor's Degree and Transcripts",
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "English Proficiency (IELTS/TOEFL)",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs"
      ]
    },
    {
      id: "mbbs",
      title: "MBBS in Italy",
      icon: <Stethoscope className="w-8 h-8 text-accent-gold" />,
      themeColor: "text-accent-gold",
      bgGlow: "bg-accent-gold/10",
      bgBox: "bg-accent-gold/5",
      borderBox: "border-accent-gold/20",
      checkedBg: "bg-accent-gold/10",
      checkedBorder: "border-accent-gold/40",
      checkedInput: "checked:bg-accent-gold checked:border-accent-gold",
      eligibility: [
        "10+2 with Science (PCB).",
        "Minimum 65% and above.",
        "Age 17+ by Dec 2025."
      ],
      exam: "Must clear the IMAT (mandatory for public medical universities).",
      docs: [
        "10th, 11th & 12th Mark Sheets",
        "Valid Passport",
        "Passport-size photographs",
        "English Proficiency (IELTS/TOEFL)",
        "Motivation Letter / SOP",
        "Europass CV",
        "2 LORs",
        "NEET Score Card"
      ]
    }
  ],
  tuitionCards: [
    {
      university: "DSU State Scholarship (Fully Subsidized)",
      description: "Most international students in public Italian universities qualify for the need-based DSU Scholarship, which completely waives university tuition and provides cost-of-living stipends.",
      rows: [
        { year: "Tuition Fee Waiver", total: "FUNDED" },
        { year: "Yearly Cash Stipend", total: "Up to €7,000 - €8,000 / yr" },
        { year: "Accommodation & Meals", total: "Free Dorms & Canteen" }
      ]
    },
    {
      university: "Public Universities (Without Scholarship)",
      description: "If you do not apply for or receive the DSU Scholarship, public university fees in Italy remain extremely low compared to other countries.",
      rows: [
        { year: "Average Tuition", total: "€1,000 - €3,000 / yr" },
        { year: "Estimated Living Expenses", total: "€700 - €900 / month" }
      ]
    }
  ]
};

const Subscriptions = ({ profile, refreshProfile, isStandalone = false }) => {
  const layoutScale = useLocalLayoutScale(1536);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('Bachelors');
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [popupCountryId, setPopupCountryId] = useState(null);
  const [popupSelectedLevel, setPopupSelectedLevel] = useState(null);
  const [popupUniType, setPopupUniType] = useState('Public');
  const { activeTheme } = useTheme();
  const popupIsDark = activeTheme === 'dark';
  const [activeModalTab, setActiveModalTab] = useState('highlights');
  const [checkedDocs, setCheckedDocs] = useState({});
  const toggleDoc = (category, index) => {
    const key = `${category}-${index}`;
    setCheckedDocs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const [selectedCountry, setSelectedCountry] = useState(profile?.country?.toLowerCase() || 'italy');

  useEffect(() => {
    if (profile?.country) {
      setSelectedCountry(profile.country.toLowerCase());
    }
  }, [profile]);

  const countryId = selectedCountry;
  const isPaid = profile?.portalUnlocked;

  // 1. Calculate prices using the universal getPhases helper
  const basePhases = getPhases(countryId, 'Public', selectedProgram, '');
  const basePrice = basePhases[0];

  const currentPhases = getPhases(countryId, 'Public', selectedProgram, activeCoupon);
  const discountedPrice = currentPhases[0];

  // Calculate tax (18% GST for academic processing)
  const taxRate = 0.18;
  const taxAmount = Math.round(discountedPrice * taxRate);
  const totalSecureCheckoutAmount = discountedPrice + taxAmount;

  const getProcessingFeeDetails = (cId) => {
    const basePhases = getPhases(cId, 'Public', selectedProgram, '');
    const discPhases = getPhases(cId, 'Public', selectedProgram, activeCoupon);
    const baseP = basePhases.reduce((acc, curr) => acc + curr, 0);
    const discP = discPhases.reduce((acc, curr) => acc + curr, 0);
    const rate = 0.18;

    const baseT = Math.round(baseP * rate);
    const discT = Math.round(discP * rate);

    return {
      baseP,
      discP,
      baseT,
      discT,
      baseTotal: baseP + baseT,
      discTotal: discP + discT,
      hasDiscount: activeCoupon && discP < baseP
    };
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code] !== undefined) {
      setCouponDiscount(COUPONS[code]);
      setActiveCoupon(code);
      setShowConfetti(true);
      setSuccessMsg(`Congratulations! ${code} applied successfully.`);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setError('Invalid Promo Code. Please try another one.');
      setCouponDiscount(0);
      setActiveCoupon('');
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon('');
    setCouponInput('');
    setCouponDiscount(0);
    setSuccessMsg('');
    setError(null);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call backend to create Razorpay order securely
      const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({
          itemId: 'dynamic_fee',
          pricingParams: {
            countryId: countryId,
            uniType: 'Public',
            selectedLevel: selectedProgram,
            applied: !!activeCoupon,
            couponCode: activeCoupon
          },
          userEmail: profile?.email || ''
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Initialize Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Presume Overseas',
        description: `Premium Upgrade - ${selectedProgram}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            setLoading(false);
            setSuccessMsg('Portal Unlocked Successfully! Redirecting...');
            if (refreshProfile) await refreshProfile();
          } catch (verifyError) {
            setError(verifyError.message);
            setLoading(false);
          }
        },
        prefill: {
          name: `${profile?.firstName || ''} ${profile?.lastName || ''}`,
          email: profile?.email || '',
        },
        theme: {
          color: '#fbbf24' // Amber/Gold
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const eliteServices = [
    { title: 'SOP Creation & Review', desc: 'Professionally curated statements written to match premium admissions committees.' },
    { title: 'Document Drafting & CV Crafting', desc: 'Expert structure for academic recommendation letters (LOR) and resumes.' },
    { title: 'Dedicated 1-on-1 Counseling', desc: 'Your own designated study-abroad expert to guide every milestone.' },
    { title: 'End-to-End Visa Filing', desc: 'Full preparation and filing support for quick visa clearance.' },
    { title: 'Application Milestones Tracking', desc: 'Unlock live updates, direct letters, and admission track history.' }
  ];

  return (
    <div style={{ padding: '0', position: 'relative', height: isStandalone ? 'auto' : '100%', display: 'flex', flexDirection: 'column' }}>
      {showConfetti && <ConfettiBlast />}

      {/* Country Comparison Hub */}
      <div style={{
        marginTop: '0px',
        padding: '30px',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '32px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        flex: isStandalone ? 'none' : 1,
        minHeight: isStandalone ? 'auto' : 0,
        zoom: isStandalone ? 0.75 : Math.min(layoutScale, 1.2) * 0.9
      }}>

        {/* Hub Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '35px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            <Globe size={24} style={{ color: 'var(--accent-primary)' }} /> Study Abroad Destination & Fee Matcher
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            Explore university tuition fees, stay-back work rights, and regional benefits across leading destinations. Compare our dynamic Elite support fees and select your target to update the checkout above in real-time.
          </p>
        </div>

        {/* Comparison Grid — flex layout to take remaining height */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'visible',
            padding: '8px 4px 48px 4px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--accent-primary) transparent',
          }}>
            {countriesComparisonData.map((c) => {
              const fee = getProcessingFeeDetails(c.id);
              const isSelected = selectedCountry === c.id;

              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    gridColumn: c.id === 'germany' ? 'span 2' : 'span 1',
                    background: isSelected ? 'rgba(251, 191, 36, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                    border: isSelected ? `2px solid ${c.themeColor}` : '1px solid rgba(150, 150, 150, 0.3)',
                    boxShadow: isSelected ? `0 12px 35px ${c.glowColor}` : 'none',
                    borderRadius: '20px',
                    padding: '22px 18px',
                    minHeight: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Active Glow Decorator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '-40px',
                      right: '-40px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: c.themeColor,
                      opacity: 0.15,
                      filter: 'blur(25px)'
                    }} />
                  )}

                  {/* Country Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{c.flag}</span>
                    <div>
                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        margin: 0,
                      }}>
                        {c.name}
                      </h3>
                      <span className="country-theme-text" style={{
                        fontSize: '0.7rem',
                        color: c.themeColor,
                        fontWeight: 700,
                        display: 'block',
                        marginTop: '2px'
                      }}>
                        {c.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Micro Info Badges */}
                  {c.id === 'germany' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {countryData.germany.tuitionCards.map((tc, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', borderRadius: '12px', border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)', background: idx === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)' }}>
                          <div style={{ fontSize: '0.7rem', color: idx === 0 ? '#10b981' : '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{tc.university}</div>
                          {tc.rows.slice(0, 2).map((row, rIdx) => (
                            <div key={rIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {rIdx === 0 ? <Landmark size={10} /> : <Briefcase size={10} />} {row.year}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>{row.total || row.tuition}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px 10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', background: 'rgba(255, 255, 255, 0.01)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Landmark size={10} /> Tuition
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>{c.univTuition}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase size={10} /> Visa
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'right' }}>{c.workRights}</span>
                      </div>
                    </div>
                  )}

                  {/* Benefits Bullet Points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      Key Advantages
                    </span>
                    <div style={{ 
                      display: c.id === 'germany' ? 'grid' : 'flex', 
                      gridTemplateColumns: c.id === 'germany' ? '1fr 1fr' : 'none', 
                      flexDirection: c.id === 'germany' ? 'row' : 'column', 
                      gap: c.id === 'germany' ? '8px 16px' : '4px' 
                    }}>
                      {c.benefits.slice(0, c.id === 'germany' ? 4 : 3).map((b, i) => (
                        <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'start' }}>
                          <Check size={10} color={c.themeColor} className="country-theme-stroke" style={{ marginTop: '2.5px', flexShrink: 0, strokeWidth: 3 }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'var(--glass-border)' }} />

                  {/* Elite Package Fee */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block' }}>
                        Elite Service
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Processing fee
                      </span>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      {fee.hasDiscount ? (
                        <>
                          <span style={{ fontSize: '0.65rem', textDecoration: 'line-through', opacity: 0.5, fontWeight: 700, color: 'var(--text-muted)' }}>
                            ₹{fee.baseP.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            ₹{fee.discP.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          ₹{fee.baseP.toLocaleString('en-IN')}
                        </span>
                      )}
                      
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        + 18% GST (₹{(fee.hasDiscount ? fee.discT : fee.baseT).toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={async () => {
                      setSelectedCountry(c.id);
                      setPopupCountryId(c.id);
                      setPopupSelectedLevel(null);
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 2000);
                      try {
                        const res = await fetch(`${API_BASE_URL}/auth/update`, {
                          method: 'PUT',
                          credentials: 'include',
                          headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
                          body: JSON.stringify({ country: c.name })
                        });
                        if (res.ok && refreshProfile) {
                          await refreshProfile();
                        }
                      } catch (err) {
                        console.error("Failed to update profile country", err);
                      }
                    }}
                    className={isSelected ? 'country-btn-active' : ''}
                    style={{
                      width: '100%',
                      background: isSelected ? c.themeColor : 'transparent',
                      color: isSelected ? '#0a0a0a' : 'var(--text-main)',
                      border: isSelected ? 'none' : '1px solid var(--glass-border)',
                      borderRadius: '10px',
                      flexShrink: 0,
                      padding: '9px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxShadow: isSelected ? `0 3px 10px ${c.glowColor}` : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Award size={13} style={{ strokeWidth: 2.5, color: '#0a0a0a' }} />
                        <span style={{ color: '#0a0a0a' }}>Target Active - View Fees</span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: 'var(--text-main)' }}>Choose {c.name} & View Fees</span>
                        <ArrowRight size={10} />
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <style>{`
          [data-theme="light"] .country-theme-text[style*="color: #fbbf24"],
          [data-theme="light"] .country-theme-text[style*="color: #f59e0b"],
          [data-theme="light"] .country-theme-text[style*="color: #d97706"] {
             color: #92400e !important;
          }
          [data-theme="light"] .country-theme-stroke[color="#fbbf24"],
          [data-theme="light"] .country-theme-stroke[color="#f59e0b"],
          [data-theme="light"] .country-theme-stroke[color="#d97706"] {
             color: #92400e !important;
          }
          [data-theme="light"] .country-card-bg {
             background: rgba(0, 0, 0, 0.02) !important;
             border: 1px solid rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>

      {/* Premium Fee Structure Details Popup Modal */}
      <AnimatePresence>
        {popupCountryId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              background: 'rgba(10, 14, 40, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          >
            {/* Modal Backdrop Close Click */}
            <div
              style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
              onClick={() => setPopupCountryId(null)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '1300px',
                height: '88vh',
                maxHeight: '900px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {(() => {
                const selectedCountryData = countriesComparisonData.find(c => c.id === popupCountryId);
                const themeColor = selectedCountryData?.themeColor || '#fbbf24';
                const glowColor = selectedCountryData?.glowColor || 'rgba(251, 191, 36, 0.15)';
                const countryDetails = popupCountryId === 'italy' ? italyData : countryData[popupCountryId?.toLowerCase()];

                return (
                  <>
                    {/* Modal Header */}
                    <div style={{
                      padding: '24px 32px 20px 32px',
                      borderBottom: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      position: 'relative',
                      flexShrink: 0
                    }}>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                        <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                          {selectedCountryData?.flag || '🌐'}
                        </span>
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Elite Services</p>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            Study in {selectedCountryData?.name || popupCountryId}
                            <span style={{ fontSize: '12px', fontWeight: 800, background: themeColor, color: '#fff', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              Elite
                            </span>
                          </h2>
                        </div>
                      </div>

                      {/* Header Controls (Level / UniType) */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', zIndex: 1 }}>
                        {popupCountryId === 'germany' && (
                          <div style={{ display: 'flex', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '6px', gap: '6px' }}>
                            {['Public', 'Private'].map(type => (
                              <button key={type} onClick={() => setPopupUniType(type)} style={{
                                padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800,
                                background: popupUniType === type ? 'var(--accent-primary)' : 'transparent',
                                color: popupUniType === type ? '#fff' : 'var(--text-muted)', transition: 'all 0.18s'
                              }}>{type}</button>
                            ))}
                          </div>
                        )}
                        <div style={{ display: 'flex', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '6px', gap: '6px' }}>
                          {['Bachelors', 'Masters', 'MBBS'].map(level => (
                            <button key={level} onClick={() => setPopupSelectedLevel(level)} style={{
                              padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800,
                              background: popupSelectedLevel === level ? 'var(--accent-primary)' : 'transparent',
                              color: popupSelectedLevel === level ? '#fff' : 'var(--text-muted)', transition: 'all 0.18s'
                            }}>{level}</button>
                          ))}
                        </div>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => setPopupCountryId(null)}
                        style={{
                          background: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          borderRadius: '50%', width: '42px', height: '42px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.2s', outline: 'none', flexShrink: 0
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--input-bg)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Modal Body — no scroll, content must fit */}
                    <div style={{
                      flex: 1,
                      minHeight: 0,
                      padding: '12px 32px 24px 32px',
                      background: 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}>
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        filter: !popupSelectedLevel ? 'blur(4px)' : 'none',
                        pointerEvents: !popupSelectedLevel ? 'none' : 'auto',
                        transition: 'filter 0.3s ease, opacity 0.3s ease',
                        opacity: !popupSelectedLevel ? 0.35 : 1
                      }}>
                        <FeesTable
                          countryId={popupCountryId}
                          showUniversityFees={false}
                          isDark={popupIsDark}
                          hideControls={true}
                          externalLevel={popupSelectedLevel || 'Bachelors'}
                          onExternalLevelChange={setPopupSelectedLevel}
                          externalUniType={popupUniType}
                          onExternalUniTypeChange={setPopupUniType}
                          userEmail={profile?.email}
                        />
                      </div>

                      {!popupSelectedLevel && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '12px',
                          zIndex: 10,
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            minWidth: selectedCountryData?.id === 'germany' ? '360px' : '320px',
                            background: 'var(--card-bg)',
                            border: `1px solid ${selectedCountry === selectedCountryData?.id ? themeColor : 'var(--glass-border)'}`,
                            padding: '20px 36px',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            color: 'var(--text-main)',
                            fontSize: '17px',
                            fontWeight: 800,
                            textAlign: 'center',
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '1.4rem' }}>👆 Select a program to get started</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Choose Bachelors, Masters, or MBBS in the top right to view fees</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Subscriptions;
