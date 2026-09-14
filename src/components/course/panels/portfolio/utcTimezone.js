// Import this FIRST in every EC5 test file, before the lab or any panel.
//
// generateSCurveData parses an AFE window as UTC midnight but steps months and
// prints its labels in LOCAL time (finding EC5-5). The teaching digest is built
// with TZ=UTC (build_digest.sh), so every S-curve label and Planned value it
// prints is the UTC one. Node re-reads process.env.TZ when it is assigned, and
// ES module imports evaluate in order, so a side-effect import placed first
// pins the zone before any Date is made. Running the tests with
// TZ=America/Los_Angeles in the shell therefore still reproduces the digest.
//
// This pins the TESTS only. The engine is not worked around: in a browser west
// of UTC the panels show the labels that browser's engine run returns.
import process from 'node:process';

process.env.TZ = 'UTC';

export const PINNED_TIMEZONE = process.env.TZ;
