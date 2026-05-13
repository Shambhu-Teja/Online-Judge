import { useState, useEffect } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Play,
  Send,
  MoreVertical,
  Terminal,
  Maximize2,
  Loader2,
  ChevronDown,
} from 'lucide-react';

import Editor from '@monaco-editor/react';
import Navbar from '@/src/components/Navbar';
import { cn } from '@/src/lib/utils';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface TestCase {
  _id: string;
  input: string;
  expectedOutput: string;
  testCaseNumber: number;
  isHidden: boolean;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  constraints: string;

  sampleTestCase1?: TestCase;
  sampleTestCase2?: TestCase;

  sampleTestCase1Explaination?: string;
  sampleTestCase2Explaination?: string;

  hint1?: string;
  hint2?: string;
}

export default function ProblemDetail() {
  const { id } = useParams();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState<
    'cpp' | 'python' | 'java'
  >('cpp');

  const [showTags, setShowTags] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const [runningCode, setRunningCode] = useState(false);

  const [runResults, setRunResults] = useState<any[]>(
    []
  );

  const starterCodes = {
    cpp: '',
    python: '',
    java: '',
  };

  const monacoLanguages = {
    cpp: 'cpp',
    python: 'python',
    java: 'java',
  };

  const fileNames = {
    cpp: 'solution.cpp',
    python: 'solution.py',
    java: 'Solution.java',
  };

  const [code, setCode] = useState(starterCodes.cpp);

  const [activeTab, setActiveTab] = useState<
    'description' | 'solution' | 'submissions'
  >('description');

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:5000/api/problem/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(
          'token'
        )}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error('Problem not found');

        return res.json();
      })
      .then((data) => {
        setProblem(data.problem);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setCode(starterCodes[language]);
  }, [language]);

  const handleRunCode = async () => {
  try {
    if (!problem) return;

    setRunningCode(true);

    const response = await fetch(
      'http://localhost:5000/api/problem/runCode',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(
            'token'
          )}`,
        },
        body: JSON.stringify({
          code,
          language,
          problemId: problem._id,
        }),
      }
    );

    const data = await response.json();

    setRunResults(data.results || []);
  } catch (error) {
    console.error(error);
  } finally {
    setRunningCode(false);
  }
};
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="flex-1 flex items-center justify-center">
          <Loader2
            className="animate-spin text-indigo-600"
            size={48}
          />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Problem not found
      </div>
    );
  }

  const getDifficultyColor = (
    difficulty: Difficulty
  ) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-500';

      case 'Medium':
        return 'text-amber-500';

      case 'Hard':
        return 'text-rose-500';

      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT PANE */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() =>
                setActiveTab('description')
              }
              className={cn(
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all',
                activeTab === 'description'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500'
              )}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab('solution')}
              className={cn(
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all',
                activeTab === 'solution'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500'
              )}
            >
              Solutions
            </button>

            <button
              onClick={() =>
                setActiveTab('submissions')
              }
              className={cn(
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all',
                activeTab === 'submissions'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500'
              )}
            >
              Submissions
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {problem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={cn(
                  'text-sm font-bold',
                  getDifficultyColor(
                    problem.difficulty
                  )
                )}
              >
                {problem.difficulty}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Description
              </h2>

              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Constraints */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Constraints
              </h2>

              <pre className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {problem.constraints}
              </pre>
            </div>

            {/* Example 1 */}
            {problem.sampleTestCase1 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Example 1
                </h2>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">
                      Input:
                    </p>

                    <pre className="text-sm whitespace-pre-wrap">
                      {
                        problem.sampleTestCase1
                          .input
                      }
                    </pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-1">
                      Output:
                    </p>

                    <pre className="text-sm whitespace-pre-wrap">
                      {
                        problem.sampleTestCase1
                          .expectedOutput
                      }
                    </pre>
                  </div>

                  {problem.sampleTestCase1Explaination && (
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        Explanation:
                      </p>

                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {
                          problem.sampleTestCase1Explaination
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Example 2 */}
            {problem.sampleTestCase2 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Example 2
                </h2>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">
                      Input:
                    </p>

                    <pre className="text-sm whitespace-pre-wrap">
                      {
                        problem.sampleTestCase2
                          .input
                      }
                    </pre>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-1">
                      Output:
                    </p>

                    <pre className="text-sm whitespace-pre-wrap">
                      {
                        problem.sampleTestCase2
                          .expectedOutput
                      }
                    </pre>
                  </div>

                  {problem.sampleTestCase2Explaination && (
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        Explanation:
                      </p>

                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {
                          problem.sampleTestCase2Explaination
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {problem.tags?.length > 0 && (
              <div className="mb-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setShowTags(!showTags)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Tags
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition-transform text-slate-400',
                      showTags && 'rotate-180'
                    )}
                  />
                </button>

                {showTags && (
                  <div className="p-4 flex flex-wrap gap-2 bg-white dark:bg-slate-900">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hints */}
            {(problem.hint1 || problem.hint2) && (
              <div className="mb-8 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setShowHints(!showHints)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Hints
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition-transform text-slate-400',
                      showHints && 'rotate-180'
                    )}
                  />
                </button>

                {showHints && (
                  <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                    {problem.hint1 && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-4 text-sm text-indigo-700 dark:text-indigo-300">
                        {problem.hint1}
                      </div>
                    )}

                    {problem.hint2 && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl p-4 text-sm text-indigo-700 dark:text-indigo-300">
                        {problem.hint2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE */}
        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative group">
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Terminal
                      size={12}
                      className="text-indigo-500"
                    />
                    {fileNames[language]}
                  </div>

                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(
                          e.target.value as
                            | 'cpp'
                            | 'python'
                            | 'java'
                        )
                      }
                      className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="cpp">C++</option>
                      <option value="python">
                        Python
                      </option>
                      <option value="java">Java</option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
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

            {/* EDITOR */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={monacoLanguages[language]}
                theme="vs-dark"
                value={code}
                onChange={(val) =>
                  setCode(val || '')
                }
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  fontFamily: 'JetBrains Mono',
                  cursorSmoothCaretAnimation:
                    'on',
                  smoothScrolling: true,
                  padding: { top: 20 },
                }}
              />
            </div>

            {/* ACTION BAR */}
            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                Console
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={runningCode}
                  className="flex items-center gap-2 px-6 py-2 text-xs font-bold border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {runningCode ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Play size={14} />
                  )}

                  {runningCode
                    ? 'Running...'
                    : 'Run Code'}
                </button>

                <button className="flex items-center gap-2 px-6 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                  <Send size={14} />
                  Submit
                </button>
              </div>
            </div>

            {/* RESULTS */}
            {runResults.length > 0 && (
              <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-4 max-h-72 overflow-y-auto">
                {runResults.map(
                  (result, index) => (
                    <div
                      key={result.testCaseId}
                      className="rounded-xl border border-slate-800 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                        <p className="text-xs font-semibold text-slate-300">
                          Testcase {index + 1}
                        </p>

                        <span
                          className={cn(
                            'text-xs font-bold',
                            result.passed
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          )}
                        >
                          {result.passed
                            ? 'Passed'
                            : 'Failed'}
                        </span>
                      </div>

                      <div className="p-4 space-y-3 text-xs">
                        <div>
                          <p className="text-slate-500 mb-1">
                            Input
                          </p>

                          <pre className="text-slate-200 whitespace-pre-wrap">
                            {result.input}
                          </pre>
                        </div>

                        <div>
                          <p className="text-slate-500 mb-1">
                            Expected Output
                          </p>

                          <pre className="text-slate-200 whitespace-pre-wrap">
                            {
                              result.expectedOutput
                            }
                          </pre>
                        </div>

                        <div>
                          <p className="text-slate-500 mb-1">
                            Your Output
                          </p>

                          <pre
                            className={cn(
                              'whitespace-pre-wrap',
                              result.passed
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            )}
                          >
                            {result.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}