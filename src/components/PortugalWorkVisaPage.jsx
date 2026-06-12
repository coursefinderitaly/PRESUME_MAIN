import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, FileText, ClipboardList, Info, Sprout, Building } from 'lucide-react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import InteractiveBackground from './InteractiveBackground';

const requirements = [
  "Citizens of India, Bangladesh, Egypt, Tunisia, Algeria, Nigeria, Ghana, Cameroon, and Turkey.",
  "Male, Female",
  "Age: up to 45 years old",
  "Communicative English is required"
];

const vacancies = [
  {
    title: "Worker at a Fruit/Vegetable Farm",
    for: "",
    tasks: [
      "Harvesting, sorting, and packaging fruits and vegetables",
      "General agricultural field work"
    ],
    hours: "Approx. 40–45 hours per week",
    salary: "€800–€1,100",
    accommodation: "Provided by the employer",
    icon: Sprout
  }
];

const requestedDocuments = [
  "Passport (all pages in full size)",
  "CV with mentioned experience"
];

const embassyDocuments = [
  "Certificate from a college or higher education institution with an apostille (mandatory). The list of subjects must include English.",
  "An employment certificate (if officially employed).",
  "A police clearance certificate with an apostille.",
  "Proof of work experience confirming at least 6 months of experience in agriculture."
];

const questionnaire = [
  "Last name & First name",
  "Surname at birth & First name at birth",
  "Country and City of residence",
  "Residential address (street, house no.) & Postal code",
  "Candidate's Email & Phone number (with Country Code)",
  "Maiden surname of mother & First name of mother",
  "Surname of father & First name of father",
  "Marital status, Education & Profession",
  "Country and city of visa application",
  "VFS Global Visa Center details (Name, phone, email, address)"
];

const processSteps = [
  "Ensure you have all required documents for embassy submission before ordering.",
  "Pay the deposit. We submit the case to the employer.",
  "Once documents are ready, we send scanned copies for detail verification.",
  "After the second payment, original documents are sent via DHL.",
  "Register for an appointment on the VFS website and send us the date and time.",
  "After arrival in Portugal, the stay can be extended for 1 year (TRC)."
];

const pricingOptions = [
  { service: 'Documents for a 4-month Type D visa', prep: '2 - 5 months', advance: '₹110,000', post: '₹140,000', total: '₹250,000' }
];

export default function PortugalWorkVisaPage() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">
      <Header />

      {/* Interactive Animated Background */}
      <InteractiveBackground 
        color1="bg-emerald-600/20" 
        color2="bg-teal-600/20" 
        color3="bg-green-500/20" 
      />

      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 pb-10 px-4 overflow-hidden z-10">
        <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 lg:pl-12 xl:pl-24">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 bg-white/[0.03] backdrop-blur-md px-6 py-2 rounded-full border border-white/10 w-fit">
              <Link to="/services/work-visa" className="text-gray-400 text-xs font-medium hover:text-emerald-400 transition-colors uppercase tracking-wider">Work Visa</Link>
              <span className="text-gray-600">•</span>
              <span className="text-emerald-400 text-xs font-black tracking-widest uppercase">Portugal</span>
            </div>

            <p className="text-emerald-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-3">Western European Opportunities</p>

            <h1 className="flex items-center justify-center lg:justify-start gap-4 flex-wrap text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 tracking-tighter">
              <span>Work in</span> <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent">Portugal</span> <span className="drop-shadow-2xl">🇵🇹</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
              Access excellent opportunities in Portugal. High demand for agricultural workers with straightforward routes to temporary residency and long-term settlement.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link to="/book-appointment" className="group relative inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-black text-sm tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-emerald-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)]">
                Start Your Journey
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto flex-1 max-w-2xl">
            {[
              { label: 'Salary', value: '€800–€1,100', color: 'text-emerald-400' },
              { label: 'Processing', value: '2–5 Months', color: 'text-teal-400' },
              { label: 'Visa Type', value: 'Type D (4 Mo)', color: 'text-green-400' },
              { label: 'Language', value: 'English accepted', color: 'text-emerald-300' },
            ].map((s, i) => (
              <div key={i} className={`bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xl shadow-2xl flex flex-col justify-center ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}>
                <p className={`font-black text-2xl lg:text-3xl mb-2 ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements & Info */}
      <section className="relative z-10 bg-white/[0.01] border-y border-white/5 py-24 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Requirements */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-emerald-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Eligibility</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Requirements</h2>
            <div className="space-y-5 mb-10">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-lg hover:bg-white/[0.05] transition-colors">
                  <CheckCircle size={28} className="text-emerald-400 flex-shrink-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-gray-100 font-bold text-base md:text-lg">{req}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/40 rounded-2xl p-8 flex items-start gap-5 shadow-[0_0_30px_-10px_rgba(239,68,68,0.4)]">
              <Info size={32} className="text-red-400 flex-shrink-0 mt-1 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <div>
                <h4 className="text-white font-black text-2xl mb-2 tracking-tight"> Important Note</h4>
                <p className="text-gray-200 text-base md:text-lg font-medium leading-relaxed">
                  The number of available positions is <strong className="text-white bg-red-500/20 px-2 py-0.5 rounded ml-1">strictly limited</strong>. Ensure your clients possess all required documents for embassy submission before ordering.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vacancies */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-emerald-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Opportunities</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Work Conditions</h2>
            <div className="space-y-8">
              {vacancies.map((vac, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-xl hover:border-emerald-500/40 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] transition-all">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30">
                      <vac.icon size={32} className="text-emerald-400 drop-shadow-md" />
                    </div>
                    <h3 className="text-white font-black text-2xl md:text-3xl leading-tight">{vac.title}</h3>
                  </div>
                  {vac.for && (
                    <div className="mb-6">
                      <p className="text-emerald-400 text-xs md:text-sm font-black uppercase tracking-widest mb-1">For Candidates From:</p>
                      <p className="text-gray-200 font-bold text-base md:text-lg">{vac.for}</p>
                    </div>
                  )}
                  <ul className="space-y-3 mb-8">
                    {vac.tasks.map((t, idx) => (
                      <li key={idx} className="text-gray-200 text-base md:text-lg font-medium flex items-start gap-3">
                        <span className="text-emerald-400 font-black mt-0.5 text-xl">•</span> {t}
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
                      <p className="text-emerald-300 text-base md:text-lg font-black">{vac.salary}</p>
                    </div>
                    <div className="col-span-2 mt-2">
                      <p className="text-gray-400 text-xs md:text-sm uppercase font-black tracking-widest mb-2">Housing</p>
                      <p className="text-white text-base md:text-lg font-bold">{vac.accommodation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-sm font-black tracking-[0.3em] uppercase mb-4 drop-shadow-md">Transparent Pricing</p>
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
                <th className="p-6 text-emerald-400 font-black text-lg md:text-xl uppercase tracking-wider">Total Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              {pricingOptions.map((opt, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                  <td className="p-6 text-base md:text-lg font-bold text-white leading-snug">{opt.service}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300 whitespace-nowrap">{opt.prep}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300">{opt.advance}</td>
                  <td className="p-6 text-base md:text-lg font-bold text-gray-300">{opt.post}</td>
                  <td className="p-6 text-xl md:text-2xl font-black text-emerald-400 drop-shadow-sm">{opt.total}</td>
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
                <Building size={40} className="text-emerald-400 mb-6 drop-shadow-md" />
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">Embassy Submission Required Docs</h3>
                <ul className="space-y-4">
                  {embassyDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-200 font-medium text-base md:text-lg">
                      <span className="text-emerald-400 mt-1 font-black">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-8">
                <FileText size={32} className="text-emerald-400 mb-4 drop-shadow-md" />
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight">Requested Documents</h3>
                <ul className="space-y-5">
                  {requestedDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-300 font-medium text-sm md:text-base">
                      <span className="text-emerald-400 mt-1 font-black">•</span> {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Questionnaire */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-10 h-full shadow-xl flex flex-col">
              <ClipboardList size={40} className="text-emerald-400 mb-8 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">Questionnaire Info</h3>
              <ul className="space-y-5 flex-grow">
                {questionnaire.map((q, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-200 font-medium text-base md:text-lg">
                    <span className="text-emerald-400 mt-1 font-black">•</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 md:p-10 h-full relative overflow-hidden flex flex-col shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <MapPin size={40} className="text-emerald-400 mb-8 relative z-10 drop-shadow-md" />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 relative z-10 tracking-tight">Application Process</h3>
              <div className="space-y-6 relative z-10 flex-grow">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs md:text-sm font-black text-emerald-300 shadow-lg">{i + 1}</div>
                      {i < processSteps.length - 1 && <div className="w-0.5 h-full bg-emerald-500/30 my-2" />}
                    </div>
                    <p className="text-gray-100 font-bold text-base md:text-lg pb-4 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl relative z-10 shadow-lg">
                <p className="text-emerald-300 text-sm md:text-base font-black uppercase text-center leading-relaxed tracking-wide">
                  PROCESS FOR DOCUMENTS PREPARATION IS UP TO 2 - 5 MONTHS
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
