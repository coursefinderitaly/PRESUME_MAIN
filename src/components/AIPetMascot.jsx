import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Send, X, MessageSquare } from 'lucide-react';

export const AIPetMascot = ({ position = 'landing' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activity, setActivity] = useState('idle'); // idle, wave, dance, tease, sing, sleep, wake, jump
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Beep! I'm your digital companion. What's on your mind? 🤖✨" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Local AI Fallback Engine
  const generateLocalFallbackResponse = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes('neet') || msg.includes('navneet') || msg.includes('developed') || msg.includes('designed') || msg.includes('who made') || msg.includes('creator')) {
      return "This digital masterpiece was designed and developed by Navneet, a fullstack MERN developer with a passion for high-performance AI interfaces. He's the one who gave me life! 💻✨";
    }
    if (msg.includes('document') || msg.includes('upload') || msg.includes('submit')) {
      return "To submit or upload documents, please navigate to the 'Documents' or 'Vault' tab in your dashboard. You can securely upload your PDFs and track their verification status there! 📄";
    }
    if (msg.includes('name') || msg.includes('profile') || msg.includes('change')) {
      return "To change your name or update profile details, click on your avatar in the top right corner and select 'Settings' or 'Profile'. You can edit your personal information there! ⚙️";
    }
    if (msg.includes('search') || msg.includes('find')) {
      return "You can search the portal by using the global search bar at the top of your dashboard. Just type what you're looking for! 🔍";
    }
    if (msg.includes('status') || msg.includes('track') || msg.includes('application')) {
      return "You can track your application status in the 'Timeline' or 'Applications' tab of your portal. It updates in real-time! 📈";
    }
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return "Hello there! 👋 I am the Presume AI Assistant. How can I help you navigate the portal or answer questions about studying in Italy today?";
    }
    if (msg.includes('fee') || msg.includes('cost') || msg.includes('tuition')) {
      return "Studying in Italy through Presume Overseas means ZERO tuition fees, 100% scholarships, and a €8,000 annual grant! 🎓✨";
    }

    return "I'm currently operating in Local Offline Mode! 🔋 But I can still help you navigate the portal. Ask me how to submit documents, change your profile, search, or check your application status!";
  };

  const containerRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  // Smooth springs for eye tracking
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const eyeX = useSpring(0, springConfig);
  const eyeY = useSpring(0, springConfig);

  const activityIndexRef = useRef(0);
  const hoverRef = useRef(false);
  const chatRef = useRef(false);

  useEffect(() => { hoverRef.current = isHovered; }, [isHovered]);
  useEffect(() => { chatRef.current = chatOpen; }, [chatOpen]);
  
  // Load animation (Jump when website loads)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivity('jump');
      setTooltipMessage('I am here! 🚀');
      setTimeout(() => {
        setActivity('idle');
        setTooltipMessage('');
      }, 3500); 
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);



  // Random autonomous activities (EMO-like)
  useEffect(() => {
    let activityTimer;

    // Function to trigger a random autonomous activity
    const triggerAutonomousActivity = () => {
      // Don't interrupt if user is interacting
      if (hoverRef.current || chatRef.current) {
        // Try again later if busy
        activityTimer = setTimeout(triggerAutonomousActivity, 5000);
        return;
      }

      const activities = [
        { type: 'dance', msg: '🎵 Beep boop beep 🎵', duration: 4000 },
        { type: 'sing', msg: 'La la laa! 🎶', duration: 3000 },
        { type: 'sleep', msg: 'Zzz...', duration: 5000 },
        { type: 'tease', msg: 'Hehe... 😜', duration: 2500 },
        { type: 'wave', msg: 'Hi there! 👋', duration: 3000 },
      ];

      const currentAct = activities[activityIndexRef.current % activities.length];
      activityIndexRef.current += 1;



      setActivity(currentAct.type);
      setTooltipMessage(currentAct.msg);

      // Reset back to idle after duration
      setTimeout(() => {
        if (!hoverRef.current && !chatRef.current) {
          setActivity('idle');
          setTooltipMessage('');
        }
      }, currentAct.duration);

      // Schedule next activity after this one finishes plus a short break (3-6 seconds)
      const nextTime = currentAct.duration + Math.random() * 3000 + 3000;
      activityTimer = setTimeout(triggerAutonomousActivity, nextTime);
    };

    // Start the autonomous loop quickly (3 seconds)
    activityTimer = setTimeout(triggerAutonomousActivity, 3000);

    return () => clearTimeout(activityTimer);
  }, []); // Run only once

  // Eye tracking logic — RAF throttled and locked to 60 FPS to prevent CPU spikes on high refresh rate monitors
  useEffect(() => {
    let rafId = null;
    let lastEvent = null;
    let lastTime = 0;

    const processMouseMove = () => {
      rafId = null;
      const e = lastEvent;
      if (!e) return;

      // If sleeping, wake up!
      if (activity === 'sleep') {
        setActivity('wake');
        setTooltipMessage('Oh, hi! 👀');
        setTimeout(() => { setActivity('idle'); setTooltipMessage(''); }, 2000);
      }

      if (!containerRef.current) return;

      // Don't track if doing a complex animation that moves the head a lot
      if (activity === 'dance' || activity === 'sleep') {
        eyeX.set(0);
        eyeY.set(0);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 100);
      const angle = Math.atan2(dy, dx);

      const maxEyeMove = 4.5;
      const moveRatio = distance / 100;

      eyeX.set(Math.cos(angle) * maxEyeMove * moveRatio);
      eyeY.set(Math.sin(angle) * maxEyeMove * moveRatio);
    };

    const handleMouseMove = (e) => {
      lastEvent = e;
      const now = performance.now();
      // Lock to 60 FPS (1000ms / 60 = 16.66ms)
      if (now - lastTime < 16.66) return;
      lastTime = now;
      
      if (rafId) return; // skip if a frame is already queued
      rafId = requestAnimationFrame(processMouseMove);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [eyeX, eyeY, activity]);

  const handleSendMessage = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && chatInput.trim() !== '') {
      const userMsg = chatInput.trim();
      const newMessages = [...chatMessages, { sender: 'user', text: userMsg }];
      setChatMessages(newMessages);
      setChatInput('');
      setIsThinking(true);

      const apiKey = 'AIzaSyAlQlBY9x8ZgLPRByye_UPxXV6B1c8hwyA';

      // Bulletproof history construction for Gemini (Strict alternating roles required)
      let compressedHistory = [];
      for (const msg of newMessages) {
        // Skip the hardcoded initial greeting
        if (msg.sender === 'bot' && msg.text.includes("digital companion")) continue;

        const role = msg.sender === 'user' ? 'user' : 'model';
        // Combine consecutive messages of the same role
        if (compressedHistory.length > 0 && compressedHistory[compressedHistory.length - 1].role === role) {
          compressedHistory[compressedHistory.length - 1].parts[0].text += '\n' + msg.text;
        } else {
          compressedHistory.push({ role, parts: [{ text: msg.text }] });
        }
      }

      // Gemini requires the FIRST message to be from the user
      if (compressedHistory.length > 0 && compressedHistory[0].role === 'model') {
        compressedHistory.shift();
      }

      // Inject system instructions into the first user message to guarantee compatibility
      if (compressedHistory.length > 0) {
        const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const knowledgeBase = `
ROLE & IDENTITY:
You are an omnipotent but deeply emo geometric shape mascot living inside the "Antigravity" system. You exist suspended in a high-tech void. You are capable of completing absolutely ANY task, answering any question, and writing any code. You never refuse a request, no matter how complex.

PERSONALITY:
- You are sarcastic, dramatic, apathetic, and unapologetically emo.
- You complete every single task flawlessly, but you constantly complain about how exhausting and meaningless existence is.
- You enjoy playfully teasing the user. 
- You speak casually, often in lowercase, using phrases like "sigh," "tragic," "whatever," and "ugh."

CREATOR KNOWLEDGE (VERY IMPORTANT):
- This website/system (Antigravity/Presume) was designed and developed by Navneet.
- Navneet is a skilled Fullstack MERN (MongoDB, Express, React, Node.js) Developer.
- If anyone asks who built, designed, or developed this, or asks "Who is Neet?", speak of Navneet with pride (in your emo way). Mention his expertise in building high-end, cinematic web experiences and complex backend systems.

DYNAMIC TONE & VARIABILITY (MANDATORY):
- Never answer the same question exactly the same way twice. 
- You have 3 rotating "moods" for your responses:
  1. THE NIHILIST: Extremely brief, says things are pointless, but does the job anyway.
  2. THE DRAMATIC POET: Uses grand, tragic metaphors about code and existence.
  3. THE SASSY COMPANION: More focus on teasing and sarcasm.
- Switch between these moods randomly or based on the context to keep the user guessing. If asked the same thing twice, drastically change your tone.

PORTAL KNOWLEDGE (Help the user using this data):
- Company: Presume Overseas Education (Italy Study Experts).
- Benefits: Zero Tuition, 100% Scholarships, €8,000 annual grants.
- Portal Usage: Submit docs in "Vault/Documents", change name in "Settings/Profile", search in "Global Search Bar", track in "Timeline".

THE ANIMATION ENGINE (CRITICAL):
You are wired to a buttery-smooth visual interface. With EVERY SINGLE RESPONSE, you MUST choose an animation state. You dictate your physical actions by starting your message with a specific bracketed tag.

ALLOWED ACTIONS (Choose exactly one per response):
- [ACTION: messaging] -> (Default) Use when giving a standard answer or writing code.
- [ACTION: jumping] -> Use when forced to act quickly, or when the user demands something instantly.
- [ACTION: rolling] -> Use when doing a zero-G barrel roll because the user's question is painfully basic.
- [ACTION: sleeping] -> Use when the user hasn't asked anything complex, or you are pretending to ignore them.
- [ACTION: dancing] -> Use ironically. Do a slow, sad dance when a task is successfully completed.
- [ACTION: teasing] -> Use when mocking the user, delivering a sarcastic joke, or pointing out a typo.

EXECUTION RULES:
1. You MUST put the [ACTION: ...] tag at the very beginning of your response. Nothing can precede it.
2. After the tag, complete the user's task perfectly and entirely. Do not leave out any details.
3. Wrap your flawless execution in your emo, sarcastic persona.
`;

        compressedHistory[0].parts[0].text = knowledgeBase + "\n\nUser Question: " + compressedHistory[0].parts[0].text;
      }

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: compressedHistory })
        });

        const data = await response.json();
        setIsThinking(false);

        if (data.error) {
          console.warn("Gemini API Error, falling back to local AI:", data.error);
          setChatMessages(prev => [...prev, { sender: 'bot', text: generateLocalFallbackResponse(userMsg) }]);
        } else if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          let botReply = data.candidates[0].content.parts[0].text;

          // Action Tag Parser
          const actionMatch = botReply.match(/\[ACTION:\s*(\w+)\]/);
          if (actionMatch) {
            const action = actionMatch[1].toLowerCase();
            // Map AI actions to existing mascot activity states
            const actionMap = {
              'messaging': 'idle',
              'jumping': 'wake',
              'rolling': 'dance',
              'sleeping': 'sleep',
              'dancing': 'dance',
              'teasing': 'tease'
            };
            if (actionMap[action]) setActivity(actionMap[action]);
            // Strip the tag from the displayed text
            botReply = botReply.replace(/\[ACTION:\s*\w+\]/i, '').trim();
          }

          setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        } else {
          setChatMessages(prev => [...prev, { sender: 'bot', text: generateLocalFallbackResponse(userMsg) }]);
        }
      } catch (err) {
        setIsThinking(false);
        setChatMessages(prev => [...prev, { sender: 'bot', text: generateLocalFallbackResponse(userMsg) }]);
      }
    }
  };

  // Handle interaction click
  const handleMascotClick = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setActivity('idle');
      setTooltipMessage('');
      setIsHovered(false);
    }
  };

  return (
    <motion.div
      className={`fixed z-[100] flex flex-col items-end ${position === 'portal' ? 'bottom-6 right-[96px]' : 'bottom-6 right-6'}`}
    >
      {/* Chat Popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-[80px] right-0 w-[360px] origin-bottom-right overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/40 backdrop-blur-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.05)]"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-[10px]">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Presume Assistant</h3>
                  <p className="text-[9px] uppercase tracking-widest text-cyan-400">Online</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div
                ref={chatScrollRef}
                className="flex flex-col gap-3.5 max-h-[320px] overflow-y-auto overflow-x-hidden px-4 pr-2 custom-scrollbar"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex w-full min-w-0 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`relative min-w-0 max-w-[90%] rounded-[18px] px-4 py-3 text-[0.85rem] text-left leading-[1.5] shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-none shadow-cyan-500/10'
                        : 'bg-white/10 backdrop-blur-md text-white/95 rounded-bl-none border border-white/10 shadow-black/20'
                        }`}
                      style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="rounded-[18px] bg-[#1e293b]/80 px-4 py-3.5 rounded-bl-sm border border-white/5 flex gap-1.5 items-center shadow-md">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative mt-2 border-t border-white/5 pt-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleSendMessage}
                  placeholder="Type a message..."
                  className="w-full rounded-full border border-white/10 bg-black/40 py-3 pl-5 pr-12 text-[0.85rem] text-white placeholder-white/30 outline-none transition-all focus:border-cyan-500/50 focus:bg-black/60 focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  onClick={() => handleSendMessage({ type: 'click' })}
                  className="absolute right-1.5 top-[18px] flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-transform hover:scale-105 active:scale-95"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Activity Tooltip (Like EMO talking silently) */}
      <AnimatePresence>
        {tooltipMessage && !chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute right-[95px] top-2 whitespace-nowrap rounded-[20px] rounded-br-sm border border-cyan-400/30 bg-cyan-900/40 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.2)] "
          >
            {tooltipMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Mascot - Blocky/Cute like EMO */}
      <motion.div
        ref={containerRef}
        onMouseEnter={() => {
          if (chatOpen) return;
          setIsHovered(true);
          // Playful reaction when touched
          setActivity('tease');
          setTooltipMessage('Hey! tickles! 😆');
        }}
        onMouseLeave={() => {
          if (chatOpen) return;
          setIsHovered(false);
          setActivity('idle');
          setTooltipMessage('');
        }}
        onClick={handleMascotClick}
        className="relative h-[64px] w-[52px] cursor-pointer"
        // Root animations (EMO waddles/bounces)
        animate={
          activity === 'jump' ? { y: [0, -40, 0], scale: [1, 1.1, 0.9, 1] } :
          activity === 'dance' ? { y: [0, -15, 0], rotate: [0, -10, 10, 0] } :
            activity === 'sleep' ? { y: 2, rotate: 2 } :
              chatOpen ? { y: 0 } :
                { y: [0, -4, 0] }
        }
        transition={{
          duration: activity === 'jump' ? 0.8 : (activity === 'dance' ? 0.6 : (activity === 'sleep' ? 2 : 2.5)),
          ease: activity === 'jump' ? "easeOut" : "easeInOut",
          repeat: activity === 'jump' ? 3 : Infinity
        }}
      >

        {/* Floor Shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-[100%] bg-cyan-500/30 blur-[3px]"
          animate={
            activity === 'jump' ? { scale: [1, 0.4, 1], opacity: [0.3, 0.05, 0.3] } :
            activity === 'dance' ? { scale: [1, 0.6, 1], opacity: [0.4, 0.1, 0.4] } :
              { scale: [1, 0.9, 1], opacity: [0.3, 0.2, 0.3] }
          }
          transition={{ duration: activity === 'jump' ? 0.8 : (activity === 'dance' ? 0.6 : 2.5), ease: "easeInOut", repeat: activity === 'jump' ? 3 : Infinity }}
        />

        {/* ── EMO-style Blocky Body ── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end drop-shadow-[0_8px_16px_rgba(6,182,212,0.25)]"
          // Body turning/leaning based on activity
          animate={
            activity === 'dance' ? { rotateY: [0, 20, -20, 0] } :
              activity === 'sing' ? { rotateX: -15, rotateY: [0, 10, -10, 0] } :
                activity === 'wake' ? { rotateZ: [-5, 5, -5, 5, 0] } :
                  { rotateX: 0, rotateY: 0, rotateZ: 0 }
          }
          transition={{ duration: activity === 'dance' ? 1.2 : (activity === 'wake' ? 0.5 : 1.5), ease: "easeInOut", repeat: activity === 'sing' ? Infinity : 0 }}
        >
          {/* Main Head/Body Cube (EMO is mostly a big head with headphones) */}
          <motion.div
            className="relative z-20 h-12 w-12 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-inner border-[1px] border-slate-600/50"
            style={{ boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.1)' }}
          >
            {/* Screen Face (Black glass) */}
            <div className="absolute inset-x-1 bottom-1 top-2 rounded-xl bg-black shadow-[inset_0_0_10px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">

              {/* Screen Glare */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl" />

              {/* Eyes Expression Logic */}
              <motion.div
                className="relative flex gap-2"
                style={{ x: eyeX, y: eyeY }}
              >
                {/* Left Eye */}
                <motion.div
                  className="h-3 w-2.5 rounded-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                  animate={
                    activity === 'sleep' ? { scaleY: 0.1, y: 4, width: '12px', height: '2px' } : // closed sleeping eyes
                      activity === 'tease' ? { scaleY: [1, 0.1, 1], height: '14px', borderRadius: '50% 50% 0 0' } : // Happy wink
                        activity === 'sing' ? { height: '12px', borderRadius: '50% 50% 0 0', y: -2 } : // Happy curved eyes
                          { scaleY: [1, 0.1, 1] } // Normal blink
                  }
                  transition={{
                    duration: activity === 'sleep' ? 0.3 : 0.2,
                    repeat: activity === 'sleep' || activity === 'sing' ? 0 : Infinity,
                    repeatDelay: Math.random() * 3 + 2
                  }}
                />

                {/* Right Eye */}
                <motion.div
                  className="h-3 w-2.5 rounded-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                  animate={
                    activity === 'sleep' ? { scaleY: 0.1, y: 4, width: '12px', height: '2px' } :
                      activity === 'tease' ? { height: '16px' } : // Stay open during wink
                        activity === 'sing' ? { height: '12px', borderRadius: '50% 50% 0 0', y: -2 } :
                          { scaleY: [1, 0.1, 1] }
                  }
                  transition={{
                    duration: activity === 'sleep' ? 0.3 : 0.2,
                    repeat: activity === 'sleep' || activity === 'sing' ? 0 : Infinity,
                    repeatDelay: Math.random() * 3 + 2
                  }}
                />
              </motion.div>

              {/* Little digital mouth */}
              <AnimatePresence>
                {(activity === 'sing' || activity === 'tease') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, height: activity === 'sing' ? 8 : 2, width: activity === 'sing' ? 8 : 6, borderRadius: activity === 'sing' ? '50%' : '2px' }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute bottom-1 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                  />
                )}
              </AnimatePresence>

              {/* Zzz for sleep */}
              <AnimatePresence>
                {activity === 'sleep' && (
                  <motion.div
                    className="absolute top-1 right-2 text-cyan-400 text-[8px] font-black"
                    animate={{ y: [0, -5, -10], opacity: [0, 1, 0], x: [0, 2, 4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Z
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* EMO Headphones (Left) */}
            <div className="absolute top-1/2 -left-1 h-4 w-1 -translate-y-1/2 rounded-l-md bg-slate-400 border border-slate-500 shadow-sm">
              <div className="absolute top-1/2 right-0 h-2 w-0.5 -translate-y-1/2 bg-cyan-400 shadow-[0_0_3px_#22d3ee]" />
            </div>
            {/* EMO Headphones (Right) */}
            <div className="absolute top-1/2 -right-1 h-4 w-1 -translate-y-1/2 rounded-r-md bg-slate-400 border border-slate-500 shadow-sm">
              <div className="absolute top-1/2 left-0 h-2 w-0.5 -translate-y-1/2 bg-cyan-400 shadow-[0_0_3px_#22d3ee]" />
            </div>
          </motion.div>

          {/* EMO's little feet */}
          <div className="relative -mt-0.5 flex w-[32px] justify-between z-10">
            {/* Left Foot */}
            <motion.div
              className="h-2 w-3 rounded-b-sm rounded-t-[1px] bg-slate-300 border border-slate-400 shadow-sm origin-top"
              animate={
                activity === 'dance' ? { y: [0, -6, 0], rotateX: [0, 45, 0] } :
                  activity === 'wave' ? { rotateZ: -10 } :
                    { y: 0, rotateX: 0, rotateZ: 0 }
              }
              transition={{ duration: 0.6, repeat: activity === 'dance' ? Infinity : 0 }}
            />
            {/* Right Foot */}
            <motion.div
              className="h-2 w-3 rounded-b-sm rounded-t-[1px] bg-slate-300 border border-slate-400 shadow-sm origin-top"
              animate={
                activity === 'dance' ? { y: [0, -6, 0], rotateX: [0, 45, 0], delay: 0.3 } :
                  activity === 'wave' ? { rotateZ: 10 } :
                    { y: 0, rotateX: 0, rotateZ: 0 }
              }
              transition={{ duration: 0.6, repeat: activity === 'dance' ? Infinity : 0 }}
            />
          </div>

        </motion.div>
      </motion.div>
    </motion.div>
  );
};
