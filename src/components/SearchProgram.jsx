import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Building, GraduationCap, ExternalLink, Filter, Database, Loader2, CalendarClock, Download, X, CheckSquare, FileSpreadsheet } from 'lucide-react';
import Select from 'react-select';
import * as XLSX from 'xlsx';

// Removed the direct Google Apps Script URL for security
// Data is now fetched natively through the backend proxy

import { API_BASE_URL } from '../config';

// Fallback sample data structured like what the Google Sheet would return
const sampleSheetData = [
  {
    id: "1",
    "University Name": "Sample University A",
    "Location": "New York, USA",
    "Type": "Public",
    "Ranking": "#10",
    "program level": "PG",
    "percentage": 75,
    "Interested field": "Engineering",
    "sub field": "Computer Science",
    "program name": "MSc Computer Science",
    "Tuition Fee": "$20,000 / year",
    "Intakes": "Fall 2024",
    "Application Deadline": "Jan 2024"
  },
  {
    id: "2",
    "University Name": "Sample University B",
    "Location": "London, UK",
    "Type": "Private",
    "Ranking": "#5",
    "program level": "UG",
    "percentage": 80,
    "Interested field": "Business",
    "sub field": "Management",
    "program name": "BBA Management",
    "Language": "English",
    "Requires IELTS": "Yes"
  }
];

// Helper to reliably find object properties regardless of case/spacing
const getFieldValue = (item, possibleKeys) => {
  if (!item) return null;
  const itemKeys = Object.keys(item);
  const normalizedPossibles = possibleKeys.map(k => k.toLowerCase().replace(/[\s_.-]+/g, ''));

  for (let key of itemKeys) {
    const normalizedKey = key.toLowerCase().replace(/[\s_.-]+/g, '');
    if (normalizedPossibles.includes(normalizedKey)) {
      return item[key];
    }
  }
  return null;
};

let cachedSheetData = null;
let currentFetchPromise = null;

