import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Shared quiz/exam surface. The server owns everything that matters:
// question selection, the pinned open attempt, grading, pass thresholds
// and cooldowns. This component only renders what the RPCs return.
//
// fetchQuiz(): serves { locked, locked_until } or { attempt_id, questions }.
// submitQuiz(attemptId, answers): grades and returns the result payload.
const QuizRunner = ({ title, description, fetchQuiz, submitQuiz, onPassed, continueTo, continueLabel = 'Continue' }) => {
  const { toast } = useToast();
  const [state, setState] = useState({ phase: 'loading' });
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setState({ phase: 'loading' });
    setAnswers({});
    try {
      const res = await fetchQuiz();
      if (res.locked) {
        setState({ phase: 'locked', lockedUntil: res.locked_until });
      } else {
        setState({ phase: 'active', attemptId: res.attempt_id, questions: res.questions || [] });
      }
    } catch (e) {
      setState({ phase: 'error', message: e.message });
    }
  }, [fetchQuiz]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await submitQuiz(state.attemptId, answers);
      setState((s) => ({ ...s, phase: 'result', result: res }));
      if (res.passed && onPassed) onPassed(res);
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (state.phase === 'loading') {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" /></div>;
  }

  if (state.phase === 'error') {
    return (
      <Card className="bg-[#1E293B] border-gray-700 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center space-y-3">
          <XCircle className="h-8 w-8 text-red-400 mx-auto" />
          <p className="text-gray-300">{state.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'locked') {
    return (
      <Card className="bg-[#1E293B] border-gray-700 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center space-y-3">
          <Clock className="h-8 w-8 text-amber-400 mx-auto" />
          <p className="text-white font-medium">Attempts are on cooldown</p>
          <p className="text-gray-400 text-sm">
            Use the time to review the lessons. You can try again after{' '}
            <span className="text-gray-200">{state.lockedUntil ? new Date(state.lockedUntil).toLocaleString() : 'the cooldown ends'}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state.phase === 'result') {
    const r = state.result;
    return (
      <Card className="bg-[#1E293B] border-gray-700 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {r.passed ? (
            <>
              <p className="text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Passed with {r.score}/{r.max_score} ({r.pct}%, pass mark {r.pass_pct}%)
              </p>
              {(r.explanations || []).length > 0 && (
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Notes on the questions you just answered:</p>
                  {r.explanations.map((e) => (
                    <div key={e.id} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-300 text-sm">{e.prompt}</p>
                      <p className="text-gray-500 text-xs mt-1">{e.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
              {continueTo && (
                <Link to={continueTo}>
                  <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                    {continueLabel} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="text-red-300 font-medium flex items-center gap-2">
                <XCircle className="h-5 w-5" /> {r.score}/{r.max_score} ({r.pct}%). Pass mark is {r.pass_pct}%.
              </p>
              {r.locked_until ? (
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Attempts are on cooldown until {new Date(r.locked_until).toLocaleString()}. Review the lessons and come back.
                </p>
              ) : (
                <Button onClick={load} variant="outline" className="border-gray-600 text-gray-200">
                  <RotateCcw className="h-4 w-4 mr-1" /> Try again with a fresh set
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const total = state.questions.length;
  const answered = Object.keys(answers).length;

  return (
    <Card className="bg-[#1E293B] border-gray-700 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="pt-2">
          <Progress value={total ? (100 * answered) / total : 0} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{answered}/{total} answered</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {state.questions.map((q, qi) => (
          <div key={q.id} className="rounded-md border border-gray-700 bg-[#0F172A] p-4">
            <p className="text-white text-sm font-medium mb-3">{qi + 1}. {q.prompt}</p>
            <RadioGroup
              value={answers[q.id] !== undefined ? String(answers[q.id]) : undefined}
              onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
              className="space-y-2"
            >
              {(q.options || []).map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <RadioGroupItem value={String(oi)} id={`${q.id}-${oi}`} className="border-gray-500 text-[#BFFF00]" />
                  <Label htmlFor={`${q.id}-${oi}`} className="text-gray-300 text-sm font-normal cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button
          onClick={submit}
          disabled={submitting || answered < total}
          className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit for grading
        </Button>
        {answered < total && (
          <p className="text-xs text-gray-500">Answer every question to submit.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizRunner;
