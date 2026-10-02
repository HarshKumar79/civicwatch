'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchFromAPI } from '../utils/api';

export default function PollutionReportPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [recordingTime, setRecordingTime] = useState(0); 
  const [pollutionType, setPollutionType] = useState('Air pollution');
  const [officerAccepted, setOfficerAccepted] = useState(false);
  
  // Real GPS States
  const [gpsState, setGpsState] = useState<'idle' | 'locating' | 'locked'>('idle');
  const [coords, setCoords] = useState({ lat: 26.4499, lng: 80.3319 });
  const [locationName, setLocationName] = useState('Fetching live location...');

  const videoRef = useRef<HTMLVideoElement>(null);

  // ==========================================
  // 1. HYDRATE STATE FROM LOCALSTORAGE (On Mount)
  // ==========================================
  useEffect(() => {
    const startTime = localStorage.getItem('cw_poll_start');
    if (startTime) {
      setIsRecording(true);
      setRecordingStartTime(new Date(startTime));
      setPollutionType(localStorage.getItem('cw_poll_type') || 'Air pollution');
      setOfficerAccepted(localStorage.getItem('cw_poll_accepted') === 'true');
      
      const savedGps = localStorage.getItem('cw_poll_gps');
      if (savedGps) setGpsState(savedGps as 'idle' | 'locating' | 'locked');

      const savedLat = localStorage.getItem('cw_poll_lat');
      const savedLng = localStorage.getItem('cw_poll_lng');
      if (savedLat && savedLng) {
        setCoords({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
      }
      setLocationName(localStorage.getItem('cw_poll_locname') || 'Live Location');
    }
  }, []);

  // ==========================================
  // 2. ABSOLUTE TIMER & EVENT LOGIC
  // ==========================================
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && recordingStartTime) {
      const updateTimer = () => {
        const elapsed = Math.floor((new Date().getTime() - recordingStartTime.getTime()) / 1000);
        setRecordingTime(elapsed);

        if (elapsed >= 3 && !officerAccepted) {
          setOfficerAccepted(true);
          localStorage.setItem('cw_poll_accepted', 'true');
          
          setGpsState((prev) => {
            if (prev !== 'locked') {
              localStorage.setItem('cw_poll_gps', 'locked');
              return 'locked';
            }
            return prev;
          });
        }
      };

      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingStartTime, officerAccepted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ==========================================
  // CAMERA SETUP
  // ==========================================
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // ==========================================
  // ACTIONS: START WITH REAL LIVE GPS
  // ==========================================
  const startPollutionCapture = () => {
    const now = new Date();
    setIsRecording(true);
    setRecordingStartTime(now);
    setOfficerAccepted(false);
    setGpsState('locating');
    setLocationName('Acquiring satellite lock...');

    localStorage.setItem('cw_poll_start', now.toISOString());
    localStorage.setItem('cw_poll_type', pollutionType);
    localStorage.setItem('cw_poll_gps', 'locating');
    localStorage.setItem('cw_poll_accepted', 'false');

    // Fetch REAL Browser Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          
          setCoords({ lat, lng });
          setGpsState('locked');
          const locString = `Lat: ${lat}, Lng: ${lng}`;
          setLocationName(locString);

          // Save to LocalStorage
          localStorage.setItem('cw_poll_gps', 'locked');
          localStorage.setItem('cw_poll_lat', lat.toString());
          localStorage.setItem('cw_poll_lng', lng.toString());
          localStorage.setItem('cw_poll_locname', locString);

          // Submit Report to Django Backend with Real GPS
          try {
            await fetchFromAPI('/reports/incidents/', {
              method: 'POST',
              body: JSON.stringify({
                category: pollutionType === 'Air pollution' ? 'air_pollution' : pollutionType === 'Water pollution' ? 'water_pollution' : 'land_dumping',
                latitude: lat,
                longitude: lng,
                street_address: `Live GPS: ${lat}, ${lng}`
              })
            });
          } catch (err) {
            console.error("Failed to sync report with backend", err);
          }
        },
        (error) => {
          console.warn("GPS permission denied or unavailable, using fallback.", error);
          // Fallback to Kanpur Center if GPS denied
          setCoords({ lat: 26.4499, lng: 80.3319 });
          setGpsState('locked');
          setLocationName('Kanpur Nagar (GPS Fallback)');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      // Fallback if browser doesn't support geolocation
      setGpsState('locked');
      setLocationName('Kanpur Nagar');
    }
  };

  const handleClearSession = () => {
    setIsRecording(false);
    setRecordingStartTime(null);
    setRecordingTime(0);
    setOfficerAccepted(false);
    setGpsState('idle');
    setLocationName('');

    localStorage.removeItem('cw_poll_start');
    localStorage.removeItem('cw_poll_type');
    localStorage.removeItem('cw_poll_gps');
    localStorage.removeItem('cw_poll_lat');
    localStorage.removeItem('cw_poll_lng');
    localStorage.removeItem('cw_poll_locname');
    localStorage.removeItem('cw_poll_accepted');
  };

  const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block mr-1.5 align-text-bottom">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-5 py-6 md:py-10">
      <div className="flex justify-between items-end mb-2.5">
        <div className="font-mono text-[11px] tracking-[1px] uppercase text-river">Report · Live pollution</div>
        {isRecording && (
          <button onClick={handleClearSession} className="text-[11px] text-alert underline font-mono">Reset Session</button>
        )}
      </div>
      <h2 className="text-[28px] md:text-[34px] leading-tight font-bold font-display text-ink">Capture pollution as it happens</h2>
      <p className="text-ink-soft text-[15px] max-w-[620px] mt-2.5 leading-relaxed">
        Start a live video capture of air, water, or land pollution in progress. The nearest available officer is alerted instantly with your live GPS coordinates.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start mt-8">
        
        {/* Left Panel: Live Video & Controls */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-4 md:p-[22px] shadow-card flex flex-col">
          <h3 className="text-[13px] text-ink-soft font-mono uppercase tracking-[0.5px] mb-3 flex items-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mr-1.5"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>
            Live video
          </h3>
          
          <div className="w-full aspect-video bg-black rounded-[2px] relative overflow-hidden flex items-center justify-center border border-line-strong">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" />
            
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] left-[14px] border-r-0 border-b-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] right-[14px] border-l-0 border-b-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] left-[14px] border-r-0 border-t-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] right-[14px] border-l-0 border-t-0"></div>
            
            <div className="text-white font-mono text-center relative z-10 text-[13px]">
              {isRecording ? (
                <>
                  <span className="text-alert font-bold animate-pulse inline-block mr-2">●</span>
                  RECORDING · {formatTime(recordingTime)}
                  {officerAccepted && <div className="text-[#8FE0BE] mt-1 text-[11px] uppercase tracking-wider">Officer accepted</div>}
                </>
              ) : (
                <span className="text-[#5E7B72]">LIVE VIDEO — tap start<br/>to begin recording & alert officers</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2.5 mt-4 items-center flex-wrap">
            <button 
              onClick={startPollutionCapture} 
              disabled={isRecording}
              className="bg-alert border border-alert text-white px-5 py-[9px] rounded-[2px] text-[13.5px] font-medium hover:bg-alert-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5"><path d="M8 5v14l11-7z"/></svg>
              {isRecording ? 'Live Streaming...' : 'Start live capture'}
            </button>
            <select 
              value={pollutionType}
              onChange={(e) => setPollutionType(e.target.value)}
              disabled={isRecording}
              className="p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[13.5px] text-ink focus:outline-none focus:border-navy disabled:opacity-50"
            >
              <option>Air pollution</option>
              <option>Water pollution</option>
              <option>Land / dumping</option>
            </select>
          </div>
        </div>

        {/* Right Panel: Map & Officer Assignment */}
        <div className="flex flex-col gap-5">
          
          {/* Map Location Lock Box */}
          <div className="bg-paper-raised border border-line-strong rounded-[2px] p-4 shadow-card">
            <h3 className="text-[13px] text-ink-soft font-mono uppercase tracking-[0.5px] mb-3 flex items-center">
              <LocationIcon /> Your live GPS location
            </h3>
            <div className="relative w-full aspect-[16/9] border border-line-strong rounded-[2px] overflow-hidden bg-[#E7E5D6]">
              <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="w-full h-full block">
                <line x1="0" y1="60" x2="400" y2="60" stroke="#D3D0BE" strokeWidth="3" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#D3D0BE" strokeWidth="3" />
                <line x1="90" y1="0" x2="90" y2="240" stroke="#D3D0BE" strokeWidth="3" />
                <line x1="300" y1="0" x2="300" y2="240" stroke="#D3D0BE" strokeWidth="3" />
                <line x1="0" y1="110" x2="400" y2="95" stroke="#C7C3AC" strokeWidth="6" />
                <line x1="140" y1="0" x2="180" y2="240" stroke="#C7C3AC" strokeWidth="6" />
                <rect x="20" y="15" width="45" height="30" fill="#DBD8C7" />
                <rect x="200" y="20" width="60" height="25" fill="#DBD8C7" />
                <rect x="310" y="70" width="55" height="40" fill="#DBD8C7" />
                <rect x="30" y="170" width="50" height="35" fill="#DBD8C7" />
                <rect x="230" y="160" width="70" height="45" fill="#DBD8C7" />
              </svg>

              <div className={`absolute left-[52%] top-[46%] -translate-x-1/2 -translate-y-full transition-opacity duration-500 ${gpsState === 'locked' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute left-1/2 top-1/2 w-3.5 h-3.5 rounded-full bg-[rgba(196,43,31,0.35)] -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDuration: '1.8s' }}></div>
                <div className="w-3.5 h-3.5 rounded-full bg-alert border-[2.5px] border-white shadow-md relative z-10"></div>
              </div>

              <div className={`absolute left-[52%] top-[46%] translate-x-1.5 -translate-y-[140%] bg-ink text-[#F5F1E4] text-[11px] font-mono px-2 py-1 rounded-[3px] whitespace-nowrap transition-opacity duration-500 ${gpsState === 'locked' ? 'opacity-100' : 'opacity-0'}`}>
                {locationName}
                <div className="absolute left-2.5 -bottom-1 border-t-4 border-t-ink border-x-4 border-x-transparent"></div>
              </div>

              <div className="absolute left-2.5 bottom-2.5 bg-[rgba(20,48,43,0.9)] text-[#CFE3DC] font-mono text-[11px] px-2.5 py-1.5 rounded-[2px] tracking-[0.3px] flex items-center">
                <LocationIcon />
                {gpsState === 'idle' && 'GPS idle — start live capture'}
                {gpsState === 'locating' && 'Acquiring high-accuracy live GPS fix...'}
                {gpsState === 'locked' && `Live GPS locked · ${coords.lat}°N, ${coords.lng}°E`}
              </div>
            </div>
          </div>

          {/* Nearest Officer Response Box */}
          <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px] shadow-card">
            <h3 className="text-[15px] font-bold font-display text-ink">Nearest officer response</h3>
            
            <div className="mt-2">
              {!isRecording && <p className="text-ink-soft text-[14.5px] leading-relaxed">Waiting for a capture to begin.</p>}
              
              {isRecording && !officerAccepted && (
                <p className="text-ink-soft text-[14.5px] leading-relaxed animate-pulse">
                  Alert sent to nearest officers within 2 km using your live GPS. Waiting for acceptance…
                </p>
              )}

              {officerAccepted && (
                <div className="animate-fade-in">
                  <div className="border border-line rounded-[2px] p-4 flex gap-3.5 items-center bg-white">
                    <div className="w-11 h-11 rounded-full bg-river text-white flex items-center justify-center font-display font-bold shrink-0">RP</div>
                    <div>
                      <h3 className="text-[14px] font-bold text-ink">SI Ravi Pratap accepted</h3>
                      <p className="text-[12px] text-ink-soft mt-0.5">Dispatched to your Live GPS coordinates · 6 min ETA</p>
                    </div>
                  </div>
                  
                  <p className="text-ink-soft text-[14px] mt-4 leading-relaxed">
                    Report type: <b className="text-ink">{pollutionType}</b>. On confirmation, a fine of ₹1500 will be split between you and the responding officer.
                  </p>
                  
                  <div className="flex h-7 rounded-[2px] overflow-hidden mt-3.5 border border-line font-mono text-[11px] text-white text-center leading-7">
                    <div className="bg-river w-[15%]">You 15%</div>
                    <div className="bg-brass w-[15%]">Officer 15%</div>
                    <div className="bg-line-strong w-[70%] text-ink-soft">Municipal fund 70%</div>
                  </div>
                  
                  <button 
                    onClick={handleClearSession}
                    className="w-full mt-4 bg-transparent text-ink border border-line-strong px-4 py-2 rounded-[2px] text-[13px] font-medium hover:bg-paper transition-colors"
                  >
                    Finish Session & Submit
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}