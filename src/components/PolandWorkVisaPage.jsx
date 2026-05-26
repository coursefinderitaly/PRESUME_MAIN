import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, FileText, ClipboardList, Package, HardHat, Sprout } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import InteractiveBackground from './InteractiveBackground';

const requirements = [
  "Citizens of all countries",
  "Male, Female",
  "Age: up to 50 years old",
  "Communicative English is required"
];

const vacancies = [
  {
    title: "Warehouses",
    for: "",
    tasks: [
      "Product, packaging and using an electric trolley with a scanner"
    ],
    hours: "8 - 10 hours a day, 5 - 6 days a week",
    salary: "€1,100 - €1,500 / month",
    accommodation: "Provided (payment for utilities)",
    icon: Package
  },
  {
    title: "Field Work",
    for: "",
    tasks: [
      "Workers for gardens and field work (seasonal work)"
    ],
    hours: "8 - 10 hours a day, 5 - 6 days a week",
    salary: "€1,100 - €1,500 / month",
    accommodation: "Provided (payment for utilities)",
    icon: Sprout
  },
  {
    title: "Metal Production",
    for: "",
    tasks: [
      "Metalworker, Metal grinder in Metal Products Manufacturing"
    ],
    hours: "8 - 10 hours a day, 5 - 6 days a week",
    salary: "€1,100 - €1,500 / month",
    accommodation: "Provided (payment for utilities)",
    icon: HardHat
  }
];

const requestedDocuments = [
  "Scanned copy of the passport (all pages in full size)"
];

const questionnaire = [
  "Last Name",
  "First Name",
  "Candidate's phone number (with Country Code) (to check English language skills)",
  "Candidate's email",
  "Citizen of",
  "Country and city where they will register for the visa",
  "Embassy email",
  "Start date of the documents"
];

const processSteps = [
  "Send us a scan of your passport, a questionnaire and an advance payment.",
  "We prepare a complete package of documents for you.",
  "After the documents are ready, you pay the second part of the amount.",
  "We send you the documents via DHL or electronically to your email or WhatsApp.",
  "Register at the embassy, and after receiving a visa, contact us. Our employee will explain in detail all the next steps."
];

const listDocumentsProvided = [
  "Invitation",
  "Agreement",
  "Accommodation"
];

const pricingOptions = [
  { service: 'Voivodeship documents for 12 months with employment', prep: '2 - 6 months', advance: '₹40,000', post: '₹50,000', total: '₹90,000' },
  { service: 'Seasonal work permit for 9 months', prep: '1.5 month', advance: '₹85,000', post: '₹95,000', total: '₹180,000' }
];

