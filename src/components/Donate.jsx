import { useEffect, useState } from 'react';

export default function Donate() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/donate.json')
      .then(r => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="glass p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-lg mb-1" style={{ lineHeight: 1 }}>☕</p>
        <h2 className="text-base font-bold text-white/80 mt-2 mb-1">
          Mua cho tác giả một ly cà phê?
        </h2>
        <p className="text-xs text-white/32 leading-relaxed max-w-xs mx-auto">
          Nếu app này giúp ích cho bạn, một khoản ủng hộ nhỏ sẽ giúp tác giả
          tiếp tục phát triển thêm tính năng mới. Cảm ơn bạn rất nhiều! 🙏
        </p>
      </div>

      {/* QR grid */}
      <div className={`grid gap-4 ${items.length === 1 ? 'grid-cols-1 max-w-[180px] mx-auto' : 'grid-cols-2'}`}>
        {items.map((item, i) => (
          <QRCard key={item.id ?? i} item={item} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-[10px] text-white/18 mt-5">
        Mọi đóng góp đều được trân trọng, dù nhỏ đến đâu 💙
      </p>
    </section>
  );
}

function QRCard({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // accent color → rgba for glow
  const hex   = item.accent ?? '#3b82f6';
  const r     = parseInt(hex.slice(1,3),16);
  const g     = parseInt(hex.slice(3,5),16);
  const b     = parseInt(hex.slice(5,7),16);
  const glow  = `rgba(${r},${g},${b},0.35)`;
  const faint = `rgba(${r},${g},${b},0.08)`;
  const ring  = `rgba(${r},${g},${b},0.25)`;

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-[14px] p-4 border transition-all duration-300 group hover:-translate-y-0.5"
      style={{
        background: faint,
        borderColor: ring,
        boxShadow: `0 0 0 0 ${glow}`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 24px ${glow}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* QR image box */}
      <div
        className="relative w-full aspect-square rounded-[10px] overflow-hidden flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${ring}` }}
      >
        {!errored ? (
          <>
            {/* Skeleton shimmer while loading */}
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
            )}
            <img
              src={item.image}
              alt={`QR ${item.name}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
            />
          </>
        ) : (
          /* Placeholder khi chưa có ảnh */
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <span className="text-3xl opacity-30">🖼️</span>
            <span className="text-[10px] text-white/25 leading-snug">
              Đặt ảnh QR tại<br />
              <code className="text-blue-400/50 font-mono">{item.image}</code>
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-xs font-bold text-white/70">{item.name}</p>
        <p className="text-[10px] text-white/30 mt-0.5">{item.label}</p>
      </div>
    </div>
  );
}
