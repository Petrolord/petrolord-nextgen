// Import this FIRST in every EC5 test file, before the lab or any panel.
//
// The teaching digest is built with TZ=UTC (build_digest.sh). The engine reads
// every S-curve date and label in UTC, so the zone should not matter; pinning
// it anyway means a run with TZ=America/Los_Angeles in the shell still
// reproduces the digest byte for byte, and any local-time slip in a future
// engine shows up as a digest mismatch here. Node re-reads process.env.TZ when
// it is assigned, and ES module imports evaluate in order, so a side-effect
// import placed first pins the zone before any Date is made.
import process from 'node:process';

process.env.TZ = 'UTC';

export const PINNED_TIMEZONE = process.env.TZ;