export default function PolandWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Interactive Animated Background */}
      <InteractiveBackground 
        color1="bg-red-600/20" 
        color2="bg-rose-600/20" 
        color3="bg-red-500/20" 
      />

      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden z-10">

        <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 bg-white/[0.03] backdrop-blur-md px-6 py-2 rounded-full border border-white/10 w-fit">
              <Link to="/services/work-visa" className="text-gray-400 text-xs font-medium hover:text-red-400 transition-colors uppercase tracking-wider">Work Visa</Link>
              <span className="text-gray-600">•</span>
              <span className="text-red-400 text-xs font-black tracking-widest uppercase">Poland</span>
            </div>

            <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-4">
              <span className="text-6xl md:text-7xl lg:text-8xl drop-shadow-2xl">🇵🇱</span>
            </div>

            <p className="text-red-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-3">Gateway to Central Europe</p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tighter">
              Work in <br className="hidden md:block" /><span className="bg-gradient-to-r from-red-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">Poland</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
              Access excellent opportunities in one of Europe's fastest-growing economies. High demand for logistics, manufacturing, and agricultural workers.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/book-appointment" className="group relative inline-flex items-center justify-center gap-3 bg-red-600 text-white font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-red-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(220,38,38,0.6)]">
                Start Your Journey
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto flex-1 max-w-2xl">
            {[
              { label: 'Salary', value: '€1,100–€1,500', color: 'text-red-400' },
              { label: 'Processing', value: '1.5–6 Months', color: 'text-rose-400' },
              { label: 'Visa Type', value: 'Voivodeship / Seasonal', color: 'text-pink-400' },
              { label: 'Language', value: 'English accepted', color: 'text-orange-400' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-red-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xl shadow-2xl flex flex-col justify-center ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}>
                <p className={`font-black text-2xl lg:text-3xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements & Info */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-24 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-20">
          {/* Requirements */}
          <div className="flex justify-center w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full max-w-4xl text-center">
              <p className="text-red-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Eligibility</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Requirements</h2>
              <div className="grid sm:grid-cols-2 gap-5 text-left">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-lg hover:bg-white/[0.05] transition-colors">
                    <CheckCircle size={28} className="text-red-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <span className="text-gray-100 font-bold text-base md:text-lg">{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Vacancies */}
          <div className="w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-12">
              <p className="text-red-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Opportunities</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Work Conditions</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {vacancies.map((vac, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-100px" }} 
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-xl hover:border-red-500/40 hover:shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)] transition-[border-color,box-shadow,transform] hover:-translate-y-1 duration-300 group flex flex-col"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/30 w-fit group-hover:scale-110 transition-transform duration-300">
                      <vac.icon size={32} className="text-red-400 drop-shadow-md" />
                    </div>
                    <h3 className="text-white font-black text-2xl md:text-3xl leading-tight">{vac.title}</h3>
                  </div>
                  {vac.for && (
                    <div className="mb-6">
                      <p className="text-red-400 text-xs md:text-sm font-black uppercase tracking-widest mb-1">For Candidates From:</p>
                      <p className="text-gray-200 font-bold text-base md:text-lg">{vac.for}</p>
                    </div>
                  )}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {vac.tasks.map((t, idx) => (
                      <li key={idx} className="text-gray-200 text-base md:text-lg font-medium flex items-start gap-3">
                        <span className="text-red-400 font-black mt-0.5 text-xl">•</span> {t}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase font-black tracking-widest mb-2">Hours</p>
                      <p className="text-white text-base md:text-lg font-bold">{vac.hours}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm uppercase font-black tracking-widest mb-2">Salary</p>
                      <p className="text-red-300 text-base md:text-lg font-black">{vac.salary}</p>
                    </div>
                    <div className="col-span-2 mt-2">
                      <p className="text-gray-400 text-xs md:text-sm uppercase font-black tracking-widest mb-2">Housing</p>
                      <p className="text-white text-base md:text-lg font-bold">{vac.accommodation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <p className="text-red-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Transparent Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Services & Costs</h2>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Service</th>
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Preparation Time</th>
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Advance (INR)</th>
                <th className="p-6 text-gray-200 font-black text-base md:text-lg uppercase tracking-wider">Postpaid (INR)</th>
                <th className="p-6 text-red-400 font-black text-lg md:text-xl uppercase tracking-wider">Total Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                  <td className="p-6 text-base md:text-lg font-bold text-white leading-snug">{opt.service}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300">{opt.advance}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300">{opt.post}</td>
                  <td className="p-6 text-xl md:text-2xl font-black text-red-400 drop-shadow-sm">{opt.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Process & Documents */}
      <section className="relative z-10 bg-white/[0.01] border-t border-white/5 py-24 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          {/* Documents */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 h-full shadow-xl flex flex-col gap-8">
              <div>
                <FileText size={40} className="text-red-400 mb-6 drop-shadow-md" />
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Electronic Documents Provided</h3>
                <ul className="space-y-5">
                  {listDocumentsProvided.map((doc, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                      <span className="text-red-400 mt-1 font-black">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Requested Documents</h3>
                <ul className="space-y-5">
                  {requestedDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                      <span className="text-red-400 mt-1 font-black">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Questionnaire */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 h-full shadow-xl flex flex-col">
              <ClipboardList size={40} className="text-red-400 mb-8 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">Questionnaire Info</h3>
              <ul className="space-y-5 flex-grow">
                {questionnaire.map((q, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                    <span className="text-red-400 mt-1 font-black">•</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden flex flex-col shadow-[0_0_30px_-10px_rgba(239,68,68,0.2)]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              <MapPin size={40} className="text-red-400 mb-8 relative z-10 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 relative z-10 tracking-tight">Application Process</h3>
              <div className="space-y-6 relative z-10 flex-grow">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-xs md:text-sm font-black text-red-300 shadow-lg">{i + 1}</div>
                      {i < processSteps.length - 1 && <div className="w-0.5 h-full bg-red-500/30 my-2" />}
                    </div>
                    <p className="text-gray-100 font-bold text-base md:text-lg pb-4 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl relative z-10 shadow-lg">
                <p className="text-red-300 text-sm md:text-base font-black uppercase text-center leading-relaxed tracking-wide">
                  PROCESS FOR DOCUMENTS PREPARATION IS UP TO 2 - 6 MONTHS
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
