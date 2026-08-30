// The learner sidebar's course navigation, one level per MODULE.
//
// WHY IT IS SHAPED THIS WAY. This used to render one flat group per module
// that happened to have an `available` course, so with only Geoscience live
// the sidebar looked like an academy with one subject in it. The six
// Reservoir courses were seeded but still `coming_soon`, and there was no
// way to see from the sidebar that they existed at all, let alone how many
// courses the academy had.
//
// The other obvious shape - every course listed at the top level - does not
// survive the roster: ten Geoscience plus seven Reservoir is already
// seventeen entries before a third module exists.
//
// So: MODULES are the first level, each carrying the number of courses
// built in it, and a module opens to reveal its courses. A module with no
// courses yet is still listed, muted, so the roadmap is visible and the
// gaps are obvious. That is the question this sidebar has to answer at a
// glance: how much of the academy exists.
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, BookOpen, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listAcademyApps } from '@/services/academyService';
import { MODULE_LABELS, moduleLabel } from '@/lib/academyModules';
import { COURSE_ICONS } from '@/components/sidebar/courseIcons';

// The order modules are taught in, which is the order the Suite's own
// modules were built. Anything not named here sorts after, alphabetically,
// so a new module slug never disappears from the sidebar.
export const MODULE_ORDER = [
  'geoscience', 'reservoir', 'drilling', 'production',
  'facilities', 'economics', 'assurance', 'hse',
];

export const orderModules = (slugs) => {
  const known = MODULE_ORDER.filter((m) => slugs.includes(m));
  const rest = slugs.filter((m) => !MODULE_ORDER.includes(m)).sort();
  return [...known, ...rest];
};

/**
 * Group the catalog by module, and keep every module in MODULE_LABELS even
 * when it has no courses. An empty module is information: it is the part of
 * the academy that has not been built.
 */
export const groupByModule = (apps) => {
  const byModule = {};
  Object.keys(MODULE_LABELS).forEach((m) => { byModule[m] = []; });
  (apps || []).forEach((a) => {
    if (!byModule[a.module]) byModule[a.module] = [];
    byModule[a.module].push(a);
  });
  Object.values(byModule).forEach((list) =>
    list.sort((x, y) => (x.path_order ?? 0) - (y.path_order ?? 0)));
  return byModule;
};

const CourseModuleNav = () => {
  const location = useLocation();
  const [apps, setApps] = useState([]);
  const [openModule, setOpenModule] = useState(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listAcademyApps()
      .then((data) => { if (!cancelled) setApps(data || []); })
      .catch((err) => console.error('Sidebar catalog load failed:', err));
    return () => { cancelled = true; };
  }, []);

  const byModule = useMemo(() => groupByModule(apps), [apps]);
  const modules = useMemo(() => orderModules(Object.keys(byModule)), [byModule]);

  // Open the module the learner is already inside, until they choose
  // otherwise. Without this, opening a course collapses its own module.
  const activeSlug = location.pathname.startsWith('/dashboard/apps/')
    ? location.pathname.split('/')[3]
    : null;
  const activeModule = useMemo(() => {
    if (!activeSlug) return null;
    const hit = (apps || []).find((a) => a.slug === activeSlug);
    return hit ? hit.module : null;
  }, [apps, activeSlug]);

  const expanded = touched ? openModule : (openModule ?? activeModule);

  return (
    <div className="mb-6">
      <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Courses
      </h3>
      <div className="space-y-0.5">
        {modules.map((mod) => {
          const list = byModule[mod] || [];
          const built = list.length;
          const live = list.filter((a) => a.status === 'available').length;
          const isOpen = expanded === mod;
          const isEmpty = built === 0;

          return (
            <div key={mod}>
              <button
                type="button"
                disabled={isEmpty}
                aria-expanded={isOpen}
                onClick={() => {
                  setTouched(true);
                  setOpenModule(isOpen ? null : mod);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isEmpty
                    ? 'text-slate-600 cursor-default'
                    : 'text-slate-300 hover:text-white hover:bg-white/5',
                  isOpen && !isEmpty && 'text-white bg-white/5'
                )}
              >
                <ChevronRight
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform',
                    isOpen && 'rotate-90',
                    isEmpty && 'opacity-20'
                  )}
                />
                <span className="truncate flex-1 text-left">{moduleLabel(mod)}</span>
                {/* The number of courses BUILT. This is the figure the
                    sidebar exists to show; the live count is a separate
                    thing and only differs while a wave is held. */}
                <span
                  className={cn(
                    'text-xs font-mono tabular-nums',
                    isEmpty ? 'text-slate-700' : 'text-[#BFFF00]'
                  )}
                  title={isEmpty
                    ? 'No courses built yet'
                    : `${built} course${built === 1 ? '' : 's'} built, ${live} live`}
                >
                  {isEmpty ? '—' : built}
                </span>
              </button>

              {isOpen && !isEmpty && (
                <div className="ml-4 pl-3 border-l border-slate-800 space-y-0.5 py-1">
                  {list.map((app) => {
                    const Icon = COURSE_ICONS[app.slug] || BookOpen;
                    const available = app.status === 'available';
                    if (!available) {
                      // Listed, so the course is visibly built, but not a
                      // link: it has no deployed page to open yet.
                      return (
                        <div
                          key={app.slug}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-600"
                          title="Built and seeded; not released yet"
                        >
                          <Lock className="w-4 h-4 shrink-0 opacity-50" />
                          <span className="truncate flex-1">{app.name}</span>
                          <span className="text-[10px] uppercase tracking-wide">soon</span>
                        </div>
                      );
                    }
                    return (
                      <NavLink
                        key={app.slug}
                        to={`/dashboard/apps/${app.slug}`}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group text-sm',
                          isActive
                            ? 'bg-[#BFFF00] text-black shadow-[0_0_15px_rgba(191,255,0,0.3)] font-medium'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0 group-hover:text-[#BFFF00]" />
                        <span className="truncate">{app.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseModuleNav;
