// THE ONE PLACE A QI WAVE SCRIPT LOADS THE EXPERT LAB (qiLabExp.js), the same
// file the inversion and prospect explorers run. Register qi_loader.mjs first
// (qi_dump.mjs does) or import this after qi_engine.mjs.
import { register } from 'node:module';
import process from 'node:process';

register('./qi_loader.mjs', import.meta.url);
export const REPO = process.env.QI_REPO || '/root/wt-qi-nextgen';
export const LABE = await import(`${REPO}/src/components/course/panels/qi/qiLabExp.js`);
