import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import Navbar from '@/src/components/Navbar';
import { cn } from '@/src/lib/utils';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  output: string;
  executionTime: number;
  memoryUsed: number;
  _id: string;
}

interface SubmissionData {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: string;
  totalTestCases: number;
  passedTestCases: number;
  executionTime: number;
  memoryUsed: number;
  results: TestResult[];
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionDetail() {
  const { problemId, submissionId } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState<SubmissionData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedTestCase, setSelectedTestCase] =
    useState(0);

  useEffect(() => {
    setLoading(true);

    fetch(
      `${API_BASE_URL}/api/problem/submissions/${submissionId}`,
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
        if (data.success) {
          setSubmission(data.submission);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [submissionId]);

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

  if (!submission) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Submission not found
      </div>
    );
  }

  const allPassed = submission.results.every(
    (r: TestResult) => r.passed
  );

  const monacoLanguages = {
    cpp: 'cpp',
    python: 'python',
    java: 'java',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT PANEL - CODE */}
        <div className="w-1/2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/problems/${problemId}`)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-all"
              >
                <ArrowLeft size={18} className="text-slate-400" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Submission Details
                </h2>
                <p className="text-xs text-slate-400">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  {allPassed ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  <span
                    className={cn(
                      'font-semibold text-sm',
                      allPassed
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    )}
                  >
                    {submission.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {submission.passedTestCases}/
                  {submission.totalTestCases} Passed
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="flex gap-6 px-4 py-3 border-b border-slate-800 text-xs text-slate-300 shrink-0">
            <div>
              <p className="text-slate-500">Language</p>
              <p className="font-semibold capitalize">
                {submission.language}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Time</p>
              <p className="font-semibold">
                {submission.executionTime} ms
              </p>
            </div>
            <div>
              <p className="text-slate-500">Memory</p>
              <p className="font-semibold">
                {Math.round(submission.memoryUsed)} KB
              </p>
            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={
                monacoLanguages[
                  submission.language as keyof typeof monacoLanguages
                ] || 'python'
              }
              theme="vs-dark"
              value={submission.code}
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                smoothScrolling: true,
                padding: {
                  top: 16,
                },
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL - TEST RESULTS */}
        <div className="w-1/2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {/* TABS */}
          <div className="flex gap-2 px-4 py-3 border-b border-slate-800 overflow-x-auto shrink-0">
            {submission.results.map(
              (result: TestResult, index: number) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedTestCase(index)
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

          {/* RESULTS DETAILS */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {submission.results[
              selectedTestCase
            ] && (
              <div className="space-y-5">
                {/* STATUS */}
                <div className="flex items-center gap-3">
                  {submission.results[
                    selectedTestCase
                  ].passed ? (
                    <CheckCircle2 className="text-emerald-400" />
                  ) : (
                    <XCircle className="text-red-400" />
                  )}
                  <div>
                    <h3
                      className={cn(
                        'font-semibold',
                        submission.results[
                          selectedTestCase
                        ].passed
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      )}
                    >
                      {submission.results[
                        selectedTestCase
                      ].passed
                        ? 'Passed'
                        : 'Failed'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {submission.results[
                        selectedTestCase
                      ].executionTime}{' '}
                      ms | Memory:{' '}
                      {Math.round(
                        submission.results[
                          selectedTestCase
                        ].memoryUsed
                      )}{' '}
                      KB
                    </p>
                  </div>
                </div>

                {/* INPUT */}
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-semibold">
                    Input
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">
                      {
                        submission.results[
                          selectedTestCase
                        ].input
                      }
                    </pre>
                  </div>
                </div>

                {/* OUTPUT */}
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-semibold">
                    Your Output
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <pre
                      className={cn(
                        'text-sm whitespace-pre-wrap font-mono',
                        submission.results[
                          selectedTestCase
                        ].passed
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      )}
                    >
                      {
                        submission.results[
                          selectedTestCase
                        ].output
                      }
                    </pre>
                  </div>
                </div>

                {/* EXPECTED */}
                {!submission.results[
                  selectedTestCase
                ].passed && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2 font-semibold">
                      Expected Output
                    </p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">
                        {
                          submission.results[
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
      </div>
    </div>
  );
}
