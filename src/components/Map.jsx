import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";
import { geoCentroid } from "d3-geo";

// Official TopoJSON for Italy's regions
const geoUrl = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_regions.topo.json";

// Curated data: Universities, Region Fill Colors, and Label Text Colors
const regionData = {
  "Valle d'Aosta/Vallée d'Aoste": {
    color: "#c084fc",
    labelColor: "#ffffff",
    universities: ["Università della Valle d'Aosta"]
  },
  Piemonte: {
    color: "#a78bfa",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Torino", "Politecnico di Torino", "Università degli Studi del Piemonte Orientale \"Amedeo Avogadro\""]
  },
  Liguria: {
    color: "#f43f5e",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Genova"]
  },
  Lombardia: {
    color: "#60a5fa",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Milano",
      "Politecnico di Milano",
      "Università degli Studi di Pavia",
      "Università degli Studi di Milano-Bicocca",
      "Università degli Studi di Bergamo",
      "Università degli Studi di Brescia",
      "Università degli Studi dell'Insubria"
    ]
  },
  "Trentino-Alto Adige/Südtirol": {
    color: "#22c55e",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Trento", "Libera Università di Bolzano"]
  },
  Veneto: {
    color: "#34d399",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Padova",
      "Università Ca' Foscari Venezia",
      "Università degli Studi di Verona",
      "Università Iuav di Venezia"
    ]
  },
  "Friuli-Venezia Giulia": {
    color: "#10b981",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Trieste", "Università degli Studi di Udine"]
  },
  "Emilia-Romagna": {
    color: "#fb923c",
    labelColor: "#ffffff",
    universities: [
      "Alma Mater Studiorum - Università di Bologna",
      "Università degli Studi di Parma",
      "Università degli Studi di Modena e Reggio Emilia",
      "Università degli Studi di Ferrara"
    ]
  },
  Toscana: {
    color: "#f472b6",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Firenze",
      "Università di Pisa",
      "Università degli Studi di Siena",
      "Università per Stranieri di Siena"
    ]
  },
  Umbria: {
    color: "#ec4899",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Perugia", "Università per Stranieri di Perugia"]
  },
  Marche: {
    color: "#8b5cf6",
    labelColor: "#ffffff",
    universities: [
      "Università Politecnica delle Marche",
      "Università degli Studi di Macerata",
      "Università di Camerino",
      "Università degli Studi di Urbino Carlo Bo"
    ]
  },
  Lazio: {
    color: "#38bdf8",
    labelColor: "#ffffff",
    universities: [
      "Sapienza Università di Roma",
      "Università degli Studi di Roma \"Tor Vergata\"",
      "Università degli Studi Roma Tre",
      "Università degli Studi della Tuscia (Viterbo)",
      "Università degli Studi di Cassino e del Lazio Meridionale",
      "Università degli Studi di Roma \"Foro Italico\""
    ]
  },
  Abruzzo: {
    color: "#f97316",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi dell'Aquila",
      "Università degli Studi \"G. d'Annunzio\" Chieti-Pescara",
      "Università degli Studi di Teramo"
    ]
  },
  Molise: {
    color: "#facc15",
    labelColor: "#ffffff",
    universities: ["Università degli Studi del Molise"]
  },
  Campania: {
    color: "#fbbf24",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Napoli Federico II",
      "Università degli Studi della Campania \"Luigi Vanvitelli\"",
      "Università degli Studi di Salerno",
      "Università degli Studi di Napoli \"L'Orientale\"",
      "Università degli Studi di Napoli Parthenope",
      "Università degli Studi del Sannio (Benevento)"
    ]
  },
  Puglia: {
    color: "#a3e635",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Bari Aldo Moro",
      "Politecnico di Bari",
      "Università del Salento (Lecce)",
      "Università degli Studi di Foggia"
    ]
  },
  Basilicata: {
    color: "#eab308",
    labelColor: "#ffffff",
    universities: ["Università degli Studi della Basilicata"]
  },
  Calabria: {
    color: "#ef4444",
    labelColor: "#ffffff",
    universities: [
      "Università della Calabria (Rende)",
      "Università degli Studi Magna Græcia di Catanzaro",
      "Università Mediterranea di Reggio Calabria"
    ]
  },
  Sicilia: {
    color: "#f87171",
    labelColor: "#ffffff",
    universities: [
      "Università degli Studi di Catania",
      "Università degli Studi di Palermo",
      "Università degli Studi di Messina"
    ]
  },
  Sardegna: {
    color: "#2dd4bf",
    labelColor: "#ffffff",
    universities: ["Università degli Studi di Cagliari", "Università degli Studi di Sassari"]
  }
};

