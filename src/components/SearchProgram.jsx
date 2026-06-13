import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Building, GraduationCap, ExternalLink, Filter, Database, Loader2, CalendarClock, Download, X, CheckSquare, FileSpreadsheet, ChevronUp, ChevronDown, Maximize2 } from 'lucide-react';
import Select, { components } from 'react-select';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

// Removed the direct Google Apps Script URL for security
// Data is now fetched natively through the backend proxy

import { API_BASE_URL } from '../config';

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} style={{ cursor: 'pointer', accentColor: '#fbbf24' }} />
        <label style={{ margin: 0, cursor: 'pointer' }}>{props.label}</label>
      </div>
    </components.Option>
  );
};

const CustomMultiValue = (props) => {
  if (props.index === 0) {
    return (
      <components.MultiValue {...props}>
        {props.children}
      </components.MultiValue>
    );
  }
  
  if (props.index === 1) {
    const totalSelected = props.getValue().length;
    return (
      <div style={{
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderRadius: '4px',
        margin: '2px',
        padding: '2px 6px',
        color: '#fbbf24',
        fontSize: '0.75rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center'
      }}>
        +{totalSelected - 1}
      </div>
    );
  }
  
  return null;
};

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

const getSelectedValues = (param) => {
  if (!param) return [];
  if (Array.isArray(param)) return param.map(p => p.value);
  return param.value ? [param.value] : [];
};

