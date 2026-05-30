import { Sparkles } from 'lucide-react';

export default function BrandLogo({ compact = false, inverted = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25">
        <div className="absolute inset-0 bg-white/15 [clip-path:polygon(0_0,100%_0,58%_100%,0_100%)]" />
        <Sparkles className="relative h-5 w-5" />
      </div>
      {!compact && (
        <span className={`text-xl font-black tracking-tight ${inverted ? 'text-white' : 'text-gray-950 dark:text-white'}`}>
          Career<span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">AI</span>
        </span>
      )}
    </div>
  );
}