const ItalyMap = ({ isEmbedded = false }) => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState("");

  const content = (
    <>
      {/* Top Title Section */}
      <div className="w-full text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-accent-gold mb-4 mx-auto">
          <Sparkles size={12} /> Explore Regions
        </div>
        <h1 className={`${isEmbedded ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"} font-black tracking-tighter mb-4 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70`}>
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300">University By Region</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
          Interactive visual overview of premier public educational institutions.
        </p>
      </div>

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

        <div className="flex flex-col lg:flex-row gap-12 relative z-10 items-stretch">
          
          {/* Left Column: Map */}
          <div className="lg:w-3/5 w-full relative flex flex-col justify-center">
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
              width={800}
              height={800}
              projectionConfig={{
                scale: 2600, // Tightly tuned scale to ensure fit
                center: [12.6, 41.8],
              }}
              className="w-full h-auto outline-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] mt-4"
              style={{ maxWidth: '100%', maxHeight: '800px', margin: '0 auto' }}
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
                            {/* Glowing Dot Node */}
                            <circle r={3.5} fill={data.color} stroke="#ffffff" strokeWidth={1} className="pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            <circle r={1.5} fill="#ffffff" className="pointer-events-none" />
                            
                            <text
                              y="13"
                              fontSize={6}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontWeight="900"
                              className="uppercase tracking-widest pointer-events-none opacity-75 transition-opacity"
                              style={{ textShadow: '0px 1.5px 3px rgba(0,0,0,0.9)' }}
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

          {/* Right Column: University List Panel */}
          <div className="lg:w-2/5 w-full flex flex-col relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeRegion ? (
                <motion.div
                  key={activeRegion.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#0b1120]/80 border border-white/10 backdrop-blur-2xl rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] w-full overflow-hidden relative flex flex-col h-auto min-h-[600px]"
                >
                  {/* Premium Header Design */}
                  <div className="relative p-8 pb-6 overflow-hidden flex-shrink-0 border-b border-white/10">
                    {/* Ambient Dynamic Glow */}
                    {/* Highly Vibrant Adaptive Spotlight Glow */}
                    <div 
                      className="absolute inset-0 opacity-30 blur-[100px] pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${activeRegion.color}, transparent 70%)` }}
                    ></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Left-side Accent Bar matching the region color */}
                        <div className="w-1.5 h-12 rounded-full shadow-lg" style={{ backgroundColor: activeRegion.color, boxShadow: `0 0 25px ${activeRegion.color}` }}></div>
                        
                        <div>
                          <p className="text-[10px] font-black tracking-[0.25em] text-gray-400 uppercase mb-1">Discover Region</p>
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 backdrop-blur-md">
                            <GraduationCap size={13} style={{ color: activeRegion.color }} />
                            <span className="text-[11px] font-bold text-white/90 tracking-wide">
                              {activeRegion.universities?.length || 0} Public Universities
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Dynamic Color-Injected Typography */}
                      <h2 
                        className="text-4xl sm:text-5xl font-black tracking-tighter leading-none mt-2 break-words bg-clip-text text-transparent"
                        style={{ 
                          backgroundImage: `linear-gradient(to bottom right, #ffffff 40%, ${activeRegion.color})`,
                          filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.4))` 
                        }}
                      >
                        {activeRegion.name}
                      </h2>
                    </div>
                  </div>

                  {/* List Area */}
                  <div className="p-6 relative bg-transparent">
                    <div className="flex items-center gap-3 mb-5 px-2">
                      <p className="text-[11px] font-black tracking-[0.15em] text-accent-gold uppercase whitespace-nowrap">Academic Directory</p>
                      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                    <ul className="space-y-3">
                      {activeRegion.universities && activeRegion.universities.length > 0 ? (
                        activeRegion.universities.map((uni, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 text-gray-200 bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group flex-shrink-0"
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                              style={{ backgroundColor: `${activeRegion.color}25`, border: `1px solid ${activeRegion.color}40` }}
                            >
                              <GraduationCap size={18} style={{ color: activeRegion.color }} />
                            </div>
                            <span className="font-bold text-sm leading-tight text-gray-100 tracking-wide group-hover:text-white transition-colors">{uni}</span>
                          </motion.li>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-14 font-medium italic text-sm">
                          No public university data found for this region.
                        </div>
                      )}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.02] border border-white/5 border-dashed rounded-[32px] w-full flex flex-col items-center justify-center min-h-[600px] relative text-center p-8"
                >
                  <MapPin size={48} className="text-gray-600 mb-4 opacity-50" />
                  <h3 className="text-gray-300 font-bold text-lg mb-2">No Region Selected</h3>
                  <p className="text-gray-500 text-sm max-w-[200px]">Click on any highlighted region on the map to discover its universities.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="w-full relative z-20 py-12 px-4 flex flex-col items-center font-sans overflow-visible">
      {content}
    </div>
  );
};

export default ItalyMap;