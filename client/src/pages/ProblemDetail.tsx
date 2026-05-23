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
  CheckCircle2,
  XCircle,
  Clock3,
  MemoryStick,
} from 'lucide-react';

import Editor from '@monaco-editor/react';
import Navbar from '@/src/components/Navbar';
import { cn } from '@/src/lib/utils';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [language, setLanguage] =
    useState<'cpp' | 'python' | 'java'>(
      'python'
    );

  const [runningCode, setRunningCode] =
    useState(false);

  const [submittingCode, setSubmittingCode] =
    useState(false);

  const [runResults, setRunResults] =
    useState<any[]>([]);

  const [submission, setSubmission] =
    useState<any>(null);

  const [selectedTestCase, setSelectedTestCase] =
    useState(0);

  const [activeBottomTab, setActiveBottomTab] =
    useState<'run' | 'submit'>('run');

  const [showTags, setShowTags] =
    useState(false);

  const [showHints, setShowHints] =
    useState(false);

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

  const [code, setCode] = useState('');

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/api/problem/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          'token'
        )}`,
      },
    })
      .then((res) => res.json())
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
        `${API_BASE_URL}/api/problem/runCode`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
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
      setSelectedTestCase(0);
      setActiveBottomTab('run');
    } catch (error) {
      console.error(error);
    } finally {
      setRunningCode(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      if (!problem) return;

      setSubmittingCode(true);

      const response = await fetch(
        `${API_BASE_URL}/api/problem/submitCode`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${localStorage.getItem(
              'token'
            )}`,
          },
          body: JSON.stringify({
            code,
            language,
            problemId: problem._id,
            userId:
              localStorage.getItem('userId'),
          }),
        }
      );

      const data = await response.json();

      setSubmission(data.submission);
      setSelectedTestCase(0);
      setActiveBottomTab('submit');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2
          className="animate-spin text-indigo-500"
          size={40}
        />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Problem not found
      </div>
    );
  }

  const currentResults =
    activeBottomTab === 'run'
      ? runResults
      : submission?.results || [];

  const allPassed =
    currentResults.length > 0 &&
    currentResults.every((r: any) => r.passed);

  const getDifficultyColor = (
    difficulty: Difficulty
  ) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-400';

      case 'Medium':
        return 'text-yellow-400';

      case 'Hard':
        return 'text-red-400';

      default:
        return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT PANEL */}
        <div className="w-1/2 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto">
          {/* PROBLEM DETAILS */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              {problem.title}
            </h1>

            <div className="flex items-center gap-3 mb-8">
              <span
                className={cn(
                  'font-semibold text-sm',
                  getDifficultyColor(
                    problem.difficulty
                  )
                )}
              >
                {problem.difficulty}
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">
                Description
              </h2>

              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* CONSTRAINTS */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-3">
                Constraints
              </h2>

              <pre className="bg-slate-800 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
                {problem.constraints}
              </pre>
            </div>

            {/* EXAMPLE 1 */}
            {problem.sampleTestCase1 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Example 1
                </h2>

                <div className="bg-slate-800 rounded-xl p-4 space-y-4 border border-slate-700">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-2">
                      Input
                    </p>

                    <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                      {
                        problem.sampleTestCase1
                          .input
                      }
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-2">
                      Output
                    </p>

                    <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                      {
                        problem.sampleTestCase1
                          .expectedOutput
                      }
                    </pre>
                  </div>

                  {problem.sampleTestCase1Explaination && (
                    <div>
                      <p className="text-sm font-semibold text-slate-400 mb-2">
                        Explanation
                      </p>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {
                          problem.sampleTestCase1Explaination
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXAMPLE 2 */}
            {problem.sampleTestCase2 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Example 2
                </h2>

                <div className="bg-slate-800 rounded-xl p-4 space-y-4 border border-slate-700">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-2">
                      Input
                    </p>

                    <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                      {
                        problem.sampleTestCase2
                          .input
                      }
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-2">
                      Output
                    </p>

                    <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                      {
                        problem.sampleTestCase2
                          .expectedOutput
                      }
                    </pre>
                  </div>

                  {problem.sampleTestCase2Explaination && (
                    <div>
                      <p className="text-sm font-semibold text-slate-400 mb-2">
                        Explanation
                      </p>

                      <p className="text-sm text-slate-300 leading-relaxed">
                        {
                          problem.sampleTestCase2Explaination
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAGS */}
            {problem.tags?.length > 0 && (
              <div className="mb-5 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setShowTags(!showTags)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 transition-all"
                >
                  <span className="text-sm font-semibold text-slate-200">
                    Tags
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-slate-400 transition-transform',
                      showTags && 'rotate-180'
                    )}
                  />
                </button>

                {showTags && (
                  <div className="p-4 flex flex-wrap gap-2 bg-slate-900">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HINTS */}
            {(problem.hint1 ||
              problem.hint2) && (
              <div className="mb-8 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setShowHints(!showHints)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 transition-all"
                >
                  <span className="text-sm font-semibold text-slate-200">
                    Hints
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-slate-400 transition-transform',
                      showHints && 'rotate-180'
                    )}
                  />
                </button>

                {showHints && (
                  <div className="p-4 space-y-3 bg-slate-900">
                    {problem.hint1 && (
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
                        {problem.hint1}
                      </div>
                    )}

                    {problem.hint2 && (
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
                        {problem.hint2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SUBMISSION RESULT PANEL */}
            {submission &&
              activeBottomTab ===
                'submit' && (
                <div className="mt-10 border border-slate-800 rounded-2xl overflow-hidden bg-[#0f1117]">
                  {/* HEADER */}
                  <div className="px-5 py-4 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {submission.status ===
                        'Accepted' ? (
                          <CheckCircle2 className="text-emerald-400" />
                        ) : (
                          <XCircle className="text-red-400" />
                        )}

                        <div>
                          <h2
                            className={cn(
                              'text-xl font-bold',
                              submission.status ===
                                'Accepted'
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            )}
                          >
                            {submission.status}
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              submission.passedTestCases
                            }
                            /
                            {
                              submission.totalTestCases
                            }{' '}
                            testcases passed
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <Clock3 size={15} />
                          {
                            submission.executionTime
                          }{' '}
                          ms
                        </div>

                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                          <MemoryStick size={15} />
                          {submission.memoryUsed?.toFixed(
                            2
                          )}{' '}
                          KB
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CASES */}
                  <div className="p-5 space-y-4">
                    {submission.results.map(
                      (
                        result: any,
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="border border-slate-800 rounded-xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-900">
                            <div className="flex items-center gap-3">
                              {result.passed ? (
                                <CheckCircle2
                                  size={18}
                                  className="text-emerald-400"
                                />
                              ) : (
                                <XCircle
                                  size={18}
                                  className="text-red-400"
                                />
                              )}

                              <span className="text-sm font-semibold text-white">
                                Testcase{' '}
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span>
                                {
                                  result.executionTime
                                }{' '}
                                ms
                              </span>

                              <span>
                                {result.memoryUsed?.toFixed(
                                  2
                                )}{' '}
                                KB
                              </span>
                            </div>
                          </div>

                          <div className="p-4 bg-[#11151d] space-y-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-2">
                                Input
                              </p>

                              <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                                {result.input}
                              </pre>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500 mb-2">
                                Output
                              </p>

                              <pre
                                className={cn(
                                  'text-sm whitespace-pre-wrap',
                                  result.passed
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                                )}
                              >
                                {result.output}
                              </pre>
                            </div>

                            {!result.passed && (
                              <div>
                                <p className="text-xs text-slate-500 mb-2">
                                  Expected
                                </p>

                                <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                                  {
                                    result.expectedOutput
                                  }
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* TOPBAR */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              <div className="h-4 w-px bg-slate-700" />

              <Terminal
                size={14}
                className="text-indigo-500"
              />

              <span className="text-xs text-slate-400 font-bold uppercase">
                {fileNames[language]}
              </span>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value as any
                  )
                }
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white outline-none"
              >
                <option value="python">
                  Python
                </option>

                <option value="cpp">C++</option>

                <option value="java">Java</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-white">
                <Maximize2 size={14} />
              </button>

              <button className="p-2 text-slate-400 hover:text-white">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* EDITOR */}
          <div className="h-[55%]">
            <Editor
              height="100%"
              language={monacoLanguages[language]}
              theme="vs-dark"
              value={code}
              onChange={(val) =>
                setCode(val || '')
              }
              options={{
                minimap: {
                  enabled: false,
                },
                fontSize: 14,
                fontFamily:
                  'JetBrains Mono',
                smoothScrolling: true,
                padding: {
                  top: 16,
                },
              }}
            />
          </div>

          {/* ACTION BAR */}
          <div className="border-t border-slate-800 px-4 py-3 flex justify-end gap-3">
            <button
              onClick={handleRunCode}
              disabled={runningCode}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
            >
              {runningCode ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Play size={14} />
              )}

              Run
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={submittingCode}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
            >
              {submittingCode ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Send size={14} />
              )}

              Submit
            </button>
          </div>

          {/* RUN RESULTS ONLY */}
          {runResults.length > 0 &&
            activeBottomTab === 'run' && (
              <div className="flex-1 border-t border-slate-800 bg-[#0f1117] flex flex-col overflow-hidden">
                {/* HEADER */}
                <div className="px-5 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    {allPassed ? (
                      <CheckCircle2 className="text-emerald-400" />
                    ) : (
                      <XCircle className="text-red-400" />
                    )}

                    <div>
                      <h2
                        className={cn(
                          'text-lg font-semibold',
                          allPassed
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        )}
                      >
                        {allPassed
                          ? 'Accepted'
                          : 'Wrong Answer'}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        {
                          runResults.filter(
                            (r: any) =>
                              r.passed
                          ).length
                        }
                        /{runResults.length}{' '}
                        testcases passed
                      </p>
                    </div>
                  </div>
                </div>

                {/* CASE TABS */}
                <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
                  {runResults.map(
                    (
                      result: any,
                      index: number
                    ) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedTestCase(
                            index
                          )
                        }
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap transition-all',
                          selectedTestCase ===
                            index
                            ? result.passed
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        )}
                      >
                        Case {index + 1}
                      </button>
                    )
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 overflow-y-auto p-4">
                  {runResults[
                    selectedTestCase
                  ] && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Input
                        </p>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                          <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                            {
                              runResults[
                                selectedTestCase
                              ].input
                            }
                          </pre>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Output
                        </p>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                          <pre
                            className={cn(
                              'text-sm whitespace-pre-wrap',
                              runResults[
                                selectedTestCase
                              ].passed
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            )}
                          >
                            {
                              runResults[
                                selectedTestCase
                              ].output
                            }
                          </pre>
                        </div>
                      </div>

                      {!runResults[
                        selectedTestCase
                      ].passed && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">
                            Expected
                          </p>

                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <pre className="text-sm text-slate-200 whitespace-pre-wrap">
                              {
                                runResults[
                                  selectedTestCase
                                ]
                                  .expectedOutput
                              }
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}