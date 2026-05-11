const fs = require('fs');
const file = 'src/components/DashboardHome.jsx';
let content = fs.readFileSync(file, 'utf8');

// Compute points early
const computeLogic = `
  const isStudent = !isPartner && !isCounselor && !isFreelancer;
  const applied = (profile?.appliedUniversities || []).filter(u => u?.id).length;

  let progressPoints = 0;
  if (isStudent) {
    const fields = [
      'firstName', 'lastName', 'email', 'phone', 'dob', 'gender',
      'nationality', 'passportNo', 'issueDate', 'expiryDate',
      'mailingAddress1', 'mailingCity', 'mailingState', 'mailingPincode',
      'highestLevelOfEducation'
    ];
    fields.forEach(f => { if (profile?.[f]) progressPoints++; });
    if (profile?.documents?.length > 0) progressPoints++;
    if (profile?.appliedUniversities?.length > 0) progressPoints++;
    if (profile?.secondaryEducation) progressPoints++;
    if (profile?.graduation) progressPoints++;
    if (profile?.applicationStatus === 'submitted' || profile?.applicationStatus === 'approved') progressPoints++;
  }
  const appProgressPercentage = Math.min(100, Math.round((progressPoints / 20) * 100));
`;

content = content.replace(
  /  const isStudent = !isPartner && !isCounselor && !isFreelancer;\n  const applied = \(profile\?\.appliedUniversities \|\| \[\]\)\.filter\(u => u\?\.id\)\.length;/,
  computeLogic
);

// Replace Account Status with App Progress in Metrics Grid
const newMetricsStudent = `
          <>
            <MetricCard icon={BookOpen} label="Saved Courses" value={profile?.savedUniversitiesCart?.length || 0} color={COLORS.blue} />
            <MetricCard icon={Building2} label="Applied Unis" value={applied} color={COLORS.purple} onClick={() => setActiveTab('applied-universities')} />
            <MetricCard icon={CheckCircle2} label="Documents" value={profile?.documentZip ? 'Uploaded' : 'Pending'} color={COLORS.teal} onClick={() => setActiveTab('applications')} />
            
            {/* App Progress Small Rectangular Card */}
            <div style={{
              padding: '1.2rem', borderRadius: '16px', background: 'var(--card-bg-solid)',
              border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={14} color={COLORS.indigo} /> App Progress
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{appProgressPercentage}%</div>
              </div>
              <div style={{ height: '6px', background: 'var(--table-header-bg)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: \`\${appProgressPercentage}%\`, background: \`linear-gradient(90deg, \${COLORS.indigo}, \${COLORS.purple})\`, borderRadius: '10px' }} />
              </div>
            </div>
          </>
`;

content = content.replace(
  /<>\s*<MetricCard icon=\{BookOpen\}[^>]*\/>\s*<MetricCard icon=\{Building2\}[^>]*\/>\s*<MetricCard icon=\{CheckCircle2\}[^>]*\/>\s*<MetricCard icon=\{Shield\}[^>]*\/>\s*<\/>/m,
  newMetricsStudent
);

// Remove the old wide App Progress card
const oldWideProgressRegex = /\{\s*isStudent && \(\(\) => \{[\s\S]*?return \([\s\S]*?<div style=\{\{[\s\S]*?Application Progress[\s\S]*?<\/div>\s*\);\s*\}\)\(\)\s*\}/m;
content = content.replace(oldWideProgressRegex, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated DashboardHome.jsx");
