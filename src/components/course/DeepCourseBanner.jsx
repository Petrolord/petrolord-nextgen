import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hasDeepCourse, getManifest, flatLessons, estMinutes } from '@/lib/courseContent';

// Steers learners from an app's Learning Mode page to its full deep
// course. Renders nothing until the (app, tier) has authored content, so
// wiring it in ahead of the content is inert.
const DeepCourseBanner = ({ app, tier }) => {
  if (!hasDeepCourse(app, tier)) return null;
  const manifest = getManifest(app, tier);
  const lessons = flatLessons(manifest);
  const hours = Math.round(estMinutes(lessons) / 60);
  return (
    <Card className="bg-[#1E293B] border-[#BFFF00]/40">
      <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-[#BFFF00] shrink-0" />
          <p className="text-gray-300 text-sm mb-0">
            The full course is open: {manifest.modules.length} modules, {lessons.length} lessons,
            about {hours} hours of study, with module quizzes and a final exam before the capstone.
          </p>
        </div>
        <Link to={`/dashboard/apps/${app}/course/${tier}`}>
          <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            Open the course <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default DeepCourseBanner;
