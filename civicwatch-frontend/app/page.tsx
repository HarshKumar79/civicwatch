'use client';
import HeroCarousel from './components/home/HeroCarousel';
import StatTicker from './components/home/StatTicker';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <StatTicker />

      <div className="max-w-[1140px] mx-auto px-5 py-10 pb-16">
        <section className="pt-3 pb-2">
          <div className="font-mono text-[11px] tracking-[1px] uppercase text-river mb-2.5">
            A citizen & municipal corporation initiative — Kanpur Nagar Nigam
          </div>
          <h2 className="text-[34px] leading-[1.15] max-w-[640px] font-bold font-display text-ink mb-2.5">
            Cleaner roads. Watched dividers. Vehicles that don't sit where they shouldn't.
          </h2>
          <p className="text-ink-soft text-[15px] max-w-[620px] mt-2.5 leading-relaxed">
            Report a wrongly parked vehicle or an act of pollution in seconds, anywhere in Kanpur. Track when your road, footpath, or divider was last serviced. Every verified report earns a reward — every ignored notice becomes a challan.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-line mt-8 border border-line">
            <div className="bg-paper-raised p-[18px_20px]">
              <div className="flex items-center gap-2 font-display text-[22px] font-bold text-ink">
                ₹500–₹2,000
              </div>
              <span className="text-[12px] text-ink-soft mt-1 block">Fine range by vehicle size</span>
            </div>
            <div className="bg-paper-raised p-[18px_20px]">
              <div className="flex items-center gap-2 font-display text-[22px] font-bold text-ink">
                10 min
              </div>
              <span className="text-[12px] text-ink-soft mt-1 block">Grace window before a challan is raised</span>
            </div>
            <div className="bg-paper-raised p-[18px_20px]">
              <div className="flex items-center gap-2 font-display text-[22px] font-bold text-ink">
                15%
              </div>
              <span className="text-[12px] text-ink-soft mt-1 block">Challan value paid to reporter and responding officer, each</span>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
            {[
              { num: '01', title: 'Spot it', desc: 'A vehicle in a no-parking zone, or pollution in progress.' },
              { num: '02', title: 'Capture it', desc: 'Open the portal, take a timestamped, geo-tagged photo or video.' },
              { num: '03', title: 'We verify', desc: 'A second, independent capture 10+ minutes later confirms it.' },
              { num: '04', title: 'Action follows', desc: 'Owner is notified, police dispatched, challan and reward issued.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-paper-raised border border-line-strong border-l-[3px] border-l-brass rounded-[2px] p-4 hover:bg-[#F2F4F6] transition-colors">
                <div className="font-mono text-brass-dark text-[12px]">{step.num}</div>
                <h3 className="text-[14px] font-bold font-display text-ink mt-1.5">{step.title}</h3>
                <p className="text-[12.5px] text-ink-soft mt-1.5">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* About Band */}
          <div className="bg-[#EEF1F4] border border-line p-6 lg:p-[26px_28px] mt-8">
            <div className="flex items-center gap-2.5 mb-3">
              <h3 className="text-[16px] font-bold font-display text-ink">About This Portal</h3>
            </div>
            <p className="text-ink-soft text-[15px] max-w-[760px] leading-relaxed">
              CivicWatch is a citizen-reporting and municipal-maintenance tracking initiative under the Kanpur Municipal Corporation. It lets residents flag no-parking violations and pollution incidents in real time, and lets the Corporation publish a transparent, ward-wise record of road sweeping, divider repair, footpath patching, and median-plant watering.
            </p>
          </div>

          {/* Quote Block */}
          <div className="bg-paper-raised border border-line-strong rounded-[2px] p-[22px_24px] mt-7 flex gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-[#E4E8EC] border-2 border-dashed border-line-strong flex items-center justify-center shrink-0 text-ink-faint text-[10px] font-mono text-center leading-tight">
              OFFICIAL<br/>PHOTOGRAPH
            </div>
            <div>
              <div className="font-display text-[32px] text-brass leading-none mb-0.5">"</div>
              <p className="text-[14.5px] text-ink leading-[1.6] italic">
                [ Space reserved for an inaugural statement from the Municipal Commissioner or Mayor — add your authorized quote and an official photograph here before publishing. ]
              </p>
              <div className="mt-2.5 text-[12px] text-ink-soft font-mono">— Office of the Municipal Commissioner</div>
              <span className="inline-block mt-2.5 text-[10.5px] font-mono bg-[#F3E2C4] text-brass-dark px-2 py-1 rounded-[4px] tracking-[0.3px] uppercase">
                Placeholder — replace before launch
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}