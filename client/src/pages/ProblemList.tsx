import { useState, useEffect } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronRight, CheckCircle2, MessageCircle, Star, Loader2 } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Difficulty, Problem } from '@/src/types';

export default function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/problem/getProblemsList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problems:', error);
        setLoading(false);
      })
  }, []);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20';
      case 'Medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20';
      case 'Hard': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Algorithms</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Explore and master over 2,000+ technical challenges.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all w-64"
                />
             </div>
             <button className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
               <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
           {['Arrays', 'Strings', 'Dynamic Programming', 'Trees'].map(tag => (
             <button key={tag} className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-900 text-left transition-all hover:shadow-md">
                {tag}
             </button>
           ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="col-span-1">Status</div>
            <div className="col-span-5 md:col-span-6">Title</div>
            <div className="col-span-2 md:col-span-1">Difficulty</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            ) : (
              problems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="col-span-1">
                    {parseInt(problem.id) % 2 === 0 ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                    )}
                  </div>
                  <div className="col-span-5 md:col-span-6">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {problem.id}. {problem.title}
                    </span>
                    <div className="flex gap-2 mt-1">
                       <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{problem.category}</span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full border",
                      getDifficultyColor(problem.difficulty)
                    )}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-4">
           <p className="text-xs text-slate-500 font-medium tracking-tight">Showing 1-20 of 2,410 results</p>
           <div className="flex gap-2">
             <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white transition-colors">Next</button>
           </div>
        </div>
      </main>
    </div>
  );
}
