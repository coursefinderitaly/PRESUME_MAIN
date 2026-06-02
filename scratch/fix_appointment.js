const fs = require('fs');
const file = 'src/components/AppointmentForm.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Dynamic Calendar Logic
const oldCalendarLogic = `    const activeType = consultancyTypes.find(t => t.label === formData.consultancyType);

    // Custom Calendar Logic (Current Month)
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];`;

const newCalendarLogic = `    const activeType = consultancyTypes.find(t => t.label === formData.consultancyType);

    // Dynamic Calendar Logic
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const currentDaysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
    const daysInMonth = Array.from({ length: currentDaysInMonth }, (_, i) => i + 1);
    const times = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];`;

content = content.replace(oldCalendarLogic, newCalendarLogic);

// 2. Calendar UI rendering
content = content.replace(/May 2024/g, '{`${currentMonth} ${currentYear}`}');
content = content.replace(/formData\.date === `May \${d}, 2024`/g, 'formData.date === `${currentMonth} ${d}, ${currentYear}`');
content = content.replace(/setFormData\(p => \(\{ \.\.\.p, date: `May \$\{d\}, 2024` \}\)\)/g, 'setFormData(p => ({ ...p, date: `${currentMonth} ${d}, ${currentYear}` }))');


// 3. Popup background & text visibility
content = content.replace(
  'className="w-full max-w-2xl bg-white/[0.04] border border-white/20 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-3xl p-8 sm:p-10"',
  'className="w-full max-w-2xl bg-[#0b0f19]/80 border border-white/20 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl p-8 sm:p-10"'
);

// 4. Header text size in popup
content = content.replace(
  '<h2 className="text-xl font-black uppercase tracking-widest text-white leading-none">',
  '<h2 className="text-3xl font-black uppercase tracking-widest text-white leading-tight text-center md:text-left">'
);

// Also maybe text-[10px] text-gray-400 font-bold...
content = content.replace(
  '<p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-1.5">',
  '<p className="text-xs text-accent-gold font-bold uppercase tracking-[0.3em] mt-2 text-center md:text-left">'
);

// Center aligning the flex container if needed
content = content.replace(
  '<div className="flex items-center justify-between mb-8">',
  '<div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">'
);
content = content.replace(
  '<div className="flex items-center gap-3">',
  '<div className="flex items-center gap-4">'
);

// 5. Replace Video with Animated CSS Fluid Background
const oldBg = `            {/* New Background Video Loop (Germany) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-105 blur-[3px] opacity-50 brightness-[0.9]"
                >
                    <source src="/italy.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d18]/80 via-transparent to-[#0a0d18]/90"></div>
            </div>`;

const newBg = `            {/* Animated CSS Fluid Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050810]">
                <style>
                    {\`
                        @keyframes fluid-1 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10vw, 15vh) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }
                        @keyframes fluid-2 { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-15vw, 10vh) scale(1.3); } 100% { transform: translate(0, 0) scale(1); } }
                        @keyframes fluid-3 { 0% { transform: translate(0, 0) scale(1.2); } 50% { transform: translate(10vw, -15vh) scale(1); } 100% { transform: translate(0, 0) scale(1.2); } }
                    \`}
                </style>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vh', background: 'radial-gradient(circle, rgba(197, 168, 128, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'fluid-1 20s infinite ease-in-out' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '70vw', height: '70vh', background: 'radial-gradient(circle, rgba(10, 37, 64, 0.4) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'fluid-2 25s infinite ease-in-out' }}></div>
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '50vw', height: '50vh', background: 'radial-gradient(circle, rgba(0, 140, 69, 0.1) 0%, transparent 70%)', filter: 'blur(90px)', animation: 'fluid-3 22s infinite ease-in-out' }}></div>
                
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d18]/40 via-transparent to-[#0a0d18]/80"></div>
            </div>`;

content = content.replace(oldBg, newBg);

fs.writeFileSync(file, content, 'utf8');
console.log("Replaced all requested components in AppointmentForm.jsx");
