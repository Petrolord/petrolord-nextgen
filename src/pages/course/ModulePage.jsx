import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getManifest, estMinutes } from '@/lib/courseContent';
import { useCourse, moduleState } from '@/components/course/useCourse';
import LockedCard from '@/components/course/LockedCard';

// One module's lesson list with read state and the quiz call-to-action.
const ModulePage = () => {
  const { appSlug, tier, moduleKey } = useParams();
  const { progress } = useCourse(appSlug, tier);

  const manifest = getManifest(appSlug, tier);
  const base = `/dashboard/apps/${appSlug}/course/${tier}`;
  const modIndex = (manifest?.modules || []).findIndex((m) => m.key === moduleKey);
  const mod = modIndex >= 0 ? manifest.modules[modIndex] : null;
  const st = moduleState(progress, moduleKey);
  const readSet = useMemo(() => new Set(st.lesson_keys_read || []), [st.lesson_keys_read]);

  if (!manifest || !mod) {
    return <LockedCard title="Module not found" backTo={base} />;
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

  const allRead = mod.lessons.every((l) => readSet.has(l.key));

  return (
    <>
      <Helmet><title>{mod.title} - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Link to={base} className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Course home
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-white">Module {modIndex + 1}: {mod.title}</h1>
          <p className="text-gray-400 mt-1">
            {mod.lessons.length} lessons, about {estMinutes(mod.lessons)} minutes. Read them in order; the module closes with a quiz.
          </p>
        </div>

        <div className="space-y-3">
          {mod.lessons.map((l, li) => (
            <Link key={l.key} to={`${base}/${mod.key}/${l.key}`} className="block">
              <Card className="bg-[#1E293B] border-gray-700 hover:border-[#BFFF00]/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {readSet.has(l.key)
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      : <BookOpen className="h-5 w-5 text-gray-500 shrink-0" />}
                    <p className="text-white text-sm font-medium mb-0">{li + 1}. {l.title}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5" /> ~{l.est_minutes} min
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className={`bg-[#1E293B] border-gray-700 ${!allRead && !st.quiz_passed ? 'opacity-70' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              {st.quiz_passed
                ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                : <FileQuestion className="h-5 w-5 text-[#BFFF00]" />}
              Module quiz
            </CardTitle>
            <CardDescription>A randomized set from this module's question bank. Opens once every lesson is read.</CardDescription>
          </CardHeader>
          <CardContent>
            {st.quiz_passed ? (
              <p className="text-emerald-300 text-sm mb-0">Passed.</p>
            ) : allRead ? (
              <Link to={`${base}/quiz/${mod.key}`}>
                <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                  Take the quiz
                </Button>
              </Link>
            ) : (
              <p className="text-xs text-gray-500 mb-0">Read all the lessons first.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ModulePage;
