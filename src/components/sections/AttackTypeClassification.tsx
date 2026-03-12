'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AttackTypeClassification() {
  const [classifications, setClassifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const res = await fetch('/api/classifications');
        const data = await res.json();
        setClassifications(data);
      } catch (error) {
        console.error("Failed to fetch classifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassifications();
  }, []);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          Attack Patterns
        </h2>
        <p className="text-slate-400 text-sm">
          Detected over the last 30 days
        </p>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-800/50 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {classifications.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-200">{item.type}</span>
                  <span className="text-slate-400">
                    {item.count.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="h-full rounded-full relative shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: item.color, color: item.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
