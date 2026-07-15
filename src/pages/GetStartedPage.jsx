import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, GraduationCap, ShieldCheck, BookOpen, Database, CheckCircle2,
  Compass, ClipboardList,
} from 'lucide-react';
import {
  getActivationStatus, completeOrientation, getEntryAssessment,
  submitEntryAssessment,
} from '@/services/academyService';

// N3.3 activation gate — a per-account, one-time flow: read the orientation,
// then take the short entry assessment. Clearing the gate is what lets
// academy_has_scope() resolve scope (server-side), unlocking Learning Mode.

const ORIENTATION_POINTS = [
  { icon: Compass, title: 'One account, four doors',
    body: 'Your personal email is your Academy account — it stays with you after graduation, along with your certificates and alumni standing. You enrol per course through whichever door fits (self, campus, sponsored, residency).' },
  { icon: BookOpen, title: 'Learn inside the real apps',
    body: 'Each course is a real Petrolord app. You start in Learning Mode against bundled teaching datasets, then earn working, advanced and full capability as you certify Associate → Professional → Expert.' },
  { icon: Database, title: 'Use only the provided datasets',
    body: 'In Learning Mode you work on the Academy’s teaching datasets — the same golden files your practicals are graded against. Uploading your own data unlocks once you reach the Associate tier.' },
  { icon: ShieldCheck, title: 'Two devices, honest work',
    body: 'Your account is limited to two registered devices, and sessions are monitored. Academic-integrity rules apply to every assessment and certificate.' },
];

const TIER_COPY = {
  beginner: 'We recommend starting at the Beginner tier.',
  intermediate: 'Nice — you can consider starting at the Intermediate tier.',
  advanced: 'Strong result — the Advanced tier is within reach.',
};

const GetStartedPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const load = async () => {
    try {
      const s = await getActivationStatus();
      setStatus(s);
      if (!s.assessment_taken) {
        const qs = await getEntryAssessment();
        setQuestions(qs);
      }
    } catch (e) {
      toast({ title: 'Could not load Get Started', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status?.activated) {
      const t = setTimeout(() => navigate('/dashboard'), 1500);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  const handleOrientation = async () => {
    setBusy(true);
    try {
      const s = await completeOrientation();
      setStatus(s);
      if (!s.assessment_taken && questions.length === 0) {
        setQuestions(await getEntryAssessment());
      }
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      const res = await submitEntryAssessment(answers);
      setResult(res);
      setStatus(res);
      if (res.activated) {
        toast({
          title: 'You’re all set',
          description: 'Learning Mode is unlocked.',
          className: 'bg-[#BFFF00] text-slate-900',
        });
      } else if (res.retake_after) {
        toast({
          title: 'Not quite yet',
          description: 'Review the fundamentals and retake after the cooldown.',
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  const orientationDone = status?.orientation_completed;
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <>
      <Helmet><title>Get Started - Petrolord NextGen Academy</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-[#BFFF00]" /> Get started
          </h1>
          <p className="mt-1 text-gray-400">
            A quick orientation and a short placement assessment activate your account and unlock Learning Mode.
          </p>
        </div>

        {/* progress */}
        <div className="flex items-center gap-3 text-sm">
          <span className={`inline-flex items-center gap-1 ${orientationDone ? 'text-emerald-400' : 'text-[#BFFF00]'}`}>
            {orientationDone ? <CheckCircle2 className="h-4 w-4" /> : <Compass className="h-4 w-4" />} Orientation
          </span>
          <span className="text-gray-600">→</span>
          <span className={`inline-flex items-center gap-1 ${status?.assessment_taken ? 'text-emerald-400' : orientationDone ? 'text-[#BFFF00]' : 'text-gray-500'}`}>
            {status?.assessment_taken ? <CheckCircle2 className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />} Entry assessment
          </span>
          <span className="text-gray-600">→</span>
          <span className={`inline-flex items-center gap-1 ${status?.activated ? 'text-emerald-400' : 'text-gray-500'}`}>
            {status?.activated ? <CheckCircle2 className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />} Activated
          </span>
        </div>

        {status?.activated ? (
          <Card className="bg-[#1E293B] border-emerald-700">
            <CardContent className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-[#BFFF00] mx-auto" />
              <p className="text-white text-lg font-semibold">Your account is active.</p>
              <p className="text-gray-400 text-sm">Taking you to your dashboard…</p>
            </CardContent>
          </Card>
        ) : !orientationDone ? (
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Orientation</CardTitle>
              <CardDescription>How the Academy works — a one-minute read.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ORIENTATION_POINTS.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <p.icon className="h-5 w-5 text-[#BFFF00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{p.title}</p>
                    <p className="text-sm text-gray-400">{p.body}</p>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleOrientation} disabled={busy}
                className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
              >
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                I’ve read this — continue
              </Button>
            </CardContent>
          </Card>
        ) : result && !result.activated && result.retake_after ? (
          <Card className="bg-[#1E293B] border-yellow-700">
            <CardContent className="py-8 text-center space-y-2">
              <p className="text-white text-lg font-semibold">Score: {result.score}%</p>
              <p className="text-gray-400 text-sm">
                You can retake the assessment after {new Date(result.retake_after).toLocaleString()}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Entry assessment</CardTitle>
              <CardDescription>
                A short placement quiz. It helps us recommend a starting tier — answer as best you can.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q, qi) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-white font-medium">{qi + 1}. {q.prompt}</p>
                  <div className="grid gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi} type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                        className={`text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                          answers[q.id] === oi
                            ? 'bg-[#BFFF00]/10 border-[#BFFF00] text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                onClick={handleSubmit} disabled={busy || !allAnswered}
                className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
              >
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardList className="mr-2 h-4 w-4" />}
                Submit assessment
              </Button>
              {status?.recommended_tier && (
                <p className="text-sm text-gray-400">{TIER_COPY[status.recommended_tier]}</p>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </>
  );
};

export default GetStartedPage;
