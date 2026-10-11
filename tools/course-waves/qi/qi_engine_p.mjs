// The Professional lab, loaded the way qi_engine.mjs loads qiLab.js (the
// caller must have registered qi_loader.mjs first, as qi_dump.mjs does).
import process from 'node:process';

export const REPO = process.env.QI_REPO || '/root/wt-qi-nextgen';
export const LABP = await import(`${REPO}/src/components/course/panels/qi/qiLabPro.js`);
