import logo from '../assets/logo.png';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const navLinks = ['Study Visa', 'Work Visa', 'Destinations', 'Universities', 'Contact'];

const contactActions = [
  { label: '+91-8839330134', icon: Phone },
  { label: 'presumeoverseas@gmail.com', icon: Mail },
  { label: 'Vijaynagar, Indore', icon: MapPin },
];

export const Footer = () => {
  return (
    <footer className="footer-clean-shell relative overflow-hidden text-white">
      <div className="absolute inset-0 footer-clean-bg" />
      <div className="absolute inset-0 footer-clean-aurora" />
      <div className="absolute inset-0 footer-clean-wave" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/45 to-transparent" />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <img src={logo} alt="Presume Overseas" className="mx-auto h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
          <h2 className="mt-6 text-3xl font-black tracking-normal sm:text-4xl">
            Your next destination starts with one clear plan.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-white/62 sm:text-base">
            Study and work visa guidance made simple, focused, and practical.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="footer-nav-pill rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-white/68 backdrop-blur transition-all hover:-translate-y-1 hover:border-slate-400/45 hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.055] p-3 text-left shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <a
              href="#"
              className="footer-primary-action inline-flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-black text-[#050b14] transition-transform hover:-translate-y-1"
            >
              <MessageCircle size={16} />
              Book a Free Call
              <ArrowUpRight size={16} />
            </a>

            <div className="flex flex-1 flex-col gap-2 md:flex-row md:flex-wrap md:justify-end">
              {contactActions.map(({ label, icon: Icon }) => (
                <div key={label} className="footer-contact-chip flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-white/64 transition-all hover:text-white">
                  <Icon size={16} className="text-slate-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-center text-sm text-white/42 md:flex-row md:items-center md:justify-between md:text-left">
          <p>&copy; 2026 Presume Overseas. All rights reserved.</p>
          <div className="flex justify-center gap-5">
            <a href="#" className="transition-colors hover:text-white">Terms</a>
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
