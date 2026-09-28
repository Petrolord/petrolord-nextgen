// The signed-in routes that render inside the design-system scope while the
// rollout runs (docs/scope/DesignSystem-Rollout.md section 5).
//
// Each batch lists its routes in its own file here (pre-created empty, so
// parallel batches never edit the same file); do not edit this index.
//   '/dashboard/enroll'    that path exactly
//   '/dashboard/apps/dca/*' that path and everything under it
//   '/dashboard/apps/:slug/course/*' a :name segment matches any one segment
// At the end state (wave 7) this registry and the gate in Layout are deleted
// and the scope is unconditional.
import w0 from './w0.js';
import w1a from './w1a.js';
import w1b from './w1b.js';
import w1c from './w1c.js';
import w2a from './w2a.js';
import w2b from './w2b.js';
import w2c from './w2c.js';
import w3a from './w3a.js';
import w3b from './w3b.js';
import w3c from './w3c.js';
import w3d from './w3d.js';
import w3e from './w3e.js';
import w4a from './w4a.js';
import w4b from './w4b.js';
import w4c from './w4c.js';
import w4d from './w4d.js';
import w5a from './w5a.js';
import w5b from './w5b.js';
import w5c from './w5c.js';
import w5d from './w5d.js';
import w6a from './w6a.js';

export const THEMED_ROUTES = Object.freeze([
  ...w0,
  ...w1a, ...w1b, ...w1c,
  ...w2a, ...w2b, ...w2c,
  ...w3a, ...w3b, ...w3c, ...w3d, ...w3e,
  ...w4a, ...w4b, ...w4c, ...w4d,
  ...w5a, ...w5b, ...w5c, ...w5d,
  ...w6a,
]);

export default THEMED_ROUTES;
