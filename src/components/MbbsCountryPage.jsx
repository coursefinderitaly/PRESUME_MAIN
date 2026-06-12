import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import { GraduationCap, Stethoscope, Award, CheckCircle, MoveRight, Clock, MapPin, ShieldCheck, BookOpen, Building } from 'lucide-react';
import { createPortal } from 'react-dom';
import AuthModal from './AuthModal';
import FeesTable from './FeesTable';

const mbbsData = {
  italy: {
    country: "Italy",
    flag: "🇮🇹",
    title: "MBBS in Italy",
    tagline: "Study Medicine in Europe",
    heroImage: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1920&q=80",
    overview: "Italy offers one of the most prestigious medical degrees in the world. With centuries-old universities and a highly developed healthcare system, an MBBS in Italy is globally recognized. Best of all, international students can benefit from DSU scholarships which cover tuition fees and provide living allowances.",
    fees: "€1,000 - €3,000 / Year (Often Funded via DSU)",
    duration: "6 Years",
    exam: "IMAT Required",
    medium: "English",
    benefits: [
      "DSU scholarships covering tuition & living",
      "World-class European standard medical education",
      "Degree valid across the EU, UK, and India (NMC recognized)",
      "Highly advanced clinical practice and research facilities",
      "Rich cultural heritage and high standard of living in Europe"
    ],
    features: [
      { icon: <Award size={24} />, title: "Global Recognition", desc: "Degrees are recognized by WHO, NMC, and FAIMER." },
      { icon: <ShieldCheck size={24} />, title: "DSU Scholarship", desc: "Eligible for up to €8,000/year living stipend + zero tuition." },
      { icon: <BookOpen size={24} />, title: "IMAT Exam", desc: "Admission is based on the International Medical Admissions Test." },
      { icon: <Building size={24} />, title: "Top Universities", desc: "Home to the world's oldest and most renowned medical schools." }
    ],
    feeStructureTable: [
      { item: "Tuition Fees", cost: "€1,000 - €3,000 / Year" },
      { item: "Living Expenses", cost: "€4,000 - €6,000 / Year" },
      { item: "DSU Scholarship", cost: "Up to €8,000 (Covers Tuition + Living)" },
      { item: "Medical Insurance", cost: "€150 / Year" }
    ],
    universityFees: [
      {
        university: "Sapienza University of Rome",
        description: "Founded in 1303, one of the oldest and largest universities in Europe offering top-tier medical training.",
        rows: [
          { year: "1st Year", tuition: "€ 3,000", admin: "€ 2,500", app: "€ 30", total: "€ 5,530" },
          { year: "2nd - 6th Year", tuition: "€ 3,000", admin: "-", app: "-", total: "€ 3,000 / yr" }
        ]
      },
      {
        university: "University of Padua",
        description: "Established in 1222, internationally recognized for its high academic standards and clinical experience.",
        rows: [
          { year: "1st Year", tuition: "€ 2,800", admin: "€ 2,500", app: "€ 30", total: "€ 5,330" },
          { year: "2nd - 6th Year", tuition: "€ 2,800", admin: "-", app: "-", total: "€ 2,800 / yr" }
        ]
      }
    ],
    color: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    accent: "#60a5fa",
    bgClass: "bg-blue-600/10"
  },
  georgia: {
    country: "Georgia",
    flag: "🇬🇪",
    title: "MBBS in Georgia",
    tagline: "Highly Affordable & 100% English Medium",
    heroImage: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1920&q=80",
    overview: "Georgia has rapidly become one of the most popular destinations for Indian medical students. It offers 100% English-medium instruction, high-quality European standard education, and extremely affordable living costs, all within a safe and welcoming environment.",
    fees: "$4,000 - $8,000 / Year",
    duration: "6 Years",
    exam: "NEET Qualified",
    medium: "English",
    benefits: [
      "100% English medium instruction throughout the 6 years",
      "WHO & NMC (MCI) recognized universities",
      "Highly affordable tuition & very low cost of living",
      "Extremely safe environment for international students",
      "No IELTS or TOEFL required for admissions"
    ],
    features: [
      { icon: <Award size={24} />, title: "NMC Approved", desc: "Degrees fully align with NMC guidelines for Indian students." },
      { icon: <ShieldCheck size={24} />, title: "Extremely Safe", desc: "Georgia ranks among the safest countries in the world." },
      { icon: <BookOpen size={24} />, title: "No IELTS Required", desc: "Direct admission possible without IELTS/TOEFL." },
      { icon: <Building size={24} />, title: "Modern Labs", desc: "Universities feature state-of-the-art simulation centers." }
    ],
    georgiaTableData: [
      {
        university: "Grigol Robakidze University, Tbilisi",
        requirements: "Academic Marks = Minimum 50% aggregate in (PCB)\nNEET Qualification = Mandatory.",
        yearlyFee: "Rs 5,25,000",
        totalFees: "Rs 31,50,000",
        otherCosting: "Administrative Fees = $1,000\nTemporary Residence Card = $300\nDocumentation = $250",
        hostel: "Hostel/Accommodation = Rs 3,45,000",
        totalCosting: "Rs 52,20,000"
      },
      {
        university: "Avicenna Batumi Medical University",
        requirements: "Academic Marks = Minimum 50% aggregate in (PCB)\nNEET Qualification = Mandatory.",
        yearlyFee: "Rs 4,66,000",
        totalFees: "Rs 27,96,000",
        otherCosting: "Administrative Fees = 2200 US$\nTemporary Residence Card = 250 US$\nDocumentation = 200 US$",
        hostel: "Hostel + Indian Canteen Accommodation\n= Rs 2,86,000",
        totalCosting: "Rs 45,12,000"
      }
    ],
    color: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/30",
    accent: "#fb7185",
    bgClass: "bg-rose-600/10"
  },
  russia: {
    country: "Russia",
    flag: "🇷🇺",
    title: "MBBS in Russia",
    tagline: "Government Subsidized World-Class Education",
    heroImage: "https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1920&q=80",
    overview: "Russia boasts some of the oldest and most highly ranked medical universities globally. Due to heavy government subsidies, studying MBBS in Russia is incredibly cost-effective while still providing access to massive multi-specialty hospitals for excellent clinical exposure.",
    fees: "$3,000 - $7,000 / Year",
    duration: "6 Years",
    exam: "NEET Qualified",
    medium: "English",
    benefits: [
      "Government subsidized, making it highly affordable",
      "Globally recognized degree (WHO, NMC, FAIMER)",
      "World-class infrastructure and massive advanced hospitals",
      "Huge international student community",
      "Direct admissions with simple eligibility criteria"
    ],
    features: [
      { icon: <Award size={24} />, title: "Global Standards", desc: "Consistently ranked among top medical schools worldwide." },
      { icon: <ShieldCheck size={24} />, title: "Subsidized Fees", desc: "Government support keeps tuition remarkably low." },
      { icon: <BookOpen size={24} />, title: "Clinical Exposure", desc: "Unmatched hands-on practice in giant state hospitals." },
      { icon: <Building size={24} />, title: "Large Community", desc: "Thousands of Indian students currently study in Russia." }
    ],
    feeStructureTable: [
      { item: "Tuition Fees", cost: "$3,000 - $7,000 / Year" },
      { item: "Living Expenses", cost: "$2,000 - $3,000 / Year" },
      { item: "Medical Insurance", cost: "$100 - $150 / Year" },
      { item: "Visa Extension", cost: "$50 / Year" }
    ],
    russiaTableData: [
      {
        university: "Voronezh State Medical University",
        yearlyFee: "Rs 5,72,000",
        totalFees: "Rs 34,32,000",
        hostel: "Rs 70,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 46,32,000"
      },
      {
        university: "North Western State Medical University",
        yearlyFee: "Rs 7,21,000",
        totalFees: "Rs 43,26,000",
        hostel: "Rs 56,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 54,54,000"
      },
      {
        university: "Kazan Federal University",
        yearlyFee: "Rs 8,75,000",
        totalFees: "Rs 52,50,000",
        hostel: "Rs 30,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "30 Aug 2026",
        totalCosting: "Rs 62,10,000"
      },
      {
        university: "Kazan State Medical University",
        yearlyFee: "Rs 8,62,000",
        totalFees: "Rs 51,72,000",
        hostel: "Rs 1,05,702 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "30 Aug 2026",
        totalCosting: "Rs 65,86,212"
      },
      {
        university: "Yaroslavl State Medical University",
        yearlyFee: "Rs 5,25,000",
        totalFees: "Rs 31,50,000",
        hostel: "Rs 1,35,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 47,40,000"
      },
      {
        university: "Bashkir State Medical University",
        yearlyFee: "Rs 5,40,000",
        totalFees: "Rs 32,40,000",
        hostel: "Rs 60,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 43,80,000"
      },
      {
        university: "Kuban State Medical University",
        yearlyFee: "Rs 6,65,000",
        totalFees: "Rs 39,90,000",
        hostel: "Rs 25,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "N/A",
        totalCosting: "Rs 49,20,000"
      },
      {
        university: "Volgograd State Medical University",
        yearlyFee: "Rs 6,45,000",
        totalFees: "Rs 38,70,000",
        hostel: "Rs 1,40,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 54,90,000"
      },
      {
        university: "Far Eastern Federal University",
        yearlyFee: "Rs 6,65,000",
        totalFees: "Rs 39,90,000",
        hostel: "Rs 1,30,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 55,50,000"
      },
      {
        university: "Tver State Medical University",
        yearlyFee: "Rs 5,70,000",
        totalFees: "Rs 34,20,000",
        hostel: "Rs 1,35,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 50,10,000"
      },
      {
        university: "Kirov State Medical University",
        yearlyFee: "Rs 4,80,000",
        totalFees: "Rs 28,80,000",
        hostel: "Rs 1,10,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "N/A",
        totalCosting: "Rs 43,20,000"
      },
      {
        university: "Ulyanovsk State University",
        yearlyFee: "Rs 4,68,000",
        totalFees: "Rs 28,08,000",
        hostel: "Rs 1,10,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 42,48,000"
      },
      {
        university: "Northern State Medical University",
        yearlyFee: "Rs 4,65,000",
        totalFees: "Rs 27,90,000",
        hostel: "Rs 37,500 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 37,95,000"
      },
      {
        university: "Omsk State Medical University",
        yearlyFee: "Rs 4,92,000",
        totalFees: "Rs 29,52,000",
        hostel: "Rs 30,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 37,50,000"
      },
      {
        university: "Saint Petersburg State Pediatric Medical University",
        yearlyFee: "Rs 7,90,000",
        totalFees: "Rs 47,40,000",
        hostel: "Rs 2,70,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "31 Aug 2026",
        totalCosting: "Rs 63,60,000"
      },
      {
        university: "Kemerovo State Medical University",
        yearlyFee: "Rs 4,45,000",
        totalFees: "Rs 26,70,000",
        hostel: "Rs 1,60,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 44,10,000"
      },
      {
        university: "Altai State Medical University",
        yearlyFee: "Rs 5,05,000",
        totalFees: "Rs 30,30,000",
        hostel: "Rs 1,20,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "15 Sep 2026",
        totalCosting: "Rs 45,30,000"
      },
      {
        university: "Chita State Medical University",
        yearlyFee: "Rs 4,25,000",
        totalFees: "Rs 25,50,000",
        hostel: "Rs 1,60,000 / Year",
        food: "1,30,000 / Year Approx",
        deadline: "N/A",
        totalCosting: "Rs 42,90,000"
      }
    ],
    color: "from-sky-500/20 to-cyan-500/10",
    border: "border-sky-500/30",
    accent: "#38bdf8",
    bgClass: "bg-cyan-600/10"
  }
};

const universityImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?auto=format&fit=crop&w=800&q=80"
];

const MbbsCountryPage = ({ countryId: propCountryId }) => {
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(null);

  // Use prop if provided, else use URL param
  const countryKey = propCountryId || params.countryId;
  const data = mbbsData[countryKey];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <h1 className="text-3xl font-black">Country Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden">

      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full ${data.bgClass} blur-[180px]`} />
        <div className={`absolute bottom-[-10%] right-[-15%] w-[800px] h-[800px] rounded-full ${data.bgClass} blur-[180px]`} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#030712_100%)]" />
      </div>

      <Header compact={false} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${data.border} bg-white/5 backdrop-blur-md text-xs font-black uppercase tracking-[0.2em] mb-6`} style={{ color: data.accent }}>
              <span className="text-xl">{data.flag}</span>
              {data.country} Admissions Open
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              {data.title}
            </h1>

            <p className="text-lg text-white/60 font-medium leading-relaxed mb-8 max-w-xl">
              {data.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setModalOpen({ type: 'signup', role: 'student' })}
                className="px-8 py-4 rounded-full bg-white text-black font-black tracking-wider text-sm flex items-center gap-3 group shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-all"
              >
                Apply Now
                <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black tracking-wider text-sm hover:bg-white/10 transition-all"
              >
                View Details
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-tr ${data.color} rounded-3xl blur-2xl transform rotate-3`} />
            <img
              src={data.heroImage}
              alt={data.title}
              className="relative z-10 w-full h-[500px] object-cover rounded-3xl border border-white/10 shadow-2xl"
            />

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-[#0a0d18] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center" style={{ color: data.accent }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Program Info</p>
                <p className="text-lg font-black text-white">{data.duration} • {data.medium} Medium</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full pb-32" id="details">

        {/* ─── QUICK FACTS ─── */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
              <Clock size={24} style={{ color: data.accent }} className="mb-4" />
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Duration</p>
              <p className="text-xl font-black text-white">{data.duration}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
              <Award size={24} style={{ color: data.accent }} className="mb-4" />
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Eligibility</p>
              <p className="text-xl font-black text-white">{data.exam}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
              <BookOpen size={24} style={{ color: data.accent }} className="mb-4" />
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Medium</p>
              <p className="text-xl font-black text-white">{data.medium}</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl">
              <MapPin size={24} style={{ color: data.accent }} className="mb-4" />
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Tuition Fees</p>
              <p className="text-xl font-black text-white">{data.fees}</p>
            </div>
          </div>
        </section>

        {/* ─── FEE STRUCTURE TABLE ─── */}
        {countryKey !== 'italy' && (
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Fee Structure Overview</h2>
              <p className="text-white/50 mt-4 text-lg">Estimated annual costs for studying in {data.country}</p>
            </div>


            {data.russiaTableData ? (
              <div className="w-full max-w-6xl mx-auto space-y-8 pb-8 px-4 md:px-8 xl:px-0">
                {data.russiaTableData.map((row, idx) => (
                  <div key={idx} className="flex flex-col xl:flex-row bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl group hover:border-white/20 transition-all duration-300">

                    {/* Image Section */}
                    <div className="xl:w-[320px] shrink-0 relative overflow-hidden h-[250px] xl:h-auto">
                      <img src={universityImages[idx % universityImages.length]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={row.university} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center font-black text-white shadow-lg z-20">
                        {idx + 1}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">{row.university}</h4>
                      </div>
                    </div>

                    {/* Fees Section */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch relative">

                      {/* Yearly & Total */}
                      <div className="w-full lg:w-[180px] shrink-0 space-y-6 flex flex-col justify-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">1-6 Year (Approx)</span>
                          <span className="text-xl md:text-2xl font-black text-white whitespace-nowrap">{row.yearlyFee}</span>
                          <span className="text-[10px] text-white/40 block uppercase tracking-widest mt-0.5">Per Year</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Total Fees <span className="opacity-70">(For 6 Years)</span></span>
                          <span className="text-xl md:text-2xl font-black text-white whitespace-nowrap">{row.totalFees}</span>
                        </div>
                      </div>

                      {/* Requirements / Other info */}
                      <div className="flex-1 space-y-4 flex flex-col justify-center min-w-0">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Requirements</span>
                          <span className="text-sm font-medium text-white/80 block">Req: Min 50% PCB & NEET</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Hostel</span>
                            <span className="text-sm font-medium text-white/80 whitespace-pre-line block">{row.hostel}</span>
                          </div>
                          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Food</span>
                            <span className="text-sm font-medium text-white/80 whitespace-pre-line block">{row.food}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deadline & Total */}
                      <div className="w-full lg:w-[250px] xl:w-[280px] shrink-0 flex flex-col gap-4 h-full">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex-1">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Deadline</span>
                          <span className="text-sm font-medium text-white/80 block">{row.deadline}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 md:p-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] pointer-events-none rounded-full" />
                          <span className="text-[11px] uppercase tracking-widest text-emerald-400/80 block mb-2 font-black relative z-10">Total Costing <span className="opacity-70 normal-case tracking-normal">(6 Years)</span></span>
                          <span className="text-xl md:text-2xl font-black text-emerald-400 relative z-10 whitespace-nowrap">{row.totalCosting}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : data.georgiaTableData ? (
              <div className="w-full max-w-6xl mx-auto space-y-8 pb-8 px-4 md:px-8 xl:px-0">
                {data.georgiaTableData.map((row, idx) => (
                  <div key={idx} className="flex flex-col xl:flex-row bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl group hover:border-white/20 transition-all duration-300">

                    {/* Image Section */}
                    <div className="xl:w-[320px] shrink-0 relative overflow-hidden h-[250px] xl:h-auto">
                      <img src={universityImages[(idx + 2) % universityImages.length]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={row.university} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center font-black text-white shadow-lg z-20">
                        {idx + 1}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">{row.university}</h4>
                      </div>
                    </div>

                    {/* Fees Section */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch relative">

                      {/* Yearly & Total */}
                      <div className="w-full lg:w-[180px] shrink-0 space-y-6 flex flex-col justify-center">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">1-6 Year (Approx)</span>
                          <span className="text-xl md:text-2xl font-black text-white whitespace-nowrap">{row.yearlyFee}</span>
                          <span className="text-[10px] text-white/40 block uppercase tracking-widest mt-0.5">Per Year</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Total Fees <span className="opacity-70">(For 6 Years)</span></span>
                          <span className="text-xl md:text-2xl font-black text-white whitespace-nowrap">{row.totalFees}</span>
                        </div>
                      </div>

                      {/* Requirements / Other info */}
                      <div className="flex-1 space-y-4 flex flex-col justify-center min-w-0">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Requirements</span>
                          <span className="text-sm font-medium text-white/80 whitespace-pre-line block">{row.requirements}</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Hostel Availability</span>
                          <span className="text-sm font-medium text-white/80 whitespace-pre-line block">{row.hostel}</span>
                        </div>
                      </div>

                      {/* Deadline & Total */}
                      <div className="w-full lg:w-[250px] xl:w-[280px] shrink-0 flex flex-col gap-4 h-full">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex-1">
                          <span className="text-[10px] uppercase tracking-widest text-white/50 block mb-1 font-bold">Other Costing</span>
                          <span className="text-sm font-medium text-white/80 whitespace-pre-line block">{row.otherCosting}</span>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 md:p-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] flex flex-col justify-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] pointer-events-none rounded-full" />
                          <span className="text-[11px] uppercase tracking-widest text-emerald-400/80 block mb-2 font-black relative z-10">Total Costing <span className="opacity-70 normal-case tracking-normal">(6 Years)</span></span>
                          <span className="text-xl md:text-2xl font-black text-emerald-400 relative z-10 whitespace-nowrap">{row.totalCosting}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : data.universityFees ? (
              <div className="max-w-5xl mx-auto space-y-8">
                {data.universityFees.map((uni, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="p-6 md:p-8 border-b border-white/10 bg-white/5 relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-64 h-64 ${data.bgClass} blur-[100px] pointer-events-none`} />
                      <h3 className="text-2xl font-black text-white relative z-10">{uni.university}</h3>
                      <p className="text-sm text-white/70 mt-2 relative z-10">{uni.description}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-[#030712]/50 border-b border-white/10">
                            <th className="p-5 text-sm font-black uppercase tracking-widest text-white/60">Year</th>
                            <th className="p-5 text-sm font-black uppercase tracking-widest text-white/60">Tuition Fee</th>
                            <th className="p-5 text-sm font-black uppercase tracking-widest text-white/60">Admin Fee</th>
                            <th className="p-5 text-sm font-black uppercase tracking-widest text-white/60">App. Fee</th>
                            <th className="p-5 text-sm font-black uppercase tracking-widest text-white/60">Total Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {uni.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                              <td className="p-5 text-base font-bold text-white">{row.year}</td>
                              <td className="p-5 text-base font-medium text-white/80">{row.tuition}</td>
                              <td className="p-5 text-base font-medium text-white/80">{row.admin}</td>
                              <td className="p-5 text-base font-medium text-white/80">{row.app}</td>
                              <td className="p-5 text-lg font-black" style={{ color: data.accent }}>{row.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-6 md:p-8 text-sm md:text-base font-black uppercase tracking-widest text-white/60">Expense Type</th>
                      <th className="p-6 md:p-8 text-sm md:text-base font-black uppercase tracking-widest text-white/60">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.feeStructureTable.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 md:p-8 text-base md:text-xl font-bold text-white">{fee.item}</td>
                        <td className="p-6 md:p-8 text-base md:text-xl font-black" style={{ color: data.accent }}>{fee.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </section>
        )}

        {/* ─── PRESUME CONSULTING FEES ─── */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Our Consulting Charges</h2>
            <p className="text-white/50 mt-4 text-lg">Transparent processing fees for {data.country}</p>
          </div>

          <FeesTable countryId={countryKey} externalLevel="MBBS" hideLevelSwitcher={true} />
        </section>

        {/* ─── WHY CHOOSE SECTION ─── */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Why Choose {data.country}?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl hover:border-white/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform" style={{ color: data.accent }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── DETAILED BENEFITS ─── */}
        <section className="mb-24 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${data.bgClass} blur-[120px] pointer-events-none`} />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-8">Key Benefits of {data.title}</h3>
              <ul className="space-y-4">
                {data.benefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle size={20} className="shrink-0 mt-0.5" style={{ color: data.accent }} />
                    <span className="text-white/80 text-lg font-medium">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-square rounded-full border border-white/10 bg-white/5 relative flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)]">
                <GraduationCap size={120} className="text-white/10" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <MinimalFooter />

      {/* Auth Modal via Portal */}
      {modalOpen && createPortal(
        <AnimatePresence>
          <AuthModal type={modalOpen.type} onClose={() => setModalOpen(null)} />
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default MbbsCountryPage;
