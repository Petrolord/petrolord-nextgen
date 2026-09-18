// compliance (Compliance, Audit & Quality): the wave's own heading claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/as-wip-compliance/digest.txt --rules /root/as-wip-compliance
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engine as it is at
// 9d5d3b4 (ASC-0). It names decisions by their wave (AS13-0, AS15, ASC-0) as
// rules currently IN FORCE, in SECTION 23, and every one of those lines states
// present behaviour with a measured figure. Nothing in the digest describes
// what an engine used to return.
export default {
  enginesRoot: process.env.AS_ENGINES || '/root/wt-as-compliance-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict.
  headings: [
    {
      id: 'cq-worst-first',
      heading: /SORTED WORST FIRST/i,
      // The byUrgency table must list statuses in STATUS_SEVERITY order: a
      // block whose order column walks back up the severity list has made the
      // heading false.
      body: (b) => {
        const order = ['Expired', 'Overdue', 'Due soon', 'On track', 'Compliant', 'No date set', 'Draft', 'Superseded', 'Not applicable'];
        const lines = b.split('\n');
        const at = lines.findIndex((l) => /^\| order \| code \| status/.test(l));
        if (at === -1) return false;
        let last = -1;
        for (let i = at + 2; i < lines.length && lines[i].startsWith('|'); i += 1) {
          const st = lines[i].split('|').map((c) => c.trim())[3];
          const r = order.indexOf(st);
          if (r < last) return true;
          last = r;
        }
        return false;
      },
      why: 'a heading says the register is sorted worst first over a table whose status column climbs back up the severity order',
    },
    {
      id: 'cq-hold-point-stops-work',
      heading: /A HOLD POINT STOPS WORK/i,
      body: (b) => b.split('\n').filter((l) => /\| Hold point \|/.test(l)).some((l) => /\| Hold point \| [^|]+ \| false \|/.test(l)),
      why: 'a heading says a hold point stops work over a table that prints a hold point with stops work false',
    },
    {
      id: 'cq-reported-internal-audits',
      heading: /FROM REPORTED INTERNAL AUDITS/i,
      // The audits table's last column must read true only for Internal audits
      // that are Reported or Closed.
      body: (b) => b.split('\n').filter((l) => /^\| [A-Z]{3}-\d{4}-/.test(l) && l.split('|').length === 7).some((l) => {
        const [, , type, status, , counts] = l.split('|').map((c) => c.trim());
        const should = type === 'Internal' && ['Reported', 'Closed'].includes(status);
        return String(should) !== counts;
      }),
      why: 'a heading says coverage comes from reported internal audits over a table that counts some other audit',
    },
    {
      id: 'cq-list-of-blockers',
      heading: /A LIST OF BLOCKERS/i,
      body: (b) => /percent|compliance rate|score/i.test(b.split('\n').filter((l) => /^\| (blocking|serious|watch) \|/.test(l)).join('\n')),
      why: 'a heading says readiness is a list of blockers over a list that carries a percentage or a score, which is the thing the module was written to replace',
    },
    {
      id: 'cq-nothing-graded',
      heading: /WITHOUT GRADING/i,
      body: (b) => /graded at|fields\.json|expected value/i.test(b),
      why: 'a heading says the held items are taught without grading over a block that reaches into the answer key',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each
  // was read by hand and is listed with what it actually says.
  cleared: [
    // The owner decisions in force, named by the wave that took them. Present tense.
    /owner decision AS15 Q1/,
    /Five rules the engine keeps at 9d5d3b4 \(ASC-0, engines PR #212\)/,
    /Owner decisions in force \(AssuranceApps-STATUS\.md section 3n, AS15\)/,
    // "was written for" describes the ENGINE MESSAGE's scope, not a former behaviour.
    /The Compliant reason was written for a recurring obligation/,
    // "last filed", "last examined", "last audited" are the engine's own column words.
    /last (filed|examined|filing|audited)/i,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from, so an upstream engine edit turns this gate RED
  // instead of letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'deriveStatus needs a valid date for today.', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'inside the ${leadTime(obligation)} day lead time set for this obligation', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'was for an earlier period, so nothing has been filed for this one yet.', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'so it is not tracked against a date.', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'No due date or expiry date has been set, so nothing can fall due.', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'The author of a revision cannot review it. Choose somebody independent of the draft.', src: 'engines/assurance/documentControl.js' },
    { frag: 'Only the reviewer this task is assigned to can decide it.', src: 'engines/assurance/documentControl.js' },
    { frag: 'The author of a revision cannot approve it.', src: 'engines/assurance/documentControl.js' },
    { frag: 'A hold point needs the date it was verified and who verified it. Without those it has not been held.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A waiver is a deliberate acceptance of less assurance', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Setting a hold point aside needs the date and who decided it, the same record a waiver needs.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'It stops work until released, so setting it aside needs a reason on the record.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A failed inspection is the most outstanding item on a plan.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A hold point stops work until it is verified, so the plan cannot be finished over one.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A hold point cannot be removed once its plan has left Draft.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A recorded result is evidence and stays on the plan.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Its inspection points are the record it was finished on.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Raise the non-conformance against the plan now in force, or with no plan.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Agree the disposition first: what happens to the non-conforming item.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Record the date the disposition was agreed.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'A disposition deals with the item; a corrective action deals with the cause.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'Raise another one rather than closing over it.', src: 'engines/assurance/qualityAssurance.js' },
    { frag: 'An audit reported with its checklist half blank says nothing about the items nobody looked at.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'A critical question that fails needs a finding with a number, an owner and a due date.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'Write the audit conclusion. It is the deliverable.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'An auditor may not audit their own area: name somebody else as one or the other.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'A finding that stopped work is a nonconformity, not an observation.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'Imminent danger does not wait for the corrective action cycle.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'A programme marked complete over audits that never happened is the document a certification body will ask for.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'Say why this audit is not being done.', src: 'engines/assurance/auditManagement.js' },
    { frag: 'Conformity is a claim about documented information; without those three it is an opinion in a dropdown.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'requires the justification for a requirement determined not applicable to be kept', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'A requirement determined not applicable keeps its justification on record.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'A one-off obligation, nothing further is due.', src: 'engines/assurance/complianceStatus.js' },
    { frag: 'The certificate expires today. Book the recertification audit now.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'requires the organization to audit its own system.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'An auditor may not audit their own work (ISO 19011), so either the scope or the auditor has to change.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'so somebody else on the audit has to record this result.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'A correction deals with the instance; a corrective action deals with the cause.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'A certification body will not recommend certification over one.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'a surveillance audit is no longer possible: it needs a recertification audit.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'Book the recertification audit before then.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'This standard has no applicable clauses in the register yet, so there is nothing to be ready with.', src: 'engines/assurance/isoCompliance.js' },
    { frag: 'An audit that examined nothing has nothing to report.', src: 'engines/assurance/isoCompliance.js' },
  ],
};
