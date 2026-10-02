'use client';

import React, { useState } from 'react';

export default function PoliceDashboard() {
  // Mock Data: Yeh real app mein API se aayega
  const [reports, setReports] = useState([
    { id: 1, time: '10:31 AM', type: 'Water pollution — live', loc: 'Rawatpur drain outfall', status: 'Unassigned', reward: '₹90 (15%)' },
    { id: 2, time: '10:42 AM', type: 'No-parking, 2nd capture pending', loc: 'Mall Road, near Z Square', status: 'Awaiting confirm', reward: '-' },
    { id: 3, time: '09:58 AM', type: 'Air pollution — burning waste', loc: 'Kalyanpur industrial belt', status: 'Dispatched', reward: '₹120 (15%)' },
  ]);

  // Action Handler: Jab Police "Accept" par click kare
  const handleAccept = (id: number) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === id 
          ? { ...report, status: 'Officer en route' } 
          : report
      )
    );
  };

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-10">
      <div className="font-mono text-[11px] tracking-[1px] uppercase text-alert mb-2.5">Restricted access</div>
      <h2 className="text-[34px] leading-[1.15] font-bold font-display text-ink mb-2.5">Police & Municipal Dashboard</h2>
      <p className="text-ink-soft text-[15px] mb-8">Live feed of incoming citizen reports awaiting confirmation or dispatch.</p>

      <div className="bg-paper-raised border border-line-strong rounded-[2px] p-6 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Time</th>
              <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Type</th>
              <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Location</th>
              <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Status</th>
              <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-line last:border-0 hover:bg-gray-50">
                <td className="p-3 font-mono text-[13px]">{report.time}</td>
                <td className="p-3 text-[13px] font-semibold">{report.type}</td>
                <td className="p-3 text-[13px] text-ink-soft">{report.loc}</td>
                <td className="p-3">
                  <span className={`inline-block text-[11px] font-mono px-2 py-1 rounded-[4px] 
                    ${report.status === 'Unassigned' ? 'bg-[#F5D9D3] text-alert-dark' : 
                      report.status === 'Awaiting confirm' ? 'bg-[#F3E2C4] text-brass-dark' : 
                      'bg-[#D9EDE4] text-river-dark'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="p-3">
                  {report.status === 'Unassigned' ? (
                    <button 
                      onClick={() => handleAccept(report.id)}
                      className="bg-navy text-white px-3 py-1.5 rounded-[2px] text-[12px] font-semibold hover:bg-navy-deep transition-colors"
                    >
                      Accept Report
                    </button>
                  ) : (
                    <button disabled className="bg-paper text-ink-faint border border-line px-3 py-1.5 rounded-[2px] text-[12px] font-semibold cursor-not-allowed">
                      Action Taken
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-line mt-6 border border-line">
        <div className="bg-paper-raised p-[18px_20px]">
          <div className="font-display text-[22px] font-bold text-ink">6</div>
          <span className="text-[12px] text-ink-soft mt-1 block">Challans issued today</span>
        </div>
        <div className="bg-paper-raised p-[18px_20px]">
          <div className="font-display text-[22px] font-bold text-ink">3</div>
          <span className="text-[12px] text-ink-soft mt-1 block">Officers currently dispatched</span>
        </div>
        <div className="bg-paper-raised p-[18px_20px]">
          <div className="font-display text-[22px] font-bold text-ink text-river-dark">₹9,400</div>
          <span className="text-[12px] text-ink-soft mt-1 block">Total fines collected today</span>
        </div>
      </div>
    </div>
  );
}