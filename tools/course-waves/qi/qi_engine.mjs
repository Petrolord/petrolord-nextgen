// THE ONE PLACE A QI WAVE SCRIPT LOADS THE LAB AND THE ENGINES.
// Registers qi_loader.mjs, then imports the NextGen teaching lab itself
// (qiLab.js), so the digest, the capstone generator and the panels compute
// with one file. QI_REPO selects the NextGen checkout (default the wave's
// worktree); QI_ENGINES its engines root.
import { register } from 'node:module';
import process from 'node:process';

register('./qi_loader.mjs', import.meta.url);
export const REPO = process.env.QI_REPO || '/root/wt-qi-nextgen';
export const LAB = await import(`${REPO}/src/components/course/panels/qi/qiLab.js`);
