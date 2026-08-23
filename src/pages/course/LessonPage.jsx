import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getManifest, loadLesson, adjacentLessons } from '@/lib/courseContent';
import { markLessonRead } from '@/services/academyService';
import { useCourse, moduleState } from '@/components/course/useCourse';
import MarkdownLesson from '@/components/course/MarkdownLesson';
import LockedCard from '@/components/course/LockedCard';

// One lesson. The prose ships in the bundle (deliberately non-secret);
// what matters is the mark-read RPC, which the server refuses for locked
// modules, non-enrolled users and unknown keys.
const LessonPage = () => {
  const { appSlug, tier, moduleKey, lessonKey } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { progress, refresh } = useCourse(appSlug, tier);
  const [raw, setRaw] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [marking, setMarking] = useState(false);

  const manifest = getManifest(appSlug, tier);
  const base = `/dashboard/apps/${appSlug}/course/${tier}`;

  const mod = useMemo(
    () => (manifest?.modules || []).find((m) => m.key === moduleKey) || null,
    [manifest, moduleKey],
  );
  const lesson = useMemo(
    () => (mod?.lessons || []).find((l) => l.key === lessonKey) || null,
    [mod, lessonKey],
  );
  const { prev, next } = useMemo(
    () => (manifest ? adjacentLessons(manifest, moduleKey, lessonKey) : { prev: null, next: null }),
    [manifest, moduleKey, lessonKey],
  );

  useEffect(() => {
    let cancelled = false;
    setRaw(null);
    setLoadError(null);
    if (!manifest || !lesson) return undefined;
    loadLesson(appSlug, tier, moduleKey, lessonKey)
      .then((r) => { if (!cancelled) setRaw(r); })
      .catch((e) => { if (!cancelled) setLoadError(e.message); });
    return () => { cancelled = true; };
  }, [appSlug, tier, moduleKey, lessonKey, manifest, lesson]);

  const st = moduleState(progress, moduleKey);
  const alreadyRead = (st.lesson_keys_read || []).includes(lessonKey);

  const markAndContinue = useCallback(async () => {
    setMarking(true);
    try {
      const res = await markLessonRead(appSlug, tier, moduleKey, lessonKey);
      refresh();
      const lessonsDone = res && res.lessons_read === res.lessons_total;
      if (lessonsDone && !st.quiz_passed) {
        navigate(`${base}/quiz/${moduleKey}`);
      } else if (next && next.moduleKey === moduleKey) {
        navigate(`${base}/${next.moduleKey}/${next.key}`);
      } else {
        navigate(base);
      }
    } catch (e) {
      toast({ title: 'Could not record progress', description: e.message, variant: 'destructive' });
    } finally {
      setMarking(false);
    }
  }, [appSlug, tier, moduleKey, lessonKey, refresh, navigate, base, next, st.quiz_passed, toast]);

  if (!manifest || !mod || !lesson) {
    return <LockedCard title="Lesson not found" backTo={base} />;
  }
  if (progress && !st.unlocked) {
    return (
      <LockedCard
        title="This module is locked"
        note="Finish the previous module (all lessons plus its quiz) to open it."
        backTo={base}
      />
    );
  }

  const flatIndex = (mod.lessons || []).findIndex((l) => l.key === lessonKey);

  return (
    <>
      <Helmet><title>{lesson.title} - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to={base} className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Course home
          </Link>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> ~{lesson.est_minutes} min
            {alreadyRead && (
              <span className="text-emerald-400 flex items-center gap-1 ml-2">
                <CheckCircle2 className="h-3.5 w-3.5" /> read
              </span>
            )}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{mod.title}</p>
          <h1 className="text-2xl font-bold text-white">
            Lesson {flatIndex + 1}: {lesson.title}
          </h1>
        </div>

        {loadError ? (
          <p className="text-red-300">{loadError}</p>
        ) : raw === null ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
          </div>
        ) : (
          <MarkdownLesson raw={raw} app={appSlug} tier={tier} moduleKey={moduleKey} />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-700 pt-4">
          {prev ? (
            <Link to={`${base}/${prev.moduleKey}/${prev.key}`}>
              <Button variant="outline" className="border-gray-600 text-gray-200">
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
            </Link>
          ) : <span />}
          <Button
            onClick={markAndContinue}
            disabled={marking || raw === null}
            className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
          >
            {marking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {alreadyRead ? 'Continue' : 'Mark as read and continue'}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default LessonPage;
