// Per-course sidebar icons. A course with no entry falls back to BookOpen,
// so a new course never renders without one.
import {
  HardDrive, FlaskConical, GitCompareArrows, Waves, Map, Calculator,
  Atom, Gauge, Layers, Flame, TrendingDown, Scale, Droplets, Beaker,
  Boxes, Activity,
} from 'lucide-react';

export const COURSE_ICONS = {
  // Geoscience
  welldata: HardDrive,
  petrophysics: FlaskConical,
  wellcorrelation: GitCompareArrows,
  seismolord: Waves,
  mapping: Map,
  reservoircalc: Calculator,
  rockphysics: Atom,
  porepressure: Gauge,
  earthmodel: Layers,
  basin: Flame,
  // Reservoir
  dca: TrendingDown,
  mbal: Scale,
  scal: Droplets,
  waterflood: Waves,
  sim: Boxes,
  fluid: Beaker,
  welltest: Activity,
};
