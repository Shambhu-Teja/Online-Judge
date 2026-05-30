import { useState, useEffect } from 'react';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

type Difficulty =
  | 'Easy'
  | 'Medium'
  | 'Hard';

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

interface Submission {
  _id: string;
  language: string;
  status: string;
  executionTime: number;
  memoryUsed: number;
  totalTestCases: number;
  passedTestCases: number;
  createdAt: string;
}

function SubmissionRow({
  submission,
  problemId,
}: {
  submission: Submission;
  problemId: string;
}) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'Accepted' ? 'text-emerald-400' : 'text-red-400';
  };

  const languageEmoji = {
    python: '🐍',
    cpp: '⚙️',
    java: '☕',
  }[submission.language.toLowerCase()] || '📄';

  return (
    <button
      onClick={() => navigate(`/problems/${problemId}/submissions/${submission._id}`)}
      className="w-full grid grid-cols-7 gap-2 px-4 py-3 text-sm bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-700"
    >
      <div className="text-slate-300 flex items-center gap-1">
        <span>{languageEmoji}</span>
        {submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}
      </div>
      <div className={cn('font-semibold', getStatusColor(submission.status))}>
        {submission.status}
      </div>
      <div className="text-slate-400">{submission.executionTime}</div>
      <div className="text-slate-400">{Math.round(submission.memoryUsed)}</div>
      <div className="text-slate-400">
        {submission.passedTestCases}/{submission.totalTestCases}
      </div>
      <div className="text-slate-400 text-xs">{formatDate(submission.createdAt)}</div>
      <div className="text-right">
        <ChevronDown size={16} className="text-slate-500 rotate-[-90deg]" />
      </div>
    </button>
  );
}

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState<'description' | 'submissions'>('description');

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loadingSubmissions, setLoadingSubmissions] =
    useState(false);

  const [language, setLanguage] =
    useState<
      'cpp' | 'python' | 'java'
    >('python');

  const [runningCode, setRunningCode] =
    useState(false);

  const [
    submittingCode,
    setSubmittingCode,
  ] = useState(false);

  const [runResults, setRunResults] =
    useState<any[]>([]);

  const [submission, setSubmission] =
    useState<any>(null);

  const [
    selectedTestCase,
    setSelectedTestCase,
  ] = useState(0);

  const [
    activeBottomTab,
    setActiveBottomTab,
  ] = useState<'run' | 'submit'>(
    'run'
  );

  const [showTags, setShowTags] =
    useState(false);

  const [showHints, setShowHints] =
    useState(false);

  // AI CODE REVIEW STATES
  const [loadingAIReview, setLoadingAIReview] =
    useState(false);

  const [aiReview, setAiReview] =
    useState<string | null>(null);

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  // CUSTOM INPUT STATES
  const [customInput, setCustomInput] =
    useState('');

  const [
    useCustomInput,
    setUseCustomInput,
  ] = useState(false);

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

  const [code, setCode] =
    useState('');

  useEffect(() => {
    setLoading(true);

    fetch(
      `${API_BASE_URL}/api/problem/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'token'
          )}`,
        },
      }
    )
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

  const fetchSubmissions = async () => {
    if (!problem) return;
    try {
      setLoadingSubmissions(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch(
        `${API_BASE_URL}/api/problem/getSubmissions?userId=${userId}&problemId=${problem._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSubmissionsTabClick = () => {
    setActiveTab('submissions');
    if (submissions.length === 0) {
      fetchSubmissions();
    }
  };

  const handleRunCode =
    async () => {
      try {
        if (!problem) return;

        setRunningCode(true);

        const response =
          await fetch(
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
                problemId:
                  problem._id,

                customInputTestCase:
                  useCustomInput &&
                  customInput.trim()
                    ? {
                        input:
                          customInput,
                      }
                    : undefined,
              }),
            }
          );

        const data =
          await response.json();

        setRunResults(
          data.results || []
        );

        setSelectedTestCase(0);

        setActiveBottomTab('run');
      } catch (error) {
        console.error(error);
      } finally {
        setRunningCode(false);
      }
    };

  const handleSubmitCode =
    async () => {
      try {
        if (!problem) return;

        setSubmittingCode(true);

        const response =
          await fetch(
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
                problemId:
                  problem._id,
                userId:
                  localStorage.getItem(
                    'userId'
                  ),
              }),
            }
          );

        const data =
          await response.json();

        setSubmission(
          data.submission
        );

        setSelectedTestCase(0);

        setActiveBottomTab(
          'submit'
        );
      } catch (error) {
        console.error(error);
      } finally {
        setSubmittingCode(false);
      }
    };

  const handleAICodeReview = async () => {
    try {
      if (!problem || !code) return;

      setLoadingAIReview(true);

      const response = await fetch(
        `${API_BASE_URL}/api/problem/aiCodeReview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            problemId: problem._id,
            code,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAiReview(data.review);
        setShowReviewModal(true);
      }
    } catch (error) {
      console.error('Error getting AI review:', error);
    } finally {
      setLoadingAIReview(false);
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
    currentResults.every(
      (r: any) => r.passed
    );

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

        <div className="w-1/2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {/* TABS */}
          <div className="flex border-b border-slate-800 bg-slate-800/50">
            <button
              onClick={() => setActiveTab('description')}
              className={cn(
                'flex-1 px-4 py-3 font-semibold transition-all border-b-2',
                activeTab === 'description'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              )}
            >
              Problem Description
            </button>
            <button
              onClick={handleSubmissionsTabClick}
              className={cn(
                'flex-1 px-4 py-3 font-semibold transition-all border-b-2',
                activeTab === 'submissions'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              )}
            >
              Your Submissions
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'description' ? (
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
                        problem
                          .sampleTestCase1
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
                        problem
                          .sampleTestCase1
                          .expectedOutput
                      }
                    </pre>
                  </div>

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
                        problem
                          .sampleTestCase2
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
                        problem
                          .sampleTestCase2
                          .expectedOutput
                      }
                    </pre>
                  </div>

                </div>
              </div>
            )}
              </div>
            ) : (
              // SUBMISSIONS TAB
              <div className="p-6">
                {loadingSubmissions ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center text-slate-400 py-12">
                    <p>No submissions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-7 gap-2 text-xs text-slate-400 font-semibold mb-4 pb-3 border-b border-slate-800">
                      <div>Language</div>
                      <div>Status</div>
                      <div>Time (ms)</div>
                      <div>Memory (KB)</div>
                      <div>Passed</div>
                      <div>Submitted</div>
                      <div></div>
                    </div>
                    {submissions.map((submission) => (
                      <SubmissionRow
                        key={submission._id}
                        submission={submission}
                        problemId={problem._id}
                      />
                    ))}
                  </div>
                )}
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

        <option value="cpp">
          C++
        </option>

        <option value="java">
          Java
        </option>
      </select>

      <button
        onClick={handleAICodeReview}
        disabled={loadingAIReview || !code}
        className={cn(
          'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2',
          loadingAIReview
            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 cursor-not-allowed'
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
        )}
      >
        {loadingAIReview ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            Reviewing...
          </>
        ) : (
          '✨ AI Review'
        )}
      </button>
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

  <div className="flex-1 min-h-0">
    <Editor
      height="100%"
      language={
        monacoLanguages[language]
      }
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

  {/* CUSTOM INPUT PANEL */}

  <div className="border-t border-slate-800 bg-[#0f1117] shrink-0">

    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">

      <div className="flex items-center gap-3">

        <h3 className="text-sm font-semibold text-white">
          Testcase
        </h3>

        <button
          onClick={() =>
            setUseCustomInput(
              !useCustomInput
            )
          }
          className={cn(
            'px-3 py-1 rounded-lg text-xs border transition-all',
            useCustomInput
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          )}
        >
          {useCustomInput
            ? 'Custom Input ON'
            : 'Custom Input OFF'}
        </button>
      </div>
    </div>

    {useCustomInput && (
      <div className="p-4">

        <textarea
          value={customInput}
          onChange={(e) =>
            setCustomInput(
              e.target.value
            )
          }
          placeholder={`Enter custom testcase

Example:
2 7 11 15
9`}
          className="
            w-full
            h-24
            resize-none
            rounded-xl
            bg-slate-900
            border border-slate-800
            p-4
            text-sm
            text-slate-200
            outline-none
            focus:border-indigo-500
            font-mono
          "
        />
      </div>
    )}
  </div>

  {/* ACTION BAR */}

  <div className="border-t border-slate-800 px-4 py-3 flex justify-end gap-3 shrink-0">

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

  {/* RUN RESULTS */}

  {runResults.length > 0 &&
    activeBottomTab ===
      'run' && (

      <div className="h-[38%] border-t border-slate-800 bg-[#0f1117] flex flex-col overflow-hidden">

        {/* HEADER */}

        <div className="px-5 py-4 border-b border-slate-800 shrink-0">

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

        <div className="flex gap-2 px-4 pt-4 overflow-x-auto shrink-0">

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
                {result.testCaseId ===
                'custom'
                  ? 'Custom'
                  : `Case ${
                      index + 1
                    }`}
              </button>
            )
          )}
        </div>

        {/* DETAILS */}

        <div className="flex-1 overflow-y-auto p-4 min-h-0">

          {runResults[
            selectedTestCase
          ] && (

            <div className="space-y-5">

              {/* INPUT */}

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

              {/* OUTPUT */}

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

              {/* EXPECTED */}

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

      {/* AI REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-2xl">✨</div>
                <h2 className="text-xl font-bold text-white">AI Code Review</h2>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-white transition-all text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {aiReview}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}