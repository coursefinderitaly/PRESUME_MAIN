const fs = require('fs');
const path = 'src/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// We need to replace the entire `return (\n    <>\n      <div className="dash-universe">` to the end of the `Dashboard` component.
// We can use a regex to match from `return (\n    <>\n      <div className="dash-universe">` up to the final `</>\n  );\n};`

const startTag = 'return (\n    <>\n      <div className="dash-universe">';
const startIndex = content.indexOf(startTag);

if (startIndex === -1) {
  console.log("Could not find start tag");
  process.exit(1);
}

const newReturn = `return (
    <>
      <div className="dash-universe">
        <div className="dash-bg">
          <div className="dash-grid"></div>
          <div className="dash-particles"></div>
          <div className="dash-blob"></div>
        </div>

        <div className="dash-container" style={{ flexDirection: 'column', padding: 0 }}>
          {/* ================================== */}
          {/* HEADER NAVIGATION                  */}
          {/* ================================== */}
          <header style={{ 
            display: 'flex', flexDirection: 'column', 
            background: 'var(--card-bg-solid)', borderBottom: '1px solid var(--glass-border)',
            position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(36px) saturate(160%)', WebkitBackdropFilter: 'blur(36px) saturate(160%)'
          }}>
            {/* Top Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  style={{ height: '32px', objectFit: 'contain', filter: activeTheme === 'light' ? 'invert(1) hue-rotate(180deg) contrast(1.2)' : 'none' }}
                />
                <span className="portal-badge" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '100px' }}>
                  {isPartner ? 'Partner' : isCounselor ? 'Counselor' : isFreelancer ? 'Freelancer' : 'Student'} Portal
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', background: 'var(--table-header-bg)', padding: '5px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <button onClick={() => setTheme('light')} style={{ background: theme === 'light' ? 'var(--accent-primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Light Mode"><Sun size={14} /></button>
                  <button onClick={() => setTheme('dark')} style={{ background: theme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Dark Mode"><Moon size={14} /></button>
                  <button onClick={() => setTheme('system')} style={{ background: theme === 'system' ? 'var(--accent-primary)' : 'transparent', color: theme === 'system' ? '#fff' : 'var(--text-muted)', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="System Auto"><Monitor size={14} /></button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{profile.firstName} {profile.lastName || ''}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{isPartner ? profile.companyName || 'Partner' : isCounselor ? 'Counselor' : isFreelancer ? 'Freelancer' : 'Active Student'}</span>
                  </div>
                  <label htmlFor="sidebar-avatar-input" title="Change profile photo" style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0, cursor: 'pointer' }}>
                    <input id="sidebar-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
                    <div className="avatar" style={{ width: '38px', height: '38px', fontSize: '1rem', overflow: 'hidden', border: '2px solid rgba(167,139,250,0.4)', padding: 0, borderRadius: '10px' }}>
                      {profile.avatarUrl
                        ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 800, background: 'var(--accent-primary)', color: '#fff' }}>{profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'U'}</span>
                      }
                    </div>
                  </label>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            {/* Bottom Row - Navigation */}
            <nav style={{ display: 'flex', gap: '10px', padding: '10px 1.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
              <style>{\`nav::-webkit-scrollbar { display: none; }\`}</style>
              <NavButton id="home" icon={Home} label="Dashboard" />
              {isStudent && (
                <>
                  <NavButton id="course-finder" icon={Search} label="Course Finder" />
                  <NavButton id="applications" icon={FileText} label="Applications" />
                  <NavButton id="applied-universities" icon={CheckSquare} label="Applied Universities" />
                  <NavButton id="learning" icon={MonitorPlay} label="Learning Resource" />
                  <button
                    onClick={() => { setActiveTab('notifications'); setMessage({ text: '', type: '' }); setEditMode(false); setShowMsgAlert(false); setAlertDismissed(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: '1px solid transparent', background: activeTab === 'notifications' ? 'var(--accent-glow)' : 'transparent', color: activeTab === 'notifications' ? 'var(--accent-secondary)' : 'var(--text-muted)', fontWeight: activeTab === 'notifications' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', position: 'relative' }}
                  >
                    <Bell size={16} /> Notifications
                    {unreadMsgCount > 0 && (
                      <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, animation: 'pulse 2s infinite' }}>
                        {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                      </span>
                    )}
                  </button>
                  <NavButton id="profile" icon={User} label="Profile" />
                </>
              )}
              {isPartner && (
                <>
                  <NavButton id="register-student" icon={User} label="Register Student" />
                  <NavButton id="students-list" icon={Users} label="Students List" />
                  <NavButton id="course-finder" icon={Search} label="Search Program" />
                  <NavButton id="partner-applications" icon={FileText} label="Applications" />
                  <NavButton id="student-documents" icon={UploadCloud} label="Documents" />
                  <NavButton id="learning" icon={MonitorPlay} label="Resources" />
                  <NavButton id="notifications" icon={Bell} label="Notifications" />
                  <NavButton id="counselors" icon={Briefcase} label="Counselors" />
                  <NavButton id="profile" icon={User} label="Account" />
                </>
              )}
              {isCounselor && (
                <>
                  <NavButton id="register-student" icon={User} label="Register Student" />
                  <NavButton id="students-list" icon={Users} label="My Students" />
                  <NavButton id="course-finder" icon={Search} label="Search Program" />
                  <NavButton id="partner-applications" icon={FileText} label="Applications" />
                  <NavButton id="student-documents" icon={UploadCloud} label="Documents" />
                  <NavButton id="profile" icon={User} label="Account" />
                </>
              )}
              {isFreelancer && (
                <>
                  <NavButton id="register-student" icon={User} label="Register Student" />
                  <NavButton id="students-list" icon={Users} label="My Students" />
                  <NavButton id="course-finder" icon={Search} label="Search Program" />
                  <NavButton id="partner-applications" icon={FileText} label="Applications" />
                  <NavButton id="student-documents" icon={UploadCloud} label="Documents" />
                  <NavButton id="profile" icon={User} label="Account" />
                </>
              )}
            </nav>
          </header>

          {/* ================================== */}
          {/* MAIN CONTENT AREA                  */}
          {/* ================================== */}
          <main className="dash-main" data-lenis-prevent style={{ flex: 1, margin: '1.5rem', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* STUDENT GLOBAL PROGRESS TRACKER (COMPACT PILL) */}
            {isStudent && (() => {
              const fields = [
                'firstName', 'lastName', 'email', 'phone', 'dob', 'gender',
                'nationality', 'passportNo', 'issueDate', 'expiryDate',
                'mailingAddress1', 'mailingCity', 'mailingState', 'mailingPincode',
                'highestLevelOfEducation'
              ];
              
              let points = 0;
              fields.forEach(f => { if (profile?.[f]) points++; });
              
              if (profile?.documents?.length > 0) points++;
              if (profile?.appliedUniversities?.length > 0) points++;
              if (profile?.secondaryEducation) points++;
              if (profile?.graduation) points++;
              if (profile?.applicationStatus === 'submitted' || profile?.applicationStatus === 'approved') points++;

              const p = Math.round((points / 20) * 100);

              return (
                <div style={{ padding: '15px 1.5rem 0', animation: 'fadeUp 0.5s ease', zIndex: 10, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--card-bg-solid)', backdropFilter: 'blur(36px) saturate(180%)', WebkitBackdropFilter: 'blur(36px) saturate(180%)', border: '1px solid var(--glass-border)', borderRadius: '30px', padding: '12px 25px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.5px' }}><CheckSquare size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}/>App Progress</div>
                    <div style={{ flex: 1, position: 'relative', height: '6px', background: 'color-mix(in srgb, var(--glass-border) 60%, transparent)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, height: '100%', width: \`\${p}%\`, 
                        background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', 
                        borderRadius: '10px', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px var(--accent-primary)'
                      }}></div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>{p}%</div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'profile' && (
              <header className="dash-header">
                <div>
                  <h1>Profile Management</h1>
                  <p>Manage your account credentials and contact data.</p>
                </div>
                {!editMode ? (
                  <button className="btn-edit" onClick={() => setEditMode(true)}><Edit2 size={16} /> Edit Profile</button>
                ) : (
                  <button className="btn-cancel" onClick={() => { setEditMode(false); setFormData(profile); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage({ text: '', type: '' }); }}><X size={16} /> Cancel</button>
                )}
              </header>
            )}

            <div className="dash-content-area">
              {message.text && (
                <div className={\`dash-message \${message.type}\`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'home' && (
                <DashboardHome
                  profile={profile}
                  isPartner={isPartner}
                  setActiveTab={setActiveTab}
                  stats={stats}
                  fetchStats={fetchStats}
                  setPendingApplications={setPendingApplications}
                  unreadMsgCount={unreadMsgCount}
                />
              )}

              {activeTab === 'students-list' && (
                <StudentsList profile={profile} setMessage={setMessage} fetchStats={fetchStats} pendingApplications={pendingApplications} setPendingApplications={setPendingApplications} />
              )}
              {activeTab === 'register-student' && <RegisterStudent profile={profile} setMessage={setMessage} />}
              {activeTab === 'applications' && isStudent && (
                <StudentDetails student={profile} goBack={() => setActiveTab('home')} pendingApplications={pendingApplications} setPendingApplications={setPendingApplications} refreshProfile={fetchProfile} />
              )}
              {activeTab === 'applied-universities' && <AppliedUniversities profile={profile} />}
              {activeTab === 'partner-applications' && (isPartner || isCounselor || isFreelancer) && <PartnerApplications profile={profile} setMessage={setMessage} />}
              {activeTab === 'student-documents' && (isPartner || isCounselor || isFreelancer) && <StudentDocuments />}
              {activeTab === 'counselors' && <ManageCounselors setMessage={setMessage} />}
              {activeTab === 'notifications' && <Notifications profile={profile} />}
              {activeTab === 'learning' && <LearningResources />}
              {activeTab === 'course-finder' && (
                <SearchProgram preselectedUnis={pendingApplications} onProceed={(selected) => { setPendingApplications(selected); if (isPartner || isCounselor || isFreelancer) { setActiveTab('students-list'); } else { setActiveTab('applications'); } }} />
              )}

              {activeTab === 'profile' && (
                <>
                  {!editMode ? (
                    <div className="profile-page-wrap">
                    <div className="profile-grid">
                      <div className="profile-card full-width" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '20px', overflow: 'hidden', border: '3px solid rgba(167,139,250,0.5)', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(167,139,250,0.4)' }}>
                            {profile.avatarUrl
                              ? <img src={profile.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 800 }}>{(profile.firstName || 'U')[0].toUpperCase()}</span>
                            }
                          </div>
                          {avatarUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>Saving…</span></div>}
                        </div>
                        <div style={{ flex: 1, minWidth: '160px' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Profile Photo</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>JPG or PNG · Max 600KB · Saved to your account</div>
                          <label htmlFor="profile-avatar-input" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', color: '#fff', borderRadius: '10px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 700, cursor: avatarUploading ? 'not-allowed' : 'pointer', opacity: avatarUploading ? 0.6 : 1, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>
                            <Camera size={14} /> {profile.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                          </label>
                          <input id="profile-avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} disabled={avatarUploading} />
                        </div>
                      </div>

                      <div className="profile-card">
                        <h3>Core Identification</h3>
                        <div className="data-row"><span className="label">Full Name</span><span className="value">{profile.firstName} {profile.lastName || ''}</span></div>
                        <div className="data-row"><span className="label">Email Address</span><span className="value">{profile.email}</span></div>
                      </div>
                      <div className="profile-card">
                        <h3>Geospatial Data</h3>
                        <div className="data-row"><Globe size={16} className="data-icon" /><div><span className="label">Country</span><span className="value">{profile.country}</span></div></div>
                        <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">State / Region</span><span className="value">{profile.state}</span></div></div>
                        <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">City</span><span className="value">{profile.city}</span></div></div>
                      </div>
                      <div className={\`profile-card \${!isPartner ? 'full-width' : ''}\`}>
                        <h3>Contact Details</h3>
                        <div className="data-row"><Phone size={16} className="data-icon" /><div><span className="label">Phone</span><span className="value">{profile.phoneCode} {profile.phone}</span></div></div>
                        <div className="data-row"><Smartphone size={16} className="data-icon" /><div><span className="label">WhatsApp</span><span className="value">{profile.whatsapp ? \`\${profile.whatsappCode} \${profile.whatsapp}\` : 'Not Configured'}</span></div></div>
                      </div>

                      {isPartner && (
                        <div className="profile-card">
                          <h3>Business Details</h3>
                          <div className="data-row"><Building2 size={16} className="data-icon" /><div><span className="label">Company Name</span><span className="value">{profile.companyName || 'N/A'}</span></div></div>
                          <div className="data-row"><MapPin size={16} className="data-icon" /><div><span className="label">Company Address</span><span className="value">{profile.companyAddress || 'N/A'}</span></div></div>
                          <div className="data-row"><Users size={16} className="data-icon" /><div><span className="label">Team Size</span><span className="value">{profile.teamSize || 'N/A'}</span></div></div>
                          <div className="data-row"><Briefcase size={16} className="data-icon" /><div><span className="label">Designation</span><span className="value">{profile.designation || 'N/A'}</span></div></div>
                          <div className="data-row"><KeyRound size={16} className="data-icon" /><div><span className="label">Student Unique ID</span><span className="value">{profile.studentUniqueId || 'N/A'}</span></div></div>
                          <div className="data-row"><CheckSquare size={16} className="data-icon" /><div><span className="label">Prior Experience</span><span className="value">{profile.priorExperience ? 'Yes' : 'No'}</span></div></div>
                        </div>
                      )}
                    </div>
                    </div>
                  ) : (
                    <div className="profile-page-wrap">
                      <form onSubmit={handleUpdate} className="edit-form-grid">
                        <div className="profile-card full-width edit-card">
                          <div className="dash-input-group"><label>Email Address</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} className="dash-input" /></div>
                          <div className="dash-input-group"><label>Country</label><input type="text" name="country" value={formData.country || ''} onChange={handleChange} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>State</label><input type="text" name="state" value={formData.state || ''} onChange={handleChange} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>City</label><input type="text" name="city" value={formData.city || ''} onChange={handleChange} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>Phone Number *</label><input type="tel" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value.slice(0, 10) })} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>WhatsApp Number</label><input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.slice(0, 10) })} className="dash-input" /></div>
                          
                          {isPartner && (
                            <>
                              <div className="dash-input-group"><label>Company Name</label><input type="text" name="companyName" value={formData.companyName || ''} onChange={handleChange} required className="dash-input" /></div>
                              <div className="dash-input-group"><label>Company Address</label><input type="text" name="companyAddress" value={formData.companyAddress || ''} onChange={handleChange} required className="dash-input" /></div>
                              <div className="dash-input-group"><label>Team Size</label><input type="text" name="teamSize" value={formData.teamSize || ''} onChange={handleChange} required className="dash-input" /></div>
                              <div className="dash-input-group"><label>Designation</label><input type="text" name="designation" value={formData.designation || ''} onChange={handleChange} required className="dash-input" /></div>
                              <div className="input-group col-span-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', gridColumn: '1 / -1' }}>
                                <input type="checkbox" name="priorExperience" id="priorExperience" checked={formData.priorExperience || false} onChange={(e) => setFormData({ ...formData, priorExperience: e.target.checked })} style={{ width: 'auto', cursor: 'pointer' }} />
                                <label htmlFor="priorExperience" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}> Prior experience in study abroad?</label>
                              </div>
                            </>
                          )}
                          <div className="edit-actions"><button type="submit" className="btn-save"><Save size={16} /> Save Changes</button></div>
                        </div>
                      </form>
                      <form onSubmit={handlePasswordUpdate} className="edit-form-grid" style={{ marginTop: '20px' }}>
                        <div className="profile-card full-width edit-card">
                          <h3 style={{ gridColumn: '1 / -1', marginBottom: '15px' }}><KeyRound size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Security Settings</h3>
                          <div className="dash-input-group" style={{ gridColumn: '1 / -1' }}><label>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required className="dash-input" /></div>
                          <div className="dash-input-group"><label>New Password</label><input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="dash-input" /><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Must be 8+ chars, with upper, lower, number & special char.</span></div>
                          <div className="dash-input-group"><label>Confirm New Password</label><input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="dash-input" /></div>
                          <div className="edit-actions" style={{ gridColumn: '1 / -1', marginTop: '15px' }}><button type="submit" className="btn-save" style={{ background: '#ef4444' }}><Save size={16} /> Update Password</button></div>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>`;

