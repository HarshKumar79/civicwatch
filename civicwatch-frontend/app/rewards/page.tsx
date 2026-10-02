'use client';

import React, { useEffect, useState } from 'react';
import { fetchFromAPI } from '../utils/api';

export default function RewardsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's submitted reports from Django Backend
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Backend se authenticated user ki reports fetch kar rahe hain
        const data = await fetchFromAPI('/reports/incidents/');
        setReports(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load your reward history. Please ensure you are logged in.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Calculate total earnings from resolved/rewarded reports (Mock or real sum)
  const totalEarnings = reports.reduce((acc, curr) => {
    return curr.status === 'resolved' ? acc + 150 : acc;
  }, 1340); // Base mock balance + dynamic additions

  return (
    <div className="max-w-[1140px] mx-auto px-5 py-10">
      <div className="font-mono text-[11px] tracking-[1px] uppercase text-river mb-2.5">Your account</div>
      <h2 className="text-[34px] leading-[1.15] font-bold font-display text-ink mb-2">Rewards Wallet & History</h2>
      <p className="text-ink-soft text-[15px] max-w-[620px] mb-8">
        Track reports you've submitted, check verification statuses, and view reward shares credited from confirmed challans.
      </p>

      {/* Aadhaar Verification Security Notice */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-paper-raised border border-line rounded-[2px] max-w-[650px] shadow-card">
        <div className="w-10 h-10 rounded-full bg-[#E6F4EA] text-river flex items-center justify-center font-bold text-lg shrink-0">✓</div>
        <div>
          <h4 className="text-[13.5px] font-bold text-ink">Identity verified via Aadhaar e-KYC</h4>
          <p className="text-[12px] text-ink-soft mt-0.5">Required before reward payouts can be securely released to your bank.</p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-10">
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-6 shadow-card">
          <div className="text-[12px] text-ink-soft font-mono uppercase tracking-[0.5px] mb-1">Available Wallet Balance</div>
          <div className="font-mono text-[38px] font-bold text-river-dark">₹{totalEarnings}</div>
          <p className="text-[12px] text-ink-soft mt-1">15% share from verified municipal challans.</p>
          
          <div className="flex gap-3 mt-5">
            <button 
              onClick={() => alert('Withdrawal request submitted to bank via Direct Benefit Transfer (DBT).')}
              className="border border-ink bg-ink text-[#F5F1E4] px-4 py-2.5 rounded-[2px] text-[13px] font-semibold hover:bg-[#1E3A34] transition-colors"
            >
              Withdraw to Bank
            </button>
            <a 
              href="/parking" 
              className="bg-transparent text-ink border border-line-strong px-4 py-2.5 rounded-[2px] text-[13px] font-semibold hover:bg-paper flex items-center transition-colors"
            >
              Report New Violation
            </a>
          </div>
        </div>

        {/* Quick Summary Stats */}
        <div className="bg-paper-raised border border-line-strong rounded-[2px] p-6 shadow-card">
          <h3 className="text-[15px] font-bold font-display text-ink mb-4">Activity Summary</h3>
          <div className="space-y-3 font-mono text-[13px]">
            <div className="flex justify-between py-1.5 border-b border-line">
              <span className="text-ink-soft">Total Reports Filed</span>
              <b className="text-ink">{reports.length}</b>
            </div>
            <div className="flex justify-between py-1.5 border-b border-line">
              <span className="text-ink-soft">Verified & Rewarded</span>
              <b className="text-river-dark">{reports.filter(r => r.status === 'resolved').length}</b>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ink-soft">Pending Verification</span>
              <b className="text-brass-dark">{reports.filter(r => r.status === 'pending' || r.status === 'unassigned').length}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Reports History Table */}
      <div className="bg-paper-raised border border-line-strong rounded-[2px] p-6 shadow-card">
        <h3 className="text-[16px] font-bold font-display text-ink mb-4">Your Registered Reports & History</h3>
        
        {loading ? (
          <p className="text-ink-soft text-[14px] py-6 text-center font-mono">Loading your submission records...</p>
        ) : error ? (
          <p className="text-alert text-[14px] py-4">{error}</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-ink-soft text-[14px] mb-3">You haven't filed any reports yet.</p>
            <a href="/parking" className="text-navy font-semibold text-[13px] underline">File your first parking or pollution report</a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">ID</th>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Category</th>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Location</th>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Date</th>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Status</th>
                  <th className="font-mono text-[10.5px] uppercase tracking-[0.5px] text-ink-faint p-3 border-b border-line-strong">Reward Earned</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((rep) => (
                  <tr key={rep.id} className="border-b border-line last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-mono text-[13px]">#{rep.id}</td>
                    <td className="p-3 text-[13px] font-semibold capitalize">{rep.category.replace('_', ' ')}</td>
                    <td className="p-3 text-[13px] text-ink-soft">{rep.street_address || 'Kanpur Nagar'}</td>
                    <td className="p-3 font-mono text-[12px] text-ink-soft">{new Date(rep.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] font-mono px-2 py-1 rounded-[4px] 
                        ${rep.status === 'pending' || rep.status === 'unassigned' ? 'bg-[#F3E2C4] text-brass-dark' : 
                          rep.status === 'dispatched' ? 'bg-[#F5D9D3] text-alert-dark' : 
                          'bg-[#D9EDE4] text-river-dark'}`}>
                        {rep.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[13px] font-bold text-river-dark">
                      {rep.status === 'resolved' ? '+₹150' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}