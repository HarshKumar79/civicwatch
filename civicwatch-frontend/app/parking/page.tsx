'use client';

import React, { useState, useRef, useEffect } from 'react';
import { fetchFromAPI } from '../utils/api';

export default function ParkingReportPage() {
  const [step, setStep] = useState(0); 
  const [isFlashing, setIsFlashing] = useState(false);
  const [firstCaptureTime, setFirstCaptureTime] = useState<Date | null>(null);
  const [secondCaptureTime, setSecondCaptureTime] = useState<Date | null>(null);
  const [detectedPlate, setDetectedPlate] = useState('');
  const [vehicleClassFine, setVehicleClassFine] = useState(500);
  const [reportId, setReportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 10-Minute Timer State
  const [timeLeft, setTimeLeft] = useState(600);

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [capturedImage1, setCapturedImage1] = useState<string | null>(null);
  const [capturedImage2, setCapturedImage2] = useState<string | null>(null);

  // ==========================================
  // 1. HYDRATE STATE FROM LOCALSTORAGE (On Mount)
  // ==========================================
  useEffect(() => {
    const savedStep = localStorage.getItem('cw_step');
    if (savedStep) {
      setStep(Number(savedStep));
      setReportId(Number(localStorage.getItem('cw_reportId')));
      setDetectedPlate(localStorage.getItem('cw_plate') || '');
      
      const t1 = localStorage.getItem('cw_time1');
      if (t1) setFirstCaptureTime(new Date(t1));

      const t2 = localStorage.getItem('cw_time2');
      if (t2) setSecondCaptureTime(new Date(t2));

      setCapturedImage1(localStorage.getItem('cw_img1'));
      setCapturedImage2(localStorage.getItem('cw_img2'));
    }
  }, []);

  // ==========================================
  // 2. ABSOLUTE TIMER LOGIC (Continues in Background)
  // ==========================================
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 1 && firstCaptureTime) {
      const calculateTimeLeft = () => {
        // System clock difference (in seconds)
        const elapsedSeconds = Math.floor((new Date().getTime() - firstCaptureTime.getTime()) / 1000);
        const remaining = Math.max(0, 600 - elapsedSeconds);
        setTimeLeft(remaining);
      };
      
      calculateTimeLeft(); // Run immediately
      timer = setInterval(calculateTimeLeft, 1000); // Check every second
    }
    return () => clearInterval(timer);
  }, [step, firstCaptureTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ==========================================
  // CAMERA & CAPTURE LOGIC
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
    if (step < 2) startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [step]);

  const triggerFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 350);
  };

  // Modified to return both Blob (for backend) and Base64 (for LocalStorage)
  const captureFrame = (): Promise<{blob: Blob, base64: string}> => {
    return new Promise((resolve, reject) => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Lower quality base64 to avoid localstorage limits
        const base64 = canvas.toDataURL('image/jpeg', 0.5);
        
        canvas.toBlob((blob) => {
          if (blob) resolve({ blob, base64 });
          else reject(new Error("Frame capture failed"));
        }, 'image/jpeg', 0.8);
      } else {
        reject(new Error("Camera not ready"));
      }
    });
  };

  const handleFirstCapture = async () => {
    try {
      setError('');
      setIsLoading(true);
      triggerFlash();
      
      const { blob: imageBlob, base64 } = await captureFrame();
      const now = new Date();
      
      const mockPlate = `UP78 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${1000 + Math.floor(Math.random() * 8999)}`;
      
      // API Calls
      const reportData = await fetchFromAPI('/reports/incidents/', {
        method: 'POST',
        body: JSON.stringify({ category: 'parking', latitude: 26.4499, longitude: 80.3319, street_address: 'Mall Road, near Z Square' })
      });
      
      const formData = new FormData();
      formData.append('report', reportData.id.toString());
      formData.append('capture_sequence', '1');
      formData.append('detected_plate', mockPlate);
      formData.append('media_file', imageBlob, 'capture_1.jpg');

      await fetchFromAPI('/reports/captures/', { method: 'POST', body: formData });

      // Save to State
      setStep(1);
      setFirstCaptureTime(now);
      setReportId(reportData.id);
      setDetectedPlate(mockPlate);
      setCapturedImage1(base64);

      // Save to LocalStorage
      localStorage.setItem('cw_step', '1');
      localStorage.setItem('cw_reportId', reportData.id.toString());
      localStorage.setItem('cw_time1', now.toISOString());
      localStorage.setItem('cw_plate', mockPlate);
      localStorage.setItem('cw_img1', base64);

    } catch (err: any) {
      console.error(err);
      setError('Failed to capture or upload photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecondCapture = async () => {
    if (timeLeft > 0) return; 

    try {
      setError('');
      setIsLoading(true);
      triggerFlash();

      const { blob: imageBlob, base64 } = await captureFrame();
      const now = new Date();

      const formData = new FormData();
      formData.append('report', reportId!.toString());
      formData.append('capture_sequence', '2');
      formData.append('detected_plate', detectedPlate);
      formData.append('media_file', imageBlob, 'capture_2.jpg');

      await fetchFromAPI('/reports/captures/', { method: 'POST', body: formData });

      // Save to State
      setStep(2);
      setSecondCaptureTime(now);
      setCapturedImage2(base64);

      // Save to LocalStorage
      localStorage.setItem('cw_step', '2');
      localStorage.setItem('cw_time2', now.toISOString());
      localStorage.setItem('cw_img2', base64);

    } catch (err: any) {
      console.error(err);
      setError('Failed to capture or upload second photo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Session
  const handleClearSession = () => {
    localStorage.removeItem('cw_step');
    localStorage.removeItem('cw_reportId');
    localStorage.removeItem('cw_time1');
    localStorage.removeItem('cw_time2');
    localStorage.removeItem('cw_plate');
    localStorage.removeItem('cw_img1');
    localStorage.removeItem('cw_img2');
    
    setStep(0);
    setFirstCaptureTime(null);
    setSecondCaptureTime(null);
    setCapturedImage1(null);
    setCapturedImage2(null);
    setTimeLeft(600);
  };

  const gapMin = firstCaptureTime && secondCaptureTime 
    ? Math.round((secondCaptureTime.getTime() - firstCaptureTime.getTime()) / 60000) 
    : 10;

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-10">
      <div className="flex justify-between items-end mb-2.5">
        <div className="font-mono text-[11px] tracking-[1px] uppercase text-river">Report · No-parking violation</div>
        {step > 0 && (
          <button onClick={handleClearSession} className="text-[11px] text-alert underline font-mono">Reset Session</button>
        )}
      </div>
      <h2 className="text-[34px] leading-[1.15] font-bold font-display text-ink">Catch a vehicle parked where it shouldn't be</h2>
      <p className="text-ink-soft text-[15px] max-w-[620px] mt-2.5 leading-relaxed">
        Take a photo now. If the same vehicle is still there when someone photographs it again after 10 minutes, we raise a challan automatically.
      </p>

      {error && <div className="mt-4 p-3 bg-[#FBF1EE] border border-alert text-alert-dark rounded text-sm">{error}</div>}

      {/* Static-Style Timeline */}
      <div className="flex items-center gap-0 my-8">
        <div className="flex flex-col items-center flex-1">
          <div className={`text-[12px] font-mono font-bold mb-1 ${step >= 1 ? 'text-river' : 'text-ink-faint'}`}>1</div>
          <div className="text-[10.5px] text-ink-soft text-center font-mono">First capture</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 1 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`text-[12px] font-mono font-bold mb-1 ${step >= 2 ? 'text-river' : step === 1 ? 'text-brass' : 'text-ink-faint'}`}>2</div>
          <div className="text-[10.5px] text-ink-soft text-center font-mono">10-min window</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 2 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`text-[12px] font-mono font-bold mb-1 ${step >= 2 ? 'text-river' : 'text-ink-faint'}`}>3</div>
          <div className="text-[10.5px] text-ink-soft text-center font-mono">Second capture</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 2 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`text-[12px] font-mono font-bold mb-1 ${step >= 2 ? 'text-brass' : 'text-ink-faint'}`}>4</div>
          <div className="text-[10.5px] text-ink-soft text-center font-mono">Challan & reward</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        {/* Left Panel: Camera View */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px] shadow-card">
          <div className="aspect-[4/3] bg-[#0B1A17] rounded-[2px] relative overflow-hidden flex items-center justify-center border border-line-strong">
            
            {step < 2 ? (
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" />
            ) : (
              <div className="text-white/60 font-mono text-sm text-center px-4">Camera session closed. <br/>Report successfully filed.</div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />

            {step < 2 && (
              <>
                <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] left-[14px] border-r-0 border-b-0"></div>
                <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] right-[14px] border-l-0 border-b-0"></div>
                <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] left-[14px] border-r-0 border-t-0"></div>
                <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] right-[14px] border-l-0 border-t-0"></div>
                <div className="text-[#5E7B72] text-[13px] font-mono text-center relative z-10">LIVE CAMERA — tap capture<br/>to log a timestamped photo</div>
              </>
            )}
            
            <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 ${isFlashing ? 'opacity-90' : 'opacity-0'}`}></div>
          </div>
          
          <div className="flex gap-2.5 mt-3.5 flex-wrap">
            <button 
              onClick={handleFirstCapture} 
              disabled={step >= 1 || isLoading}
              className="border border-ink bg-ink text-[#F5F1E4] px-5 py-[11px] rounded-[2px] text-[13.5px] font-medium hover:bg-[#1E3A34] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && step === 0 ? 'Uploading...' : 'Capture photo'}
            </button>
            
            <button 
              onClick={handleSecondCapture}
              disabled={step !== 1 || timeLeft > 0 || isLoading}
              className={`border px-5 py-[11px] rounded-[2px] text-[13.5px] font-medium transition-colors ${
                step === 1 && timeLeft === 0 
                  ? 'border-river bg-river text-white hover:bg-river-dark' 
                  : 'bg-transparent text-ink border-line-strong hover:bg-paper disabled:opacity-45 disabled:cursor-not-allowed'
              }`}
            >
               {step === 0 && 'Capture again (after 10 min)'}
               {step === 1 && timeLeft > 0 && `Wait required (${formatTime(timeLeft)})`}
               {step === 1 && timeLeft === 0 && (isLoading ? 'Verifying...' : 'Capture again (Verified)')}
               {step === 2 && 'Capture again (after 10 min)'}
            </button>
          </div>

          {/* Evidence Logs with Saved Images */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {step >= 1 && capturedImage1 && (
              <div className="border border-line rounded-[2px] overflow-hidden shadow-sm">
                <img src={capturedImage1} alt="Capture 1" className="w-full aspect-[4/3] object-cover" />
                <div className="p-2 bg-paper-raised text-[10px] font-mono text-ink-soft border-t border-line flex justify-between">
                  <span>{firstCaptureTime?.toLocaleTimeString('en-IN')}</span>
                </div>
              </div>
            )}
            {step >= 2 && capturedImage2 && (
              <div className="border border-line rounded-[2px] overflow-hidden shadow-sm">
                <img src={capturedImage2} alt="Capture 2" className="w-full aspect-[4/3] object-cover" />
                <div className="p-2 bg-paper-raised text-[10px] font-mono text-ink-soft border-t border-line flex justify-between">
                  <span>{secondCaptureTime?.toLocaleTimeString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Vehicle & Fine Details */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px] shadow-card">
          <h3 className="text-[15px] font-bold font-display text-ink">Vehicle & fine details</h3>
          <p className="text-ink-soft text-[14.5px] mt-1.5 leading-[1.65]">
            Fine amount is set by vehicle class once a challan is confirmed.
          </p>
          
          <div className="mt-3.5">
            <label className="text-[12px] text-ink-soft block mb-1.5 font-body">Vehicle class</label>
            <select 
              value={vehicleClassFine}
              onChange={(e) => setVehicleClassFine(Number(e.target.value))}
              disabled={step >= 2}
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[13.5px] text-ink focus:outline-none focus:border-navy"
            >
              <option value="500">Two-wheeler — ₹500</option>
              <option value="1000">Car / SUV — ₹1,000</option>
              <option value="2000">Truck / commercial — ₹2,000</option>
            </select>
          </div>

          <div className="mt-5">
            {step === 1 && (
              <div className="text-ink-soft text-[13.5px]">
                <p>First photo logged. The 10-minute window has started — if the same vehicle is still there, capture again to confirm.</p>
                <div className="mt-3 text-brass font-mono font-bold text-[18px]">
                  Time remaining: {formatTime(timeLeft)}
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="border border-dashed border-alert rounded-[2px] p-[18px] bg-[#FBF1EE] mt-4">
                <div className="flex justify-between text-[13px] py-[4px] border-b border-[#EAD3CC]">
                  <span className="font-body text-ink">Vehicle</span><b className="font-mono text-ink">{detectedPlate}</b>
                </div>
                <div className="flex justify-between text-[13px] py-[4px] border-b border-[#EAD3CC]">
                  <span className="font-body text-ink">Gap between captures</span><b className="font-mono text-ink">{gapMin} min (≥10 min confirmed)</b>
                </div>
                <div className="flex justify-between text-[13px] py-[4px] border-b border-[#EAD3CC]">
                  <span className="font-body text-ink">Fine issued</span><b className="font-mono text-ink">₹{vehicleClassFine}</b>
                </div>
                <div className="flex justify-between text-[13px] py-[4px] border-b border-[#EAD3CC]">
                  <span className="font-body text-ink">SMS sent to owner</span><b className="font-mono text-ink">Delivered</b>
                </div>
                <div className="flex justify-between text-[13px] py-[4px] pt-3 mt-1">
                  <span className="font-bold text-ink font-body">Your reward (15%)</span>
                  <b className="text-river-dark font-mono text-[14px]">+₹{Math.round(vehicleClassFine * 0.15)}</b>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}