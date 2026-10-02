'use client';

import React, { useState } from 'react';

export default function ParkingReport() {
  // States to manage the flow
  const [step, setStep] = useState(0); // 0: Start, 1: First Captured, 2: Second Captured
  const [isFlashing, setIsFlashing] = useState(false);
  const [firstCaptureTime, setFirstCaptureTime] = useState<Date | null>(null);
  const [secondCaptureTime, setSecondCaptureTime] = useState<Date | null>(null);
  const [detectedPlate, setDetectedPlate] = useState('');
  const [vehicleClassFine, setVehicleClassFine] = useState(500); // Default ₹500
  const [reportId, setReportId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to trigger camera flash
  const triggerFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 350);
  };

  // STEP 1: First Capture
  const handleFirstCapture = async () => {
    triggerFlash();
    setIsLoading(true);
    
    const now = new Date();
    setFirstCaptureTime(now);
    const mockPlate = `UP78 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${1000 + Math.floor(Math.random() * 8999)}`;
    setDetectedPlate(mockPlate);

    try {
      // Backend API Call: Create Report & First Capture
      /*
      const token = localStorage.getItem('access_token'); // Ya NextAuth session use karein
      const res = await fetch('http://localhost:8000/api/reports/incidents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          category: 'parking',
          latitude: 26.4499,
          longitude: 80.3319,
          street_address: 'Mall Road, Kanpur'
        })
      });
      const data = await res.json();
      setReportId(data.id);
      
      // Fir Capture API call karein
      await fetch('http://localhost:8000/api/reports/captures/', {
        method: 'POST',
        headers: { ... },
        body: JSON.stringify({ report: data.id, capture_sequence: 1, detected_plate: mockPlate })
      });
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setStep(1);
    } catch (error) {
      console.error("Error creating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Second Capture (After 10 mins)
  const handleSecondCapture = async () => {
    triggerFlash();
    setIsLoading(true);

    // Simulate 11 minutes later
    const later = new Date(firstCaptureTime!.getTime() + 11 * 60000);
    setSecondCaptureTime(later);

    try {
      // Backend API Call: Second Capture
      /*
      await fetch('http://localhost:8000/api/reports/captures/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ report: reportId, capture_sequence: 2, detected_plate: detectedPlate })
      });
      */

      await new Promise(resolve => setTimeout(resolve, 800));
      setStep(2);
    } catch (error) {
      console.error("Error confirming capture:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const gapMin = firstCaptureTime && secondCaptureTime 
    ? Math.round((secondCaptureTime.getTime() - firstCaptureTime.getTime()) / 60000) 
    : 0;

  return (
    <section className="py-10">
      <div className="font-mono text-[11px] tracking-[1px] uppercase text-river mb-2.5">Report · No-parking violation</div>
      <h2 className="text-[34px] leading-[1.15] font-bold font-display text-ink">Catch a vehicle parked where it shouldn't be</h2>
      <p className="text-ink-soft text-[15px] max-w-[620px] mt-2.5 leading-relaxed">
        Take a photo now. If the same vehicle is still there when someone photographs it again after 10 minutes, we raise a challan automatically.
      </p>

      {/* Timeline UI */}
      <div className="flex items-center gap-0 my-7">
        <div className="flex flex-col items-center flex-1">
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-river' : 'bg-brass'}`}></div>
          <div className="text-[10.5px] text-ink-soft mt-1.5 text-center">First capture</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 1 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-river' : step === 1 ? 'bg-brass' : 'bg-line-strong'}`}></div>
          <div className="text-[10.5px] text-ink-soft mt-1.5 text-center">10-min window</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 2 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-river' : 'bg-line-strong'}`}></div>
          <div className="text-[10.5px] text-ink-soft mt-1.5 text-center">Second capture</div>
        </div>
        <div className={`flex-1 h-[2px] ${step >= 2 ? 'bg-river' : 'bg-line-strong'}`}></div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-brass' : 'bg-line-strong'}`}></div>
          <div className="text-[10.5px] text-ink-soft mt-1.5 text-center">Challan & reward</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        {/* Left Panel: Camera */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px] shadow-card">
          <div className="aspect-[4/3] bg-[#0B1A17] rounded-[2px] relative overflow-hidden flex items-center justify-center border border-line-strong">
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] left-[14px] border-r-0 border-b-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 top-[14px] right-[14px] border-l-0 border-b-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] left-[14px] border-r-0 border-t-0"></div>
            <div className="absolute w-[22px] h-[22px] border-2 border-brass opacity-80 bottom-[14px] right-[14px] border-l-0 border-t-0"></div>
            
            <div className="text-[#5E7B72] text-[13px] font-mono text-center">
              LIVE CAMERA — tap capture<br/>to log a timestamped photo
            </div>
            
            <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 ${isFlashing ? 'opacity-90' : 'opacity-0'}`}></div>
          </div>
          
          <div className="flex gap-2.5 mt-3.5 flex-wrap">
            <button 
              onClick={handleFirstCapture} 
              disabled={step >= 1 || isLoading}
              className="border border-ink bg-ink text-[#F5F1E4] px-5 py-2.5 rounded-[2px] text-[13.5px] font-medium hover:bg-[#1E3A34] disabled:opacity-45 disabled:cursor-not-allowed"
            >
              {isLoading && step === 0 ? 'Capturing...' : 'Capture photo'}
            </button>
            <button 
              onClick={handleSecondCapture}
              disabled={step !== 1 || isLoading}
              className="bg-transparent text-ink border border-line-strong px-5 py-2.5 rounded-[2px] text-[13.5px] font-medium hover:bg-paper disabled:opacity-45 disabled:cursor-not-allowed"
            >
               {isLoading && step === 1 ? 'Verifying...' : 'Capture again (after 10 min)'}
            </button>
          </div>

          {/* Capture Logs */}
          <div className="mt-3.5 space-y-3">
            {step >= 1 && (
              <div className="border border-line rounded-[2px] overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-[#22443C] to-[#183530] flex items-center justify-center text-[#7FA598] text-[12px] font-mono">
                  Captured frame · plate detected: <b className="ml-1 text-white">{detectedPlate}</b>
                </div>
                <div className="p-[10px_12px] bg-paper-raised border-t border-line font-mono text-[11.5px] text-ink-soft flex justify-between">
                  <span>{firstCaptureTime?.toLocaleTimeString('en-IN')}</span>
                  <span>26.4499°N, 80.3319°E</span>
                </div>
              </div>
            )}
            {step >= 2 && (
              <div className="border border-line rounded-[2px] overflow-hidden">
                <div className="aspect-[16/10] bg-gradient-to-br from-[#22443C] to-[#183530] flex items-center justify-center text-[#7FA598] text-[12px] font-mono">
                  Same plate confirmed still present: <b className="ml-1 text-white">{detectedPlate}</b>
                </div>
                <div className="p-[10px_12px] bg-paper-raised border-t border-line font-mono text-[11.5px] text-ink-soft flex justify-between">
                  <span>{secondCaptureTime?.toLocaleTimeString('en-IN')} (+{gapMin} min)</span>
                  <span>26.4499°N, 80.3319°E</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Challan Details */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px] shadow-card">
          <h3 className="text-[15px] font-bold font-display text-ink">Vehicle & fine details</h3>
          <p className="text-ink-soft text-[14px] mt-1.5">Fine amount is set by vehicle class once a challan is confirmed.</p>
          
          <div className="mt-3.5">
            <label className="text-[12px] text-ink-soft block mb-1.5">Vehicle class</label>
            <select 
              value={vehicleClassFine}
              onChange={(e) => setVehicleClassFine(Number(e.target.value))}
              disabled={step >= 2}
              className="w-full p-[9px_10px] border border-line-strong rounded-[2px] bg-white font-body text-[13.5px] text-ink"
            >
              <option value="500">Two-wheeler — ₹500</option>
              <option value="1000">Car / SUV — ₹1,000</option>
              <option value="2000">Truck / commercial — ₹2,000</option>
            </select>
          </div>

          <div className="mt-4">
            {step === 0 && <p className="text-ink-soft text-sm">Awaiting first capture...</p>}
            {step === 1 && <p className="text-ink-soft text-sm p-3 bg-paper rounded border border-line">First photo logged. The 10-minute window has started — if the same vehicle is still there, capture again to confirm.</p>}
            
            {step === 2 && (
              <div className="border border-dashed border-alert rounded-[2px] p-[18px] bg-[#FBF1EE]">
                <div className="flex justify-between text-[13px] py-1 border-b border-[#EAD3CC]">
                  <span>Vehicle</span><b className="font-mono">{detectedPlate}</b>
                </div>
                <div className="flex justify-between text-[13px] py-1 border-b border-[#EAD3CC]">
                  <span>Gap between captures</span><b className="font-mono">{gapMin} min (≥10 min confirmed)</b>
                </div>
                <div className="flex justify-between text-[13px] py-1 border-b border-[#EAD3CC]">
                  <span>Fine issued</span><b className="font-mono">₹{vehicleClassFine}</b>
                </div>
                <div className="flex justify-between text-[13px] py-1 border-b border-[#EAD3CC]">
                  <span>Police notified</span><b className="font-mono text-river-dark">Sent</b>
                </div>
                <div className="flex justify-between text-[13px] py-1 pt-2">
                  <span className="font-bold">Your reward (15%)</span>
                  <b className="text-river-dark font-mono text-[14px]">+₹{Math.round(vehicleClassFine * 0.15)}</b>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}