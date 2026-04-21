import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { supabase } from '@/lib/customSupabaseClient';
import { 
    Loader2, 
    ChevronLeft, 
    CheckCircle2, 
    PlayCircle, 
    FileText, 
    Video, 
    Menu,
    AlertCircle,
    BrainCircuit,
    ListChecks,
    Target,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { courseService } from '@/services/courseService';
import VideoPlayer from '@/components/VideoPlayer';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-xl text-red-200 w-full mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            Video Player Error
          </h3>
          <p className="text-sm font-mono bg-black/40 p-3 rounded">{this.state.error?.message || "An unexpected error occurred rendering the video."}</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { course, courseStructure, progressMap, loading, error, markLessonComplete } = useCourseProgress(courseId);
    
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [completingLesson, setCompletingLesson] = useState(false);
    const [lessonUrlLoading, setLessonUrlLoading] = useState(false);
    
    const [requirements, setRequirements] = useState(null);
    const [reqLoading, setReqLoading] = useState(true);

    // Fetch requirements on mount
    useEffect(() => {
        const loadReqs = async () => {
            if(!courseId) return;
            try {
                const data = await courseService.getCourseRequirements(courseId);
                setRequirements(data);
            } catch (e) { 
                console.error("Failed to load course requirements", e);
            } finally {
                setReqLoading(false);
            }
        };
        loadReqs();
    }, [courseId]);

    // Set initial lesson
    useEffect(() => {
        if (!loading && courseStructure.length > 0 && !selectedLesson) {
            let found = false;
            for (const module of courseStructure) {
                for (const lesson of module.lessons) {
                    if (!progressMap[lesson.id]?.is_completed) {
                        handleLessonSelect(lesson);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
            if (!found && courseStructure[0]?.lessons?.length > 0) {
                handleLessonSelect(courseStructure[0].lessons[0]);
            }
        }
    }, [loading, courseStructure, progressMap, selectedLesson]);

    // Ensure we have the latest video_url and log it to verify
    useEffect(() => {
        const checkAndFetchVideoUrl = async () => {
            if (!selectedLesson) return;
            
            // Re-fetch lesson explicitly requesting video_url to guarantee it is present
            if (selectedLesson.lesson_type === 'video' || !selectedLesson.video_url) {
                setLessonUrlLoading(true);
                try {
                    const { data, error: fetchError } = await supabase
                        .from('course_lessons')
                        .select('id, title, description, lesson_order, video_url, lesson_type, content')
                        .eq('id', selectedLesson.id)
                        .single();
                        
                    if (data && !fetchError) {
                        console.log(`[CourseDetailPage] Fetched fresh lesson data:`, { id: data.id, video_url: data.video_url });
                        // Only update state if data differs to prevent infinite loops
                        if (data.video_url !== selectedLesson.video_url || data.content !== selectedLesson.content) {
                            setSelectedLesson(prev => ({ ...prev, ...data }));
                        }
                    }
                } catch (err) {
                    console.error("[CourseDetailPage] Error fetching fresh lesson data:", err);
                } finally {
                    setLessonUrlLoading(false);
                }
            }
        };
        
        checkAndFetchVideoUrl();
    }, [selectedLesson?.id]);

    const handleLessonSelect = (lesson) => {
        console.log(`[CourseDetailPage] Switching to lesson:`, lesson.title);
        // Clear current selection slightly to force unmount/remount of video player if needed
        setSelectedLesson(null);
        setTimeout(() => {
             setSelectedLesson(lesson);
             setIsSidebarOpen(false);
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    };

    const handleComplete = async () => {
        if (!selectedLesson) return;
        setCompletingLesson(true);
        try {
            await markLessonComplete(selectedLesson.id);
        } catch (err) {
            console.error("Error completing lesson:", err);
        } finally {
            setCompletingLesson(false);
        }
    };

    const handleStartQuiz = () => {
        if (!selectedLesson) return;
        navigate(`/courses/${courseId}/lessons/${selectedLesson.id}/quiz`);
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#0F172A]">
                <Loader2 className="w-12 h-12 text-[#BFFF00] animate-spin" />
            </div>
        );
    }

    if (error || !course) {
         return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] text-white">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold">Course Not Found</h2>
                <p className="text-slate-400 mt-2 mb-6">{error || "The requested course could not be loaded."}</p>
                <Button variant="outline" onClick={() => navigate('/courses')}>Return to Courses</Button>
            </div>
        );
    }

    const currentProgress = progressMap[selectedLesson?.id];
    const isCompleted = currentProgress?.is_completed;
    const isQuiz = selectedLesson?.lesson_type === 'quiz';
    const isVideo = selectedLesson?.lesson_type === 'video' || (selectedLesson && selectedLesson.video_url);

    const RequirementsCard = () => (
        <div className="bg-[#1E293B] border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#BFFF00]" />
                Passing Requirements
            </h3>
            {reqLoading ? (
                <div className="flex gap-2 text-slate-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading requirements...
                </div>
            ) : requirements ? (
                <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                        <span>Min. Passing Grade:</span>
                        <span className="font-mono text-[#BFFF00]">{requirements.passing_grade_percentage}%</span>
                    </div>
                    {requirements.requires_quiz_completion && (
                        <div className="flex justify-between">
                            <span>Quiz Score Required:</span>
                            <span className="font-mono text-white">{requirements.minimum_quiz_score}%</span>
                        </div>
                    )}
                    {requirements.requires_lesson_completion && (
                        <div className="flex justify-between">
                            <span>Lesson Completion:</span>
                            <span className="font-mono text-white">{requirements.minimum_lesson_completion_percentage}%</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Max Attempts:</span>
                        <span className="font-mono text-white">{requirements.max_attempts}</span>
                    </div>
                </div>
            ) : (
                <p className="text-slate-500 text-sm">No specific requirements found for this course.</p>
            )}
        </div>
    );

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-[#1E293B] border-r border-slate-800">
            <div className="p-4 border-b border-slate-800">
                <h2 className="font-bold text-white text-lg line-clamp-1" title={course.title}>{course.title}</h2>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <Progress value={0} className="h-1 flex-1 bg-slate-800" />
                    <span>Learning</span>
                </div>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    <RequirementsCard />
                    
                    {courseStructure.map((module, mIndex) => (
                        <div key={module.id} className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                                Section {mIndex + 1}: {module.title}
                            </h3>
                            <div className="space-y-1">
                                {module.lessons.map((lesson, lIndex) => {
                                    const isSelected = selectedLesson?.id === lesson.id;
                                    const isDone = progressMap[lesson.id]?.is_completed;
                                    const isQ = lesson.lesson_type === 'quiz';
                                    
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => handleLessonSelect(lesson)}
                                            className={cn(
                                                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all text-sm group",
                                                isSelected 
                                                    ? "bg-[#BFFF00]/10 text-[#BFFF00] border border-[#BFFF00]/20" 
                                                    : "hover:bg-slate-800/50 text-slate-300 border border-transparent"
                                            )}
                                        >
                                            <div className="mt-0.5">
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                ) : isSelected ? (
                                                    isQ ? <BrainCircuit className="w-4 h-4 text-[#BFFF00]" /> : <PlayCircle className="w-4 h-4 text-[#BFFF00]" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn("font-medium", isSelected ? "text-white" : "group-hover:text-white")}>
                                                    {lIndex + 1}. {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    {isQ ? <BrainCircuit className="w-3 h-3" /> : (lesson.video_url || lesson.lesson_type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />)}
                                                    <span>{lesson.duration_minutes || 5} min</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="h-screen w-full bg-[#0F172A] flex flex-col overflow-hidden">
            <Helmet>
                <title>{course?.title ? `${course.title} | Learning Mode` : 'Learning Mode'}</title>
            </Helmet>

            <header className="h-16 bg-[#1E293B] border-b border-slate-800 flex items-center justify-between px-4 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/courses" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
                    <h1 className="text-white font-semibold truncate hidden md:block">{course?.title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="hidden md:flex text-slate-400 hover:text-white gap-2">
                                <ListChecks className="w-4 h-4" /> Requirements
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1E293B] border-slate-700 text-white">
                            <DialogHeader>
                                <DialogTitle>Course Passing Requirements</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <RequirementsCard />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden border-slate-700 bg-slate-800 text-white">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80 bg-[#1E293B] border-l border-slate-800">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                <div className="hidden md:block w-96 flex-shrink-0 h-full">
                    <SidebarContent />
                </div>

                <main className="flex-1 overflow-y-auto bg-[#0F172A] p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8 pb-20">
                        {selectedLesson ? (
                            <motion.div
                                key={selectedLesson.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Media / Video Area */}
                                {lessonUrlLoading ? (
                                    <div className="aspect-video w-full rounded-xl flex flex-col items-center justify-center bg-slate-900 border border-slate-800 shadow-sm">
                                        <Loader2 className="w-8 h-8 text-[#BFFF00] animate-spin mb-4" />
                                        <span className="text-slate-400 font-medium">Preparing Lesson Media...</span>
                                    </div>
                                ) : !isQuiz && isVideo && selectedLesson.video_url ? (
                                    <ErrorBoundary>
                                        <VideoPlayer 
                                            videoUrl={selectedLesson.video_url} 
                                            title={selectedLesson.title}
                                            className="mb-8"
                                        />
                                    </ErrorBoundary>
                                ) : !isQuiz && (
                                    <Card className="bg-slate-900 border-slate-800 overflow-hidden rounded-xl">
                                        <div className="aspect-video w-full flex items-center justify-center text-slate-500 flex-col p-8">
                                            <div className="text-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                                                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                                <h3 className="text-xl font-medium text-slate-300 mb-2">Text-based Lesson</h3>
                                                <p className="text-sm">Read the material provided below to complete this section.</p>
                                                
                                                {isVideo && !selectedLesson.video_url && (
                                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg inline-flex items-center gap-2">
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                        <span className="text-sm text-red-400 font-medium">Video missing or link is invalid.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Content Area */}
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h2>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                 <Badge variant="outline" className="border-slate-700 bg-slate-800 text-slate-300 capitalize">
                                                    {selectedLesson.lesson_type || 'Lesson'}
                                                 </Badge>
                                                 <span>•</span>
                                                 <span>{selectedLesson.duration_minutes || 5} min {isQuiz ? 'duration' : 'read/watch'}</span>
                                            </div>
                                        </div>
                                        
                                        {isQuiz ? (
                                            <Button 
                                                size="lg"
                                                onClick={handleStartQuiz}
                                                className="min-w-[180px] font-bold shadow-lg transition-all bg-[#BFFF00] text-black hover:bg-[#a3d900] hover:scale-105"
                                            >
                                                <BrainCircuit className="w-5 h-5 mr-2" /> Start Quiz
                                            </Button>
                                        ) : (
                                            <Button 
                                                size="lg"
                                                onClick={handleComplete}
                                                disabled={isCompleted || completingLesson}
                                                className={cn(
                                                    "min-w-[180px] font-bold shadow-lg transition-all",
                                                    isCompleted 
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/20" 
                                                        : "bg-[#BFFF00] text-black hover:bg-[#a3d900] hover:scale-105"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <><CheckCircle2 className="w-5 h-5 mr-2" /> Completed</>
                                                ) : completingLesson ? (
                                                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
                                                ) : (
                                                    <>Mark as Complete</>
                                                )}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed bg-[#1E293B]/50 p-6 rounded-xl border border-slate-800 shadow-sm">
                                        {selectedLesson.content || selectedLesson.description ? (
                                            <div dangerouslySetInnerHTML={{ __html: selectedLesson.content || selectedLesson.description }} />
                                        ) : (
                                            <p className="text-slate-500 italic">No additional description available for this lesson.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 space-y-4">
                                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                                    <Award className="w-12 h-12 text-slate-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-medium text-slate-300">Ready to Start?</h3>
                                    <p className="max-w-md mx-auto mt-2">Select a lesson from the sidebar to begin your learning journey.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseDetailPage;