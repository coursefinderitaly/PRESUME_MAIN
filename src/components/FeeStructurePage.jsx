import React from 'react';
import { Header } from './Header';
import MinimalFooter from './MinimalFooter';
import Subscriptions from './Subscriptions';

const FeeStructurePage = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col relative overflow-x-hidden">
      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full bg-amber-600/10 blur-[180px]" />
        <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-rose-600/8 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[15%] w-[800px] h-[800px] rounded-full bg-cyan-600/8 blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#030712_100%)]" />
      </div>

      <Header compact={false} />

      <main className="relative z-10 px-4 md:px-8 max-w-[1400px] mx-auto w-full pt-24 pb-20 flex-1 flex flex-col">
        <div style={{ flex: 1, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Subscriptions isStandalone={true} />
        </div>
      </main>

      <MinimalFooter />
    </div>
  );
};

export default FeeStructurePage;
