import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2 } from '../data/mockData';
import { Testimonial } from '../types';

interface TestimonialsProps {
  onOpenAuth: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onOpenAuth }) => {
  const renderCard = (t: Testimonial) => (
    <div
      key={t.id}
      className="w-[320px] sm:w-[360px] shrink-0 rounded-3xl border border-white/10 bg-[#161616] p-6 shadow-xl flex flex-col justify-between hover:border-white/25 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover border border-white/20"
          loading="lazy"
        />
        <div>
          <h4 className="text-base font-semibold text-white">{t.name}</h4>
          <span className="text-[11px] text-[#3d9be9]">Verified Member</span>
        </div>
        <Quote className="w-5 h-5 text-white/20 ml-auto" />
      </div>

      <div className="my-3.5 h-px w-full bg-[#2d2d2d]" />

      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
        "{t.text}"
      </p>
    </div>
  );

  return (
    <section id="testimonials" className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-14 text-center">
        <div className="text-xs uppercase tracking-widest text-[#3d9be9] font-medium mb-3">
          Social Proof &amp; Community Feedback
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-['Poppins',sans-serif]">
          Trusted by early learners <br />
          and teachers.
        </h2>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative w-full overflow-hidden mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-5">
          {TESTIMONIALS_ROW_1.map(renderCard)}
          {TESTIMONIALS_ROW_1.map((t) => renderCard({ ...t, id: `${t.id}-dup` }))}
        </div>
      </div>

      {/* Marquee Row 2 (Reverse direction) */}
      <div className="relative w-full overflow-hidden mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-reverse flex gap-5">
          {TESTIMONIALS_ROW_2.map(renderCard)}
          {TESTIMONIALS_ROW_2.map((t) => renderCard({ ...t, id: `${t.id}-dup2` }))}
        </div>
      </div>

      {/* CTA under testimonials */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 rounded-full bg-[#3d9be9] px-7 py-3 text-sm font-medium text-white shadow-md shadow-blue-500/20 hover:bg-[#2a7dd7] transition-all duration-200 hover:-translate-y-0.5"
        >
          <span>Get started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
