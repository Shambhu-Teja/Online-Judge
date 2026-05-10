import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Users, Zap, Star, Shield, Cpu, Trophy } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function Home() {
  const [username, setUsername] = useState('User');

  const stats = [
    { label: 'Solved Problems', value: '42', icon: Zap, color: 'text-yellow-500' },
    { label: 'Global Rank', value: '#24,512', icon: Trophy, color: 'text-indigo-500' },
    { label: 'Contest Rating', value: '1840', icon: Star, color: 'text-emerald-500' },
  ];

  const getUsername = async () => {
    try {

      console.log(localStorage);
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token) return 'User';

      const apiResponse = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const userData = await apiResponse.json();

      return userData.user.name || 'User';
    } catch (error) {
      console.error('Failed to fetch username:', error);
      return 'User';
    }
  };

  useEffect(() => {
    async function loadUser() {
      const name = await getUsername();
      setUsername(name);
    }

    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 dark:shadow-none"
            >
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome back, {username}! 👋
                </h1>

                <p className="text-indigo-100 max-w-md text-lg leading-relaxed mb-8">
                  Ready to level up your skills today? We've curated some new challenges for your daily streak.
                </p>

                <Link
                  to="/problems"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
                >
                  <Cpu size={18} />
                  Start Coding Now
                </Link>
              </div>

              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30 group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute bottom-[-10%] left-[20%] w-32 h-32 bg-indigo-400 rounded-full blur-2xl opacity-20" />
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-800",
                      stat.color
                    )}
                  >
                    <stat.icon size={20} />
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {stat.label}
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>

                <button className="text-sm text-indigo-600 font-bold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                        <Zap size={18} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                          Solved: "Longest Valid Parentheses"
                        </h4>

                        <p className="text-xs text-slate-500 mt-0.5">
                          2 hours ago • Runtime 4ms (99.8%)
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded">
                      +20 XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Friends */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-indigo-600" />

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Active Friends
                </h2>
              </div>

              <div className="space-y-4">
                {['alex_dev', 'sarah_codes', 'pixel_master', 'binary_wizard'].map((user) => (
                  <div key={user} className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                        {user[0].toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {user}
                        </p>

                        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Online
                        </p>
                      </div>
                    </div>

                    <button className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contest Card */}
            <div className="bg-slate-900 dark:bg-indigo-950/20 text-white rounded-3xl p-8 relative overflow-hidden">
              <Shield className="absolute top-[-20%] left-[-10%] w-32 h-32 text-white/5" />

              <h3 className="text-xl font-bold mb-2">
                Weekly Contest 402
              </h3>

              <p className="text-slate-400 text-sm mb-6 font-medium">
                Starts in 3h 14m 20s. Join over 15k participants worldwide.
              </p>

              <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                Register Now
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}