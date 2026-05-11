import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { geoCentroid } from "d3-geo";
import { Header } from "./Header";
import MinimalFooter from "./MinimalFooter";

// Official TopoJSON for Italy's regions
const geoUrl = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_regions.topo.json";

// Curated data: Universities, Region Fill Colors, and Label Text Colors
const regionData = {
  Piemonte: {
    color: "#a78bfa", // Purple
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Torino", "Politecnico di Torino", "Università del Piemonte Orientale"]
  },
  Lombardia: {
    color: "#60a5fa", // Blue
    labelColor: "#ffffff",
    universities: ["Università di Milano", "Politecnico di Milano", "Università di Pavia", "Milano-Bicocca", "Università di Bergamo"]
  },
  Veneto: {
    color: "#34d399", // Green
    labelColor: "#ffffff",
    universities: ["Università di Padova", "Ca' Foscari Venezia", "Università di Verona", "Iuav di Venezia"]
  },
  "Emilia-Romagna": {
    color: "#fb923c", // Orange
    labelColor: "#ffffff",
    universities: ["Università di Bologna", "Università di Parma", "Modena e Reggio Emilia", "Università di Ferrara"]
  },
  Toscana: {
    color: "#f472b6", // Pink
    labelColor: "#ffffff",
    universities: ["Università di Firenze", "Università di Pisa", "Università di Siena"]
  },
  Lazio: {
    color: "#38bdf8", // Sky Blue
    labelColor: "#ffffff",
    universities: ["Sapienza Università di Roma", "Tor Vergata", "Roma Tre", "Università della Tuscia"]
  },
  Campania: {
    color: "#fbbf24", // Amber
    labelColor: "#ffffff",
    universities: ["Napoli Federico II", "Università di Salerno", "Luigi Vanvitelli", "L'Orientale"]
  },
  Sicilia: {
    color: "#f87171", // Red
    labelColor: "#ffffff",
    universities: ["Università di Catania", "Università di Messina", "Università di Palermo"]
  },
  Puglia: {
    color: "#a3e635", // Lime
    labelColor: "#ffffff",
    universities: ["Bari Aldo Moro", "Politecnico di Bari", "Università del Salento"]
  },
  Sardegna: {
    color: "#2dd4bf", // Teal
    labelColor: "#ffffff",
    universities: ["Università di Cagliari", "Università di Sassari"]
  }
};