const SearchProgram = ({ onProceed, preselectedUnis = [], hideFooter = false, proceedLabel = "Proceed to Apply", onSelectionChange }) => {
  const [searchParams, setSearchParams] = useState({
    programLevel: null,
    interestedField: null,
    subField: null,
    programName: null,
    intake: null,
    percentage: ''
  });

  // --- Helper to format date values (especially from Excel) ---
  const formatDisplayValue = (val, isDeadlineCol = false) => {
    if (val === null || val === undefined || val === "" || val === "N/A" || val === "n/a") return "N/A";

    // Check for Excel serial numbers (typical range for 1990-2050)
    if (typeof val === 'number' && val > 30000 && val < 60000) {
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    // Check for ISO date strings
    if (typeof val === 'string' && (val.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(val))) {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }

    // Fallback for regular strings that look like dates but aren't ISO
    if (isDeadlineCol && typeof val === 'string' && !isNaN(Date.parse(val)) && val.length > 5) {
      const date = new Date(val);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    return val;
  };

  const [universitiesData, setUniversitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUniIds, setSelectedUniIds] = useState(() => preselectedUnis.map(u => u.id));
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setSelectedUniIds(prev => {
      const newIds = preselectedUnis.map(u => u.id);
      if (newIds.length !== prev.length || !newIds.every(id => prev.includes(id))) {
        return newIds;
      }
      return prev;
    });
  }, [preselectedUnis]);

  // Fetch data from Google Sheet App Script
  useEffect(() => {
    const fetchData = async () => {
      if (cachedSheetData) {
        setUniversitiesData(cachedSheetData);
        return;
      }
      setIsLoading(true);
      try {
        if (!currentFetchPromise) {
          currentFetchPromise = fetch(`${API_BASE_URL}/sheets`, {
            credentials: 'include',
          }).then(async response => {
            if (!response.ok) throw new Error("Failed to fetch data from backend proxy");
            const data = await response.json();
            return data.map((item, index) => ({
              ...item,
              id: item.id || `sheet_row_${index}`
            }));
          });
        }

        const dataWithIds = await currentFetchPromise;
        cachedSheetData = dataWithIds;
        setUniversitiesData(dataWithIds);
      } catch (err) {
        console.error("Error fetching universities:", err);
        setError("Failed to load university data.");
        setUniversitiesData(sampleSheetData); // Fallback to sample on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Dynamic Dropdown Options Generation ---
  const extractUniqueOptions = (data, keys) => {
    const rawSet = new Set();
    data.forEach(item => {
      const val = getFieldValue(item, keys);
      if (val !== null && val !== undefined) {
        if (typeof val === 'string' && val.trim() !== '') {
          rawSet.add(val.trim());
        } else if (typeof val === 'number') {
          rawSet.add(val.toString().trim());
        }
      }
    });
    return Array.from(rawSet).sort().map(val => ({ value: val, label: val }));
  };

  const levelOptions = useMemo(() => [
    { value: '', label: 'Any Level' },
    ...extractUniqueOptions(universitiesData, ['programlevel', 'level'])
  ], [universitiesData]);

  const interestedFieldOptions = useMemo(() => {
    let filteredData = universitiesData;
    if (searchParams.programLevel && searchParams.programLevel.value) {
      const qLevel = searchParams.programLevel.value.toLowerCase();
      filteredData = filteredData.filter(u => {
        const uLevel = (getFieldValue(u, ['programlevel', 'level']) || "").toLowerCase();
        return uLevel.includes(qLevel);
      });
    }
    return [
      { value: '', label: 'Any Interested Field' },
      ...extractUniqueOptions(filteredData, ['interestedfield'])
    ];
  }, [universitiesData, searchParams.programLevel]);

  const subFieldOptions = useMemo(() => {
    let filteredData = universitiesData;

    if (searchParams.programLevel && searchParams.programLevel.value) {
      const qLevel = searchParams.programLevel.value.toLowerCase();
      filteredData = filteredData.filter(u => {
        const uLevel = (getFieldValue(u, ['programlevel', 'level']) || "").toLowerCase();
        return uLevel.includes(qLevel);
      });
    }

    if (searchParams.interestedField && searchParams.interestedField.value) {
      filteredData = filteredData.filter(u => {
        const val = getFieldValue(u, ['interestedfield']);
        return val && String(val).trim() === searchParams.interestedField.value;
      });
    }
    return [
      { value: '', label: 'Any Sub Field' },
      ...extractUniqueOptions(filteredData, ['subfield'])
    ];
  }, [universitiesData, searchParams.programLevel, searchParams.interestedField]);

  const programNameOptions = useMemo(() => {
    let filteredData = universitiesData;

    if (searchParams.programLevel && searchParams.programLevel.value) {
      const qLevel = searchParams.programLevel.value.toLowerCase();
      filteredData = filteredData.filter(u => {
        const uLevel = (getFieldValue(u, ['programlevel', 'level']) || "").toLowerCase();
        return uLevel.includes(qLevel);
      });
    }

    if (searchParams.interestedField && searchParams.interestedField.value) {
      filteredData = filteredData.filter(u => {
        const val = getFieldValue(u, ['interestedfield']);
        return val && String(val).trim() === searchParams.interestedField.value;
      });
    }
    if (searchParams.subField && searchParams.subField.value) {
      filteredData = filteredData.filter(u => {
        const val = getFieldValue(u, ['subfield']);
        return val && String(val).trim() === searchParams.subField.value;
      });
    }
    return [
      { value: '', label: 'Any Program' },
      ...extractUniqueOptions(filteredData, ['programname', 'program', 'name'])
    ];
  }, [universitiesData, searchParams.programLevel, searchParams.interestedField, searchParams.subField]);

  const intakeOptions = [
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' }
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'var(--input-bg)',
      borderColor: state.isFocused ? 'var(--accent-secondary)' : 'var(--input-border)',
      color: 'var(--text-main)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(14, 165, 233, 0.15)' : 'none',
      cursor: 'pointer',
      minHeight: '30px',
      height: '30px',
      borderRadius: '8px',
      '&:hover': { borderColor: 'var(--accent-secondary)' },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(59, 130, 246, 0.15)'
        : state.isFocused ? 'rgba(128, 128, 128, 0.1)' : 'transparent',
      color: state.isSelected ? 'var(--accent-secondary)' : 'var(--text-main)',
      cursor: 'pointer',
      '&:hover': { backgroundColor: 'rgba(128, 128, 128, 0.1)' }
    }),
    singleValue: (base) => ({ ...base, color: 'var(--text-main)', fontSize: '0.8rem' }),
    valueContainer: (base) => ({ ...base, padding: '0 8px', height: '28px' }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)', fontSize: '0.8rem' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, color: 'var(--text-muted)', padding: '4px' }),
  };

  const handleSelectChange = (name, selectedOption) => {
    setHasSearched(false);
    setSearchParams(prev => {
      const updated = { ...prev, [name]: selectedOption };

      // Auto-clear dependent fields when parent changes
      if (name === "programLevel") {
        updated.interestedField = null;
        updated.subField = null;
        updated.programName = null;
      } else if (name === "interestedField") {
        updated.subField = null;
        updated.programName = null;
      } else if (name === "subField") {
        updated.programName = null;
      } else if (name === "intake") {
        // Nothing dependent on intake specifically
      }

      return updated;
    });
  };

  const handleTextChange = (e) => {
    setHasSearched(false);
    setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredResults = useMemo(() => {
    let filtered = universitiesData;

    // Filter by Program Level
    if (searchParams.programLevel && searchParams.programLevel.value) {
      const qLevel = searchParams.programLevel.value.toLowerCase();
      filtered = filtered.filter(u => {
        const uLevel = (getFieldValue(u, ['programlevel', 'level']) || "").toLowerCase();
        return uLevel.includes(qLevel);
      });
    }

    // Filter by Percentage
    if (searchParams.percentage) {
      const p = parseFloat(searchParams.percentage);
      if (!isNaN(p)) {
        filtered = filtered.filter(u => {
          const reqStr = getFieldValue(u, ['percentage', 'minpercentage']);
          let finalReq = 0;
          if (reqStr) {
            if (typeof reqStr === 'string' && reqStr.includes('%')) {
              finalReq = parseFloat(reqStr.replace('%', ''));
            } else {
              const rawNum = parseFloat(reqStr);
              finalReq = rawNum < 1 ? rawNum * 100 : rawNum;
            }
          }
          return p >= finalReq;
        });
      }
    }

    // Filter by Program Name
    if (searchParams.programName && searchParams.programName.value) {
      const q = searchParams.programName.value.toLowerCase();
      filtered = filtered.filter(u => {
        const uProg = (getFieldValue(u, ['programname', 'program', 'name']) || "").toLowerCase();
        return uProg.includes(q);
      });
    }

    // Filter by Interested Field
    if (searchParams.interestedField && searchParams.interestedField.value) {
      const q = searchParams.interestedField.value.toLowerCase();
      filtered = filtered.filter(u => {
        const field = (getFieldValue(u, ['interestedfield']) || "").toLowerCase();
        return field.includes(q);
      });
    }

    // Filter by Sub Field
    if (searchParams.subField && searchParams.subField.value) {
      const q = searchParams.subField.value.toLowerCase();
      filtered = filtered.filter(u => {
        const field = (getFieldValue(u, ['subfield']) || "").toLowerCase();
        return field.includes(q);
      });
    }

    return filtered;
  }, [universitiesData, searchParams]);

  const toggleSelection = (uni) => {
    const uniId = uni.id;
    const isNowSelected = !selectedUniIds.includes(uniId);

    if (isNowSelected && selectedUniIds.length >= 25 && !hideFooter) {
      setError("You can select a maximum of 25 programs for the Excel export at one time.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    setSelectedUniIds(prev =>
      prev.includes(uniId) ? prev.filter(id => id !== uniId) : [...prev, uniId]
    );

    if (onSelectionChange) {
      const formattedUni = {
        id: uni.id,
        name: getFieldValue(uni, ['universityname', 'name']) || "Unknown University",
        location: getFieldValue(uni, ['location']) || "Unknown Location",
        level: getFieldValue(uni, ['programlevel', 'level']) || "N/A",
        minPercentage: (() => {
          const raw = getFieldValue(uni, ['percentage']) || "0";
          if (typeof raw === 'string' && raw.includes('%')) return parseFloat(raw.replace('%', ''));
          const n = parseFloat(raw);
          return isNaN(n) ? 0 : (n < 1 ? Math.round(n * 100) : n);
        })(),
        type: getFieldValue(uni, ['type']) || "N/A",
        ranking: getFieldValue(uni, ['ranking']) || "N/A",
        programs: [getFieldValue(uni, ['programname', 'program']) || "Unknown Program"],
        intake: searchParams.intake ? searchParams.intake.value : '2026',
        rawSheetData: uni
      };
      onSelectionChange(formattedUni, isNowSelected);
    }
  };

  const handleSelectAllFiltered = () => {
    const visibleResults = filteredResults.slice(0, 25);
    const visibleIds = visibleResults.map(uni => uni.id || uni.SNO);
    const allVisibleSelected = visibleIds.every(id => selectedUniIds.includes(id));

    if (allVisibleSelected) {
      // Deselect all visible
      setSelectedUniIds(prev => prev.filter(id => !visibleIds.includes(id)));
      if (onSelectionChange) {
        visibleResults.forEach(uni => {
          const formattedUni = {
            id: uni.id || uni.SNO,
            name: getFieldValue(uni, ['universityname', 'name']) || "Unknown University",
            location: getFieldValue(uni, ['location']) || "Unknown Location",
            level: getFieldValue(uni, ['programlevel', 'level']) || "N/A",
            minPercentage: (() => {
              const raw = getFieldValue(uni, ['percentage']) || "0";
              if (typeof raw === 'string' && raw.includes('%')) return parseFloat(raw.replace('%', ''));
              const n = parseFloat(raw);
              return isNaN(n) ? 0 : (n < 1 ? Math.round(n * 100) : n);
            })(),
            type: getFieldValue(uni, ['type']) || "N/A",
            ranking: getFieldValue(uni, ['ranking']) || "N/A",
            programs: [getFieldValue(uni, ['programname', 'program']) || "Unknown Program"],
            intake: searchParams.intake ? searchParams.intake.value : '2026',
            rawSheetData: uni
          };
          onSelectionChange(formattedUni, false);
        });
      }
    } else {
      // Select all visible (up to 25)
      const toAdd = visibleResults.filter(uni => !selectedUniIds.includes(uni.id || uni.SNO));

      let currentCount = selectedUniIds.length;
      const actualToAdd = [];
      const newIds = [...selectedUniIds];

      for (const uni of toAdd) {
        if (currentCount < 25) {
          actualToAdd.push(uni);
          newIds.push(uni.id || uni.SNO);
          currentCount++;
        }
      }

      setSelectedUniIds(newIds);

      if (onSelectionChange) {
        actualToAdd.forEach(uni => {
          const formattedUni = {
            id: uni.id || uni.SNO,
            name: getFieldValue(uni, ['universityname', 'name']) || "Unknown University",
            location: getFieldValue(uni, ['location']) || "Unknown Location",
            level: getFieldValue(uni, ['programlevel', 'level']) || "N/A",
            minPercentage: (() => {
              const raw = getFieldValue(uni, ['percentage']) || "0";
              if (typeof raw === 'string' && raw.includes('%')) return parseFloat(raw.replace('%', ''));
              const n = parseFloat(raw);
              return isNaN(n) ? 0 : (n < 1 ? Math.round(n * 100) : n);
            })(),
            type: getFieldValue(uni, ['type']) || "N/A",
            ranking: getFieldValue(uni, ['ranking']) || "N/A",
            programs: [getFieldValue(uni, ['programname', 'program']) || "Unknown Program"],
            intake: searchParams.intake ? searchParams.intake.value : '2026',
            rawSheetData: uni
          };
          onSelectionChange(formattedUni, true);
        });
      }

      if (filteredResults.length > 25) {
        setError("Only the first 25 filtered results were selected (Export Limit).");
        setTimeout(() => setError(null), 4000);
      } else if (toAdd.length > actualToAdd.length) {
        setError("Export limit of 25 programs reached.");
        setTimeout(() => setError(null), 4000);
      }
    }
  };

  const handleProceedWithSelected = (e) => {
    if (e) e.stopPropagation();
    if (onProceed && selectedUniIds.length > 0) {
      const selected = universitiesData.filter(u => selectedUniIds.includes(u.id)).map(uni => ({
        id: uni.id,
        name: getFieldValue(uni, ['universityname', 'name']) || "Unknown University",
        location: getFieldValue(uni, ['location']) || "Unknown Location",
        level: getFieldValue(uni, ['programlevel', 'level']) || "N/A",
        minPercentage: (() => {
          const raw = getFieldValue(uni, ['percentage']) || "0";
          if (typeof raw === 'string' && raw.includes('%')) return parseFloat(raw.replace('%', ''));
          const n = parseFloat(raw);
          return isNaN(n) ? 0 : (n < 1 ? Math.round(n * 100) : n);
        })(),
        type: getFieldValue(uni, ['type']) || "N/A",
        ranking: getFieldValue(uni, ['ranking']) || "N/A",
        programs: [getFieldValue(uni, ['programname', 'program']) || "Unknown Program"],
        intake: searchParams.intake ? searchParams.intake.value : '2026',
        rawSheetData: uni
      }));
      onProceed(selected);
    }
  };

  const handleDownloadExcel = async () => {
    setError("Export Feature Coming Soon! We are currently upgrading our systems.");
    setTimeout(() => setError(null), 5000);
    setShowDownloadModal(false);
  };

  // Helper to extract non-standard columns for display
  const getOtherColumns = (uni) => {
    const standardKeysNormalized = [
      "id", "universityname", "name",
      "location", "type", "ranking",
      "percentage", "minpercentage",
      "programlevel", "level",
      "interestedfield",
      "subfield",
      "programname", "program", "rawsheetdata",
      "sno" // Hide S.NO entirely
    ];
    return Object.keys(uni).filter(key => {
      const normKey = key.toLowerCase().replace(/[\s_.-]+/g, '');
      return !standardKeysNormalized.includes(normKey) &&
        uni[key] !== null &&
        uni[key] !== undefined &&
        uni[key] !== "";
    });
  };

  return (
    <div className="view-search" style={{
      display: 'flex',
      gap: '24px',
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      minHeight: 0,
      position: 'relative',
      animation: 'fadeUp 0.4s ease',
      paddingBottom: selectedUniIds.length > 0 && !hideFooter ? '60px' : '0'
    }}>

      {/* LEFT CANVAS: SEARCH RESULTS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%' }}>

        <header className="dash-header" style={{ marginBottom: "16px", flexShrink: 0, borderBottom: 'none', padding: 0, background: 'transparent', backdropFilter: 'none' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Course Finder</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Discover optimal academic pathways tailored for you.</p>
          </div>
        </header>

        {error && (
          <div style={{ flexShrink: 0, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {/* Result Scroll Context */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Search Results</h3>
              {!isLoading && hasSearched && (
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {filteredResults.length} Found
                </div>
              )}
            </div>

            {!isLoading && hasSearched && filteredResults.length > 0 && !hideFooter && (
              <button
                onClick={handleSelectAllFiltered}
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--glass-border)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <CheckSquare size={14} />
                {filteredResults.slice(0, 25).every(u => selectedUniIds.includes(u.id || u.SNO))
                  ? 'Deselect Page'
                  : 'Select Max 25'}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="empty-state" style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'var(--card-bg-solid)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--accent-primary)', borderRightColor: 'var(--accent-secondary)', animation: 'spin 1.5s linear infinite' }}></div>
                <Database size={28} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Querying University Database...</p>
            </div>
          ) : !hasSearched ? (
            <div style={{ height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-muted)', background: 'var(--card-bg-solid)', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
              <div style={{ background: 'var(--glass-highlight)', padding: '20px', borderRadius: '50%' }}>
                <Search size={40} style={{ color: 'var(--text-dim)' }} />
              </div>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>Begin Your Search</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', textAlign: 'center', maxWidth: '300px' }}>Configure the filters on the right panel to narrow down global course opportunities.</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div style={{ padding: '40px 20px', color: 'var(--text-muted)', textAlign: 'center', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '16px', border: '1px dashed rgba(239, 68, 68, 0.2)' }}>
              <X size={32} style={{ color: '#ef4444', marginBottom: '12px', opacity: 0.7 }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>No Results Found</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Try adjusting your filtration parameters or checking availability for a different intake.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredResults.map((uni, idx) => {
                const uniId = uni.id || `fallback_${idx}`;
                const isSelected = selectedUniIds.includes(uniId);
                const otherCols = getOtherColumns(uni);

                const uniName = uni["University Name"] || uni["university name"] || uni.name || "Unknown University";
                const programNameRaw = uni["Program Name "] || uni["program name"] || uni["Program name"] || uni.program || "";
                const programName = (programNameRaw && programNameRaw !== "N/A") ? programNameRaw : "";
                const location = (uni["Location"] || uni.location) ? (uni["Location"] || uni.location) : "Location N/A";
                const type = (uni["Type"] || uni.type) && (uni["Type"] || uni.type) !== "N/A" ? (uni["Type"] || uni.type) : "";
                const ranking = (uni["Ranking"] || uni.ranking) && (uni["Ranking"] || uni.ranking) !== "N/A" ? (uni["Ranking"] || uni.ranking) : "";
                const reqPercentage = uni["percentage"] || uni["Percentage"] || uni.percentage || "0";

                let displayPercentage = reqPercentage;
                if (reqPercentage && reqPercentage !== "0") {
                  const rawStr = String(reqPercentage).replace('%', '').trim();
                  const rawNum = parseFloat(rawStr);
                  if (!isNaN(rawNum)) {
                    displayPercentage = (rawNum < 1 ? Math.round(rawNum * 100) : rawNum).toString();
                  }
                }

                const levelRaw = uni["program level"] || uni["Program level"] || uni.level || "";
                const level = (levelRaw && levelRaw !== "N/A") ? levelRaw : "";
                const interestedFieldRaw = uni["Interested field"] || uni["interested field"] || uni.interestedField || "";
                const interestedField = (interestedFieldRaw && interestedFieldRaw !== "N/A") ? interestedFieldRaw : "";
                const subFieldRaw = uni["sub field"] || uni["Sub field"] || uni.subField || "";
                const subField = (subFieldRaw && subFieldRaw !== "N/A") ? subFieldRaw : "";

                return (
                  <div key={uniId} style={{
                    background: isSelected ? 'rgba(139, 92, 246, 0.05)' : 'var(--card-bg-solid)',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 8px 20px -8px rgba(139, 92, 246, 0.15)' : 'none'
                  }}
                    onClick={() => toggleSelection({ ...uni, id: uniId })}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ paddingTop: '4px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                            background: isSelected ? 'var(--accent-primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}>
                            {isSelected && <CheckSquare size={12} color="#fff" />}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
                            {programName || uniName}
                          </h4>
                          {programName && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Building size={13} />
                              <span>{uniName}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', flexWrap: 'wrap', marginTop: '6px' }}>
                            {location !== "Location N/A" && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {location}</span>}
                            {reqPercentage !== "0" && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}><GraduationCap size={12} /> Min. {displayPercentage}%</span>}
                            {type !== "" && <span style={{ background: 'var(--glass-highlight)', padding: '2px 8px', borderRadius: '4px' }}>{type}</span>}
                            {ranking !== "" && <span style={{ background: 'var(--glass-highlight)', padding: '2px 8px', borderRadius: '4px' }}>Rank: {ranking}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        {level && <span style={{ fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>{level}</span>}
                      </div>
                    </div>

                    {otherCols.length > 0 && (
                      <div style={{
                        marginTop: '4px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--table-header-bg)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '10px'
                      }}>
                        {otherCols.map(col => {
                          const isDateContext = col.toLowerCase().includes('deadline') || col.toLowerCase().includes('date');
                          return (
                            <div key={col} style={{
                              fontSize: '0.75rem',
                              background: isDateContext ? 'rgba(239, 68, 68, 0.03)' : 'var(--glass-bg)',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid var(--glass-border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px'
                            }}>
                              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: isDateContext ? '#ef4444' : 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {isDateContext && <CalendarClock size={10} />}
                                {col}
                              </span>
                              <span style={{ color: isDateContext ? '#ef4444' : 'var(--text-main)', fontWeight: 600 }}>
                                {formatDisplayValue(uni[col], isDateContext)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>

      {/* RIGHT SIDE: FILTER PANEL */}
      <div style={{
        width: '280px',
        flexShrink: 0,
        background: 'var(--card-bg-solid)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        overflowY: 'auto',
        boxShadow: 'var(--card-shadow)',
        scrollbarWidth: 'none'
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--glass-border)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            background: 'rgba(88, 166, 255, 0.15)',
            padding: '6px',
            borderRadius: '8px',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Filter size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>Search Settings</h3>
            <p style={{ margin: '1px 0 0 0', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>Refine course selection</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Level</label>
            <Select
              name="programLevel"
              isSearchable={false}
              value={searchParams.programLevel}
              onChange={(val) => handleSelectChange("programLevel", val)}
              options={levelOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Levels"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interested Field</label>
            <Select
              name="interestedField"
              isSearchable={false}
              value={searchParams.interestedField}
              onChange={(val) => handleSelectChange("interestedField", val)}
              options={interestedFieldOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Fields"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sub Field</label>
            <Select
              name="subField"
              isSearchable={false}
              value={searchParams.subField}
              onChange={(val) => handleSelectChange("subField", val)}
              options={subFieldOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Sub Fields"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Name</label>
            <Select
              name="programName"
              isSearchable={false}
              value={searchParams.programName}
              onChange={(val) => handleSelectChange("programName", val)}
              options={programNameOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="Program Title"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Intake</label>
            <Select
              name="intake"
              isSearchable={false}
              value={searchParams.intake}
              onChange={(val) => handleSelectChange("intake", val)}
              options={intakeOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="Select Intake"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, marginBottom: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score Percentage (%)</label>
            <input
              type="number"
              name="percentage"
              value={searchParams.percentage}
              onChange={handleTextChange}
              placeholder="e.g. 75"
              className="theme-input"
              style={{
                width: '100%',
                background: 'var(--input-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              const hasFilter =
                (searchParams.programLevel && searchParams.programLevel.value) ||
                (searchParams.interestedField && searchParams.interestedField.value) ||
                (searchParams.subField && searchParams.subField.value) ||
                (searchParams.programName && searchParams.programName.value) ||
                (searchParams.intake && searchParams.intake.value) ||
                (searchParams.percentage && String(searchParams.percentage).trim() !== '');

              if (hasFilter) {
                setHasSearched(true);
              } else {
                setError("Please fill at least one preference before executing search.");
                setTimeout(() => setError(null), 4000);
              }
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px var(--accent-glow)',
              transition: 'transform 0.2s active:scale-95'
            }}
          >
            <Search size={16} /> Find Courses
          </button>
        </div>
      </div>

      {/* FLOATING EXPORT TRIGGER (BOTTOM FLOATER) */}
      {!hideFooter && selectedUniIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: 'calc(50% - 150px)', /* Offset slightly towards left to account for right panel width visual center */
          transform: 'translateX(-50%)',
          background: 'rgba(9, 9, 14, 0.8)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          border: '1px solid var(--accent-primary)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          padding: '8px 12px 8px 20px',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1000,
          animation: 'slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
            {selectedUniIds.length} Item{selectedUniIds.length === 1 ? '' : 's'} Selected
          </span>
          <button
            onClick={() => setShowDownloadModal(true)}
            style={{
              background: 'var(--accent-primary)',
              border: 'none',
              color: '#fff',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}
          >
            <Download size={14} /> Export Selection
          </button>
        </div>
      )}

      {/* EXCEL EXPORT REVIEW MODAL */}
      {showDownloadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ background: 'var(--card-bg-solid)', padding: '0', borderRadius: '20px', border: '1px solid var(--glass-border)', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>Export Batch</h3>
              <button onClick={() => setShowDownloadModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {universitiesData.filter(u => selectedUniIds.includes(u.id)).map(uni => {
                  const uniName = uni["University Name"] || uni["university name"] || uni.name || "Unknown";
                  const prog = uni["Program Name "] || uni["program name"] || "";
                  return (
                    <div key={uni.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--input-bg)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prog || uniName}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{prog ? uniName : ''}</div>
                      </div>
                      <button onClick={() => toggleSelection(uni)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowDownloadModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}>Close</button>
              <button onClick={handleDownloadExcel} style={{ padding: '8px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px var(--accent-glow)' }}>Request Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProgram;