const SearchProgram = ({ onProceed, preselectedUnis = [], hideFooter = false, proceedLabel = "Proceed to Apply", onSelectionChange, onFilterChange, gridCols = 0, compactOnScroll = false }) => {
  const [searchParams, setSearchParams] = useState({
    country: null,
    programLevel: null,
    interestedField: null,
    subField: null,
    programName: null,
    intake: null,
    percentage: ''
  });
  const [universitySearchQuery, setUniversitySearchQuery] = useState('');

  const [appliedSearchParams, setAppliedSearchParams] = useState({
    programLevel: null,
    interestedField: null,
    subField: null,
    programName: null,
    intake: null,
    percentage: ''
  });
  const [appliedUniversitySearchQuery, setAppliedUniversitySearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(searchParams);
    }
  }, [searchParams, onFilterChange]);

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

  const checkDeadlineStatus = (val) => {
    if (!val || val === "N/A" || val === "n/a") return null;
    let date = null;
    if (typeof val === 'number' && val > 30000 && val < 60000) {
      date = new Date((val - 25569) * 86400 * 1000);
    } else if (typeof val === 'string') {
      const parsed = Date.parse(val);
      if (!isNaN(parsed) && val.length > 5) {
        date = new Date(parsed);
      }
    }
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today ? 'Open' : 'Closed';
    }
    return null;
  };

  const [universitiesData, setUniversitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUniIds, setSelectedUniIds] = useState(() => preselectedUnis.map(u => u.id));
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [expandedUniIds, setExpandedUniIds] = useState([]);
  const [popupUni, setPopupUni] = useState(null);
  const [isCompact, setIsCompact] = useState(false);

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

    const intFieldVals = getSelectedValues(searchParams.interestedField).map(v => v.toLowerCase());
    if (intFieldVals.length > 0 && !intFieldVals.includes('')) {
      filteredData = filteredData.filter(u => {
        const val = (getFieldValue(u, ['interestedfield']) || "").toLowerCase().trim();
        return intFieldVals.some(v => val.includes(v) || val === v);
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

    const intFieldVals = getSelectedValues(searchParams.interestedField).map(v => v.toLowerCase());
    if (intFieldVals.length > 0 && !intFieldVals.includes('')) {
      filteredData = filteredData.filter(u => {
        const val = (getFieldValue(u, ['interestedfield']) || "").toLowerCase().trim();
        return intFieldVals.some(v => val.includes(v) || val === v);
      });
    }

    const subFieldVals = getSelectedValues(searchParams.subField).map(v => v.toLowerCase());
    if (subFieldVals.length > 0 && !subFieldVals.includes('')) {
      filteredData = filteredData.filter(u => {
        const val = (getFieldValue(u, ['subfield']) || "").toLowerCase().trim();
        return subFieldVals.some(v => val.includes(v) || val === v);
      });
    }
    
    return [
      { value: '', label: 'Any Program' },
      ...extractUniqueOptions(filteredData, ['programname', 'program', 'name'])
    ];
  }, [universitiesData, searchParams.programLevel, searchParams.interestedField, searchParams.subField]);

  const intakeOptions = [
    { value: '2026', label: '2026 (September Intake)' },
    { value: '2027', label: '2027 (September Intake)' }
  ];

  const countryOptions = [
    { value: '', label: 'Any Country' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Canada', label: 'Canada' },
    { value: 'France', label: 'France' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'UK', label: 'UK' },
    { value: 'US', label: 'US' }
  ];

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      (searchParams.programLevel && searchParams.programLevel.value) ||
      (searchParams.interestedField && getSelectedValues(searchParams.interestedField).length > 0) ||
      (searchParams.subField && getSelectedValues(searchParams.subField).length > 0) ||
      (searchParams.programName && getSelectedValues(searchParams.programName).length > 0) ||
      (searchParams.intake && searchParams.intake.value) ||
      (searchParams.percentage && String(searchParams.percentage).trim() !== '')
    );
  }, [searchParams]);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'var(--input-bg)',
      borderColor: state.isFocused ? '#fbbf24' : 'var(--input-border)',
      color: 'var(--text-main)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(251, 191, 36, 0.15)' : 'none',
      cursor: 'pointer',
      minHeight: '36px',
      borderRadius: '8px',
      fontSize: '0.8rem',
      '&:hover': { borderColor: '#fbbf24' },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--card-bg-solid, #0f172a)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 100,
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'rgba(251, 191, 36, 0.15)'
        : state.isFocused ? 'rgba(251, 191, 36, 0.05)' : 'transparent',
      color: state.isSelected ? '#fbbf24' : 'var(--text-main)',
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: '0.85rem',
      fontWeight: state.isSelected ? 700 : 500,
      '&:hover': { backgroundColor: 'rgba(251, 191, 36, 0.08)' }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      borderRadius: '4px',
      margin: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#fbbf24',
      fontSize: '0.75rem',
      padding: '2px 4px',
      maxWidth: '80px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#fbbf24',
      ':hover': {
        backgroundColor: 'rgba(251, 191, 36, 0.3)',
        color: '#f59e0b',
      },
    }),
    singleValue: (base) => ({ ...base, color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500 }),
    valueContainer: (base) => ({ ...base, padding: '0 12px' }),
    input: (base) => ({ ...base, color: 'var(--text-main)', fontSize: '0.85rem' }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)', fontSize: '0.85rem' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? '#fbbf24' : 'var(--text-muted)',
      paddingRight: '12px',
      '&:hover': { color: '#fbbf24' }
    }),
  };

  useEffect(() => {
    if (hasSearched) {
      if (!searchParams.programLevel) {
        setHasSearched(false);
      } else {
        setAppliedSearchParams(searchParams);
        setAppliedUniversitySearchQuery(universitySearchQuery);
      }
    }
  }, [searchParams, universitySearchQuery, hasSearched]);

  const handleSelectChange = (name, selectedOption) => {
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
      }

      return updated;
    });
  };

  const handleTextChange = (e) => {
    setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    if (!searchParams.programLevel) {
      setError("Please select a Program Level to view results.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setAppliedSearchParams(searchParams);
    setAppliedUniversitySearchQuery(universitySearchQuery);
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchParams({
      programLevel: null,
      interestedField: null,
      subField: null,
      programName: null,
      intake: null,
      percentage: ''
    });
    setUniversitySearchQuery('');
    setAppliedSearchParams({
      programLevel: null,
      interestedField: null,
      subField: null,
      programName: null,
      intake: null,
      percentage: ''
    });
    setAppliedUniversitySearchQuery('');
    setHasSearched(false);
  };

  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];

    let filtered = universitiesData;

    // Filter by Program Level
    if (appliedSearchParams.programLevel && appliedSearchParams.programLevel.value) {
      const qLevel = appliedSearchParams.programLevel.value.toLowerCase();
      filtered = filtered.filter(u => {
        const uLevel = (getFieldValue(u, ['programlevel', 'level']) || "").toLowerCase();
        return uLevel.includes(qLevel);
      });
    }

    // Filter by Percentage
    if (appliedSearchParams.percentage) {
      const p = parseFloat(appliedSearchParams.percentage);
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
    const progVals = getSelectedValues(appliedSearchParams.programName).map(v => v.toLowerCase());
    if (progVals.length > 0 && !progVals.includes('')) {
      filtered = filtered.filter(u => {
        const uProg = (getFieldValue(u, ['programname', 'program', 'name']) || "").toLowerCase().trim();
        return progVals.some(val => uProg.includes(val) || uProg === val);
      });
    }

    // Filter by Interested Field
    const intFieldVals = getSelectedValues(appliedSearchParams.interestedField).map(v => v.toLowerCase());
    if (intFieldVals.length > 0 && !intFieldVals.includes('')) {
      filtered = filtered.filter(u => {
        const field = (getFieldValue(u, ['interestedfield']) || "").toLowerCase().trim();
        return intFieldVals.some(val => field.includes(val) || field === val);
      });
    }

    // Filter by Sub Field
    const subFieldVals = getSelectedValues(appliedSearchParams.subField).map(v => v.toLowerCase());
    if (subFieldVals.length > 0 && !subFieldVals.includes('')) {
      filtered = filtered.filter(u => {
        const field = (getFieldValue(u, ['subfield']) || "").toLowerCase().trim();
        return subFieldVals.some(val => field.includes(val) || field === val);
      });
    }

    // Filter by Intake (Currently disabled per request to show all results from Excel sheet regardless of intake)
    /*
    if (appliedSearchParams.intake && appliedSearchParams.intake.value) {
      const q = appliedSearchParams.intake.value.toLowerCase();
      filtered = filtered.filter(u => {
        const intakes = (getFieldValue(u, ['intakes', 'intake']) || "").toLowerCase();
        return intakes.includes(q);
      });
    }
    */

    // Filter by Specific University Name Search
    if (appliedUniversitySearchQuery) {
      const q = appliedUniversitySearchQuery.toLowerCase();
      filtered = filtered.filter(u => {
        const name = (getFieldValue(u, ['universityname', 'name']) || "").toLowerCase();
        return name.includes(q);
      });
    }

    return filtered;
  }, [universitiesData, appliedSearchParams, appliedUniversitySearchQuery, hasSearched]);

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
      flexDirection: 'column',
      gap: '16px',
      flex: 1,
      overflow: 'hidden',
      minHeight: 0,
      position: 'relative',
      animation: 'fadeUp 0.4s ease',
      paddingBottom: selectedUniIds.length > 0 && !hideFooter ? '60px' : '0',
      boxSizing: 'border-box'
    }}>

      <header className="dash-header" style={{ flexShrink: 0, borderBottom: 'none', padding: '0 0 6px 0', background: 'transparent', backdropFilter: 'none', overflow: 'hidden', height: isCompact ? '0px' : 'auto', opacity: isCompact ? 0 : 1, transition: 'all 0.3s ease', transform: isCompact ? 'translateY(-10px)' : 'translateY(0)' }}>
        <div style={{ paddingBottom: '6px' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Course Finder</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '1.05rem' }}>Discover optimal academic pathways tailored for you.</p>
        </div>
      </header>

      {/* TOP PANEL: SEARCH SETTINGS */}
      <div className="search-filters-container" style={{
        width: '100%',
        flexShrink: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: isCompact ? '6px 12px' : '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: 'var(--card-shadow)',
        zIndex: 10,
        transition: 'padding 0.3s ease'
      }}>
        <style>{`
          [data-theme="light"] .search-filters-container {
            background: rgba(0, 0, 0, 0.03) !important;
            border: 1px solid rgba(0, 0, 0, 0.08) !important;
          }
          [data-theme="light"] .search-filters-container label {
            color: #334155 !important;
            font-weight: 800 !important;
          }
          [data-theme="light"] .search-filters-container .react-select__control {
            background: rgba(255, 255, 255, 0.6) !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
          }
          [data-theme="light"] .search-filters-container .react-select__placeholder {
            color: #475569 !important;
            font-weight: 600 !important;
          }
          [data-theme="light"] .search-filters-container .react-select__single-value {
            color: #0f172a !important;
            font-weight: 700 !important;
          }
          [data-theme="light"] .search-filters-container input {
            color: #0f172a !important;
            font-weight: 600 !important;
          }
          [data-theme="light"] .search-filters-container input[type="text"] {
            background: rgba(255, 255, 255, 0.6) !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
          }
          [data-theme="light"] .search-filters-container input::placeholder {
            color: #475569 !important;
            font-weight: 600 !important;
          }
        `}</style>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? 'repeat(auto-fit, minmax(130px, 1fr))' : 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: isCompact ? '6px' : '10px',
          alignItems: 'flex-end',
          transition: 'gap 0.3s ease, grid-template-columns 0.3s ease'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Country</label>
            <Select classNamePrefix="react-select"
              name="country"
              value={searchParams.country}
              onChange={(val) => handleSelectChange("country", val)}
              options={countryOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Countries"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Intake</label>
            <Select classNamePrefix="react-select"
              name="intake"
              value={searchParams.intake}
              onChange={(val) => handleSelectChange("intake", val)}
              options={intakeOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="Select Intake"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program Level</label>
            <Select classNamePrefix="react-select"
              name="programLevel"
              value={searchParams.programLevel}
              onChange={(val) => handleSelectChange("programLevel", val)}
              options={levelOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Levels"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interested Field</label>
            <Select classNamePrefix="react-select"
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option: CheckboxOption, MultiValue: CustomMultiValue }}
              name="interestedField"
              value={searchParams.interestedField}
              onChange={(val) => handleSelectChange("interestedField", val)}
              options={interestedFieldOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Fields"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sub Field</label>
            <Select classNamePrefix="react-select"
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option: CheckboxOption, MultiValue: CustomMultiValue }}
              name="subField"
              value={searchParams.subField}
              onChange={(val) => handleSelectChange("subField", val)}
              options={subFieldOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="All Sub Fields"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program Name</label>
            <Select classNamePrefix="react-select"
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option: CheckboxOption, MultiValue: CustomMultiValue }}
              name="programName"
              value={searchParams.programName}
              onChange={(val) => handleSelectChange("programName", val)}
              options={programNameOptions}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              placeholder="Program Title"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Score (%)</label>
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
                fontSize: '0.8rem',
                boxSizing: 'border-box',
                height: '36px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', height: '36px' }}>
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0 12px',
                height: '100%',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Search size={14} /> Search
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                  height: '100%',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Clear
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CANVAS: SEARCH RESULTS */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, height: '100%' }}>

        {error && (
          <div style={{ flexShrink: 0, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '1.05rem' }}>
            {error}
          </div>
        )}

        {/* Result Scroll Context */}
        <div
          onScroll={(e) => {
            if (!compactOnScroll) return;
            if (e.target.scrollTop > 30) {
              if (!isCompact) setIsCompact(true);
            } else {
              if (isCompact) setIsCompact(false);
            }
          }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflowY: 'auto',
            paddingRight: '4px',
            paddingBottom: '20px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
          }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Search Results</h3>
              {!isLoading && (
                <div style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  {filteredResults.length} Found
                </div>
              )}
            </div>

            {!isLoading && filteredResults.length > 0 && !hideFooter && (
              <button
                onClick={handleSelectAllFiltered}
                style={{
                  background: 'var(--glass-bg)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--glass-border)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
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
            <div className="empty-state" style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', background: 'var(--card-bg-solid)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#fbbf24', borderRightColor: '#d97706', animation: 'spin 1.5s linear infinite' }}></div>
                <Database size={28} style={{ color: '#fbbf24' }} />
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.05rem' }}>Querying University Database...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div style={{ padding: '60px 20px', color: 'var(--text-muted)', textAlign: 'center', background: 'rgba(251, 191, 36, 0.02)', borderRadius: '20px', border: '1px dashed rgba(251, 191, 36, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Search size={36} style={{ color: '#fbbf24', marginBottom: '8px', opacity: 0.8 }} />
              <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 800 }}>Search Your University</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.5' }}>Select your desired filters above and click the <strong>Search Programs</strong> button to retrieve matching courses.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: gridCols ? `repeat(${gridCols}, minmax(0, 1fr))` : 'repeat(auto-fill, minmax(330px, 1fr))', gap: '10px' }}>
              {filteredResults.map((uni, idx) => {
                const uniId = uni.id || `fallback_${idx}`;
                const isSelected = selectedUniIds.includes(uniId);
                const isExpanded = expandedUniIds.includes(uniId);
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
                    background: isSelected ? 'rgba(251, 191, 36, 0.04)' : (idx % 2 === 0 ? 'var(--card-bg-solid)' : 'var(--glass-bg)'),
                    border: isSelected ? '1px solid #fbbf24' : '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px -4px rgba(251, 191, 36, 0.2)' : 'none'
                  }}
                    onClick={() => toggleSelection({ ...uni, id: uniId })}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
                        <div style={{ paddingTop: '2px' }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            border: `2px solid ${isSelected ? '#fbbf24' : 'var(--glass-border)'}`,
                            background: isSelected ? '#fbbf24' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}>
                            {isSelected && <CheckSquare size={10} color="#0f172a" />}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
                          <h4 className={!programName ? "uni-name-text" : ""} style={{ margin: 0, color: programName ? 'var(--text-main)' : '#f97316', fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.25, letterSpacing: '0.1px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {programName || uniName}
                          </h4>
                          {programName && (
                            <div className="uni-name-text" style={{ fontSize: '0.9rem', color: '#f97316', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
                              <Building size={13} />
                              <span>{uniName}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', flexWrap: 'wrap', marginTop: '2px' }}>
                            {location !== "Location N/A" && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {location}</span>}
                            {reqPercentage !== "0" && <span className="min-perc-text" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontWeight: 700 }}><GraduationCap size={11} /> Min. {displayPercentage}%</span>}
                            {type !== "" && <span style={{ background: 'var(--glass-highlight)', padding: '1px 4px', borderRadius: '3px' }}>{type}</span>}
                            {ranking !== "" && <span style={{ background: 'var(--glass-highlight)', padding: '1px 4px', borderRadius: '3px' }}>Rank: {ranking}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        {level && <span style={{ fontSize: '0.75rem', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, border: '1px solid rgba(251,191,36,0.15)' }}>{level}</span>}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPopupUni(uni);
                          }}
                          style={{
                            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '6px', transition: 'all 0.2s', marginTop: 'auto'
                          }}
                          onMouseOver={e => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--card-bg-solid)'; }}
                          onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--glass-bg)'; }}
                          title="Open Details Popup"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    </div>

                    {otherCols.length > 0 && (
                      <div style={{ marginTop: '6px', borderTop: '1px dashed var(--glass-border)', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedUniIds(prev =>
                                prev.includes(uniId) ? prev.filter(id => id !== uniId) : [...prev, uniId]
                              );
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '100px',
                              transition: 'all 0.2s',
                              fontWeight: 700
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = 'var(--text-main)';
                              e.currentTarget.style.background = 'var(--glass-bg)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = 'var(--text-muted)';
                              e.currentTarget.style.background = 'none';
                            }}
                          >
                            {isExpanded ? 'Hide Details' : 'Show Details'} {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid var(--glass-border)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                            gap: '6px',
                            animation: 'fadeIn 0.2s ease'
                          }}>
                            {otherCols.map(col => {
                              const isDateContext = col.toLowerCase().includes('deadline') || col.toLowerCase().includes('date');
                              const status = isDateContext ? checkDeadlineStatus(uni[col]) : null;
                              return (
                                <div key={col} style={{
                                  fontSize: '0.95rem',
                                  background: isDateContext ? 'rgba(239, 68, 68, 0.03)' : 'var(--glass-bg)',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--glass-border)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '2px'
                                }}>
                                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: isDateContext ? '#ef4444' : 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      {isDateContext && <CalendarClock size={10} />}
                                      {col}
                                    </span>
                                    {status && (
                                      <span style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: '4px', background: status === 'Open' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: status === 'Open' ? '#22c55e' : '#ef4444' }}>
                                        {status}
                                      </span>
                                    )}
                                  </span>
                                  <span style={{ color: isDateContext ? '#ef4444' : 'var(--text-main)', fontWeight: 800, fontSize: '1rem' }}>
                                    {formatDisplayValue(uni[col], isDateContext)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            [data-theme="light"] .deadline-text { color: #b91c1c !important; }
            [data-theme="light"] .uni-name-text { color: #b91c1c !important; }
            [data-theme="light"] .min-perc-text { color: #92400e !important; border-color: rgba(146, 64, 14, 0.2) !important; background: rgba(146, 64, 14, 0.05) !important; }
            [data-theme="light"] .popup-label-text { color: var(--text-main) !important; font-weight: 800 !important; }
          `}</style>
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
      {showDownloadModal && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
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
        </div>,
        document.body
      )}

      {/* UNI DETAILS POPUP MODAL */}
      {createPortal(
        <AnimatePresence>
          {popupUni && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
              onClick={() => setPopupUni(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                style={{ background: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--glass-border)', maxWidth: '450px', width: '100%', maxHeight: '75vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden' }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-secondary)' }}>
                  <div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>
                      {popupUni["Program Name "] || popupUni["program name"] || popupUni["Program name"] || popupUni.program || popupUni["University Name"] || popupUni.name || "University Details"}
                    </h2>
                    <div className="uni-name-text" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f97316', fontSize: '0.9rem', fontWeight: 700 }}>
                      <Building size={14} />
                      <span>{popupUni["University Name"] || popupUni["university name"] || popupUni.name || ""}</span>
                    </div>
                  </div>
                  <button onClick={() => setPopupUni(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}><X size={14} /></button>
                </div>

                <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(() => {
                      const loc = popupUni["Location"] || popupUni.location;
                      const percRaw = popupUni["percentage"] || popupUni["Percentage"] || popupUni.percentage;
                      let displayPerc = percRaw;
                      if (percRaw && percRaw !== "0") {
                        const rawStr = String(percRaw).replace('%', '').trim();
                        const rawNum = parseFloat(rawStr);
                        if (!isNaN(rawNum)) {
                          displayPerc = (rawNum < 1 ? Math.round(rawNum * 100) : rawNum).toString();
                        }
                      }
                      const type = popupUni["Type"] || popupUni.type;
                      const lvl = popupUni["program level"] || popupUni["Program level"] || popupUni.level;
                      return (
                        <>
                          {loc && loc !== "N/A" && <span style={{ background: 'var(--glass-highlight)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {loc}</span>}
                          {displayPerc && displayPerc !== "0" && <span className="min-perc-text" style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={14} /> Min. {displayPerc}%</span>}
                          {type && type !== "N/A" && <span style={{ background: 'var(--glass-highlight)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{type}</span>}
                          {lvl && lvl !== "N/A" && <span style={{ background: 'var(--glass-highlight)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{lvl}</span>}
                        </>
                      );
                    })()}
                  </div>

                  <h3 style={{ margin: '10px 0 0 0', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Detailed Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                    {getOtherColumns(popupUni).map(col => {
                      const isDate = col.toLowerCase().includes('deadline') || col.toLowerCase().includes('date');
                      const status = isDate ? checkDeadlineStatus(popupUni[col]) : null;
                      return (
                        <div key={col} style={{ background: isDate ? 'rgba(239, 68, 68, 0.05)' : 'var(--input-bg)', padding: '10px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                          <div className={isDate ? "deadline-text popup-label-text" : "popup-label-text"} style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: isDate ? '#ef4444' : 'var(--text-muted)', fontWeight: 700, marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {col}
                            {status && (
                              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: status === 'Open' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: status === 'Open' ? '#22c55e' : '#ef4444' }}>
                                {status}
                              </span>
                            )}
                          </div>
                          <div className={isDate ? "deadline-text" : ""} style={{ color: isDate ? '#ef4444' : 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{formatDisplayValue(popupUni[col], isDate)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default SearchProgram;