const ItalyMap = ({ isEmbedded = false }) => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState("");

  const content = (
    <>
      <motion.div 
        initial={isEmbedded ? { opacity: 0, scale: 0.98, y: 20 } : { opacity: 0, scale: 0.96, y: 20 }}
        whileInView={isEmbedded ? { opacity: 1, scale: 1, y: 0 } : {}}
        animate={!isEmbedded ? { opacity: 1, scale: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`relative w-full ${isEmbedded ? "max-w-6xl" : "max-w-7xl"} bg-white/[0.03] backdrop-blur-2xl rounded-[32px] md:rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] p-6 sm:p-12 border border-white/10 overflow-hidden group mx-auto`}
      >
        {/* Smooth Inner Glow Edge */}
        <div className="absolute inset-0 border border-white/5 rounded-[32px] md:rounded-[40px] pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Left Column: Header Text */}
          <div className="lg:w-1/3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-accent-gold mb-4">
              <Sparkles size={12} /> Explore Regions
            </div>
            <h1 className={`${isEmbedded ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"} font-black tracking-tighter mb-4 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70`}>
              Italian <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300">Universities</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed mb-8">
              Interactive visual overview of premier public educational institutions.
            </p>
          </div>

          {/* Right Column: Map */}
          <div className="lg:w-2/3 w-full relative">
            {/* Dynamic Hover Tooltip - Re-positioned aesthetic */}
            <div className="absolute top-0 left-0 h-12 flex items-center z-20">
              <AnimatePresence mode="wait">
                {hoveredRegion ? (
                  <motion.div
                    key="hovered"
                    initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                    className="bg-white/10 backdrop-blur-xl border border-white/10 text-white px-4 md:px-5 py-2 rounded-2xl text-xs md:text-sm font-black flex items-center gap-3 shadow-2xl uppercase tracking-wider"
                  >
                    <MapPin size={14} className="text-accent-gold" />
                    {hoveredRegion}
                  </motion.div>
                ) : (
                  <motion.div
                    key="instruction"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse"></div> Select a region
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: isEmbedded ? 2600 : 2800, // Optimized scale for inline
                center: [12.6, 41.8], // Slightly adjusted center to balance space
              }}
              className="w-full h-auto outline-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]"
              style={{ maxWidth: '100%', maxHeight: '650px', margin: '0 auto' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const regionName = geo.properties.reg_name;
                    const data = regionData[regionName];
                    const isSelected = activeRegion?.name === regionName;
                    const baseFill = data ? data.color : "rgba(255,255,255,0.08)";
                    const centroid = geoCentroid(geo);

                    return (
                      <React.Fragment key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          onMouseEnter={() => setHoveredRegion(regionName)}
                          onMouseLeave={() => setHoveredRegion("")}
                          onClick={() => {
                            setActiveRegion({
                              name: regionName,
                              universities: data ? data.universities : [],
                              color: data ? data.color : "#475569"
                            });
                          }}
                          style={{
                            default: {
                              fill: isSelected ? "#ffffff" : baseFill,
                              fillOpacity: data ? 0.85 : 0.4,
                              stroke: "#020817",
                              strokeWidth: 1,
                              outline: "none",
                              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                            },
                            hover: {
                              fill: isSelected ? "#ffffff" : baseFill,
                              fillOpacity: 1,
                              stroke: "#ffffff",
                              strokeWidth: 1.5,
                              outline: "none",
                              cursor: "pointer",
                              filter: "brightness(1.1) drop-shadow(0 0 12px rgba(255,255,255,0.1))",
                              transition: "all 0.2s ease",
                            },
                            pressed: {
                              fill: "#ffffff",
                              fillOpacity: 1,
                              outline: "none",
                            },
                          }}
                        />

                        {/* Refined Region Data Label */}
                        {data && (
                          <Marker coordinates={centroid}>
                            <text
                              y="2"
                              fontSize={7}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontWeight="900"
                              className="uppercase tracking-widest pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity"
                              style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}
                            >
                              {regionName}
                            </text>
                          </Marker>
                        )}
                      </React.Fragment>
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>
      </motion.div>

      {/* Framer Motion Animated Popup Modal */}
      <AnimatePresence>
        {activeRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setActiveRegion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-[#0b1120]/95 border border-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="relative p-7 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-30 blur-2xl"
                  style={{ backgroundColor: activeRegion.color }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1120]"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-accent-gold uppercase mb-1 flex items-center gap-1.5">
                      <MapPin size={12}/> Region Hub
                    </p>
                    <h2 className="text-3xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                      {activeRegion.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveRegion(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* List Layout */}
              <div className="p-6 relative bg-[#0b1120]">
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 px-2">Institutions</p>
                <ul className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {activeRegion.universities && activeRegion.universities.length > 0 ? (
                    activeRegion.universities.map((uni, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="flex items-center gap-4 text-gray-200 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                          style={{ backgroundColor: `${activeRegion.color}25`, border: `1px solid ${activeRegion.color}40` }}
                        >
                          <GraduationCap
                            size={18}
                            style={{ color: activeRegion.color }}
                          />
                        </div>
                        <span className="font-bold text-sm leading-tight text-gray-100 tracking-wide group-hover:text-white transition-colors">{uni}</span>
                      </motion.li>
                    ))
                  ) : (
                    <motion.li
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-center py-14 font-medium italic text-sm"
                    >
                      No public university data found for this region.
                    </motion.li>
                  )}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (isEmbedded) {
    return (
      <div className="w-full relative z-20 py-12 px-4 flex flex-col items-center font-sans overflow-visible">
        {content}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#020817] text-white flex flex-col font-sans selection:bg-accent-gold/30 overflow-hidden">
      
      {/* 🌌 PERFECT LOOP ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[130px] mix-blend-screen"
        />
        <motion.div
          animate={{
            x: [50, -50, 50],
            y: [30, -30, 30],
            scale: [1.1, 0.9, 1.1],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[140px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-gold/5 blur-[120px]"
        />
        <motion.div 
          animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
      </div>

      <Header />

      <main className="relative z-10 flex-1 flex flex-col items-center pt-32 pb-24 px-4">
        {content}
      </main>

      <MinimalFooter />
    </div>
  );
};

export default ItalyMap;