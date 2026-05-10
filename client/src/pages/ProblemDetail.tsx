import { useState, useEffect } from 'react';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Send, MessageCircle, Clock, Save, MoreVertical, Terminal, Maximize2, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import Navbar from '@/src/components/Navbar';
import { cn } from '@/src/lib/utils';
import { Difficulty, Problem } from '@/src/types';

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  \n}');
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'submissions'>('description');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/problems/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Problem not found');
        return res.json();
      })
      .then(data => {
        setProblem(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
           <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      </div>
    );
  }

  if (!problem) {
    return <div className="flex items-center justify-center min-h-screen">Problem not found</div>;
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'Hard': return 'text-rose-500';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* Left Pane: Description */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
             <button onClick={() => setActiveTab('description')} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'description' ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>
               Description
             </button>
             <button onClick={() => setActiveTab('solution')} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'solution' ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>
               Solutions
             </button>
             <button onClick={() => setActiveTab('submissions')} className={cn("px-4 py-1.5 text-xs font-bold rounded-lg transition-all", activeTab === 'submissions' ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400" : "text-slate-500")}>
               Submissions
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{problem.id}. {problem.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className={cn("text-sm font-bold", getDifficultyColor(problem.difficulty))}>{problem.difficulty}</span>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <Clock size={14} />
                <span>Runtime: O(n log n)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <Save size={14} />
                <span>Memory: O(1)</span>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                {problem.description}
              </p>

              {problem.examples.map((example) => (
                <div key={example.id} className="mb-8">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-widest">Example {example.id}:</h3>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Input</span>
                        <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{example.input}</code>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Output</span>
                        <code className="text-xs font-mono text-slate-700 dark:text-slate-300">{example.output}</code>
                    </div>
                    {example.explanation && (
                         <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Explanation</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">{example.explanation}</p>
                         </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-widest">Constraints:</h3>
                <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  {problem.constraints.map((constraint, i) => (
                    <li key={i}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4 py-6 border-t border-slate-100 dark:border-slate-800 mt-8">
               <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                 <MessageCircle size={16} />
                 Discuss (245)
               </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor */}
        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative group">
             <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                     <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                     <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                   </div>
                   <div className="h-4 w-px bg-slate-800 mx-1" />
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Terminal size={12} className="text-indigo-500" />
                      solution.js
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                     <Maximize2 size={14} />
                   </button>
                   <button className="p-1.5 text-slate-500 hover:text-white transition-colors">
                     <MoreVertical size={14} />
                   </button>
                </div>
             </div>

             <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    fontFamily: 'JetBrains Mono',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    padding: { top: 20 }
                  }}
                />
             </div>

             {/* Action Bar */}
             <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center group-focus-within:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                     Console
                   </button>
                </div>
                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-2 px-6 py-2 text-xs font-bold border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white rounded-lg transition-all">
                     <Play size={14} />
                     Run Code
                   </button>
                   <button className="flex items-center gap-2 px-6 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                     <Send size={14} />
                     Submit
                   </button>
                </div>
             </div>
          </div>

          {/* Test Case Pane */}
          <div className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-hidden">
             <div className="flex items-center gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Cases</h3>
                <div className="flex gap-2">
                   {problem.examples.map((_, i) => (
                      <button key={i} className={cn("px-2 py-1 rounded text-[10px] font-bold", i === 0 ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "text-slate-400")}>
                        Case {i + 1}
                      </button>
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input</span>
                       <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {problem.examples[0].input}
                       </div>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Output</span>
                       <div className="bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {problem.examples[0].output}
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