// Then append floating elements which are present in the original right after closing `</div>` of `dash-container`.
const remainingContentIndex = content.indexOf('{/* FLOATING CHAT FAB - only for students */}', startIndex);
if (remainingContentIndex === -1) {
    console.log("Could not find FLOATING CHAT FAB string");
    process.exit(1);
}

const remainder = content.substring(remainingContentIndex);

const fullNewReturn = newReturn + '\n\n      ' + remainder;

const newFileContent = content.substring(0, startIndex) + fullNewReturn;

// Fix NavButton inside Dashboard.jsx to render horizontally properly.
// NavButton was defined inside Dashboard component before return.
const navBtnRegex = /const NavButton =.*?;\n  \};\n/s;
const newNavBtn = `const NavButton = ({ id, icon: Icon, label }) => {
    return (
      <button
        className={\`nav-item \${activeTab === id ? 'active' : ''}\`}
        onClick={() => { setActiveTab(id); setMessage({ text: '', type: '' }); setEditMode(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px',
          border: '1px solid transparent',
          background: activeTab === id ? 'var(--accent-glow)' : 'transparent',
          color: activeTab === id ? 'var(--accent-secondary)' : 'var(--text-muted)',
          fontWeight: activeTab === id ? 600 : 500,
          cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
        }}
      >
        <Icon size={16} />
        <span>{label}</span>
      </button>
    );
  };
`;

const finalFileContent = newFileContent.replace(navBtnRegex, newNavBtn);

fs.writeFileSync(path, finalFileContent, 'utf8');
console.log("Replaced Dashboard.jsx");
