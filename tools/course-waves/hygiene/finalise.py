#!/usr/bin/env python3
"""Write wave.json for H2 from the wave's own files, and pin the md5 of every
gate that was run beside the result it gave (dc-wavekit README: the kit is not a
git repository, so a green run is only reproducible if the md5 of each gate is
recorded).

    python3 finalise.py            run every foundation gate, then write wave.json
    python3 finalise.py --check    run them and refuse if any result differs from
                                   what wave.json records

Every gate is RUN here; nothing in the gates block is typed. A gate that exits
non-zero is recorded with its exit code and the file is still written, so a red
gate is visible in wave.json rather than hidden by a refusal to write.
"""
import hashlib, json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = '/root/dc-wavekit'
NG = os.environ.get('H2_NEXTGEN', '/root/wt-h2-nextgen')


def md5(p):
    return hashlib.md5(open(p, 'rb').read()).hexdigest()


def sha256(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


def run(cmd, cwd=HERE):
    r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip().splitlines()
    tail = [l for l in out if l.strip()][-3:]
    return r.returncode, ' | '.join(x.strip() for x in tail)


GATES = [
    # (name, script path for md5, command, expected exit)
    ('structure.py', f'{HERE}/structure.py', 'python3 structure.py', 0),
    ('h2_capstone.mjs', f'{HERE}/h2_capstone.mjs', 'node h2_capstone.mjs', 0),
    ('make_fields.mjs', f'{HERE}/make_fields.mjs', 'node make_fields.mjs', 0),
    ('make_fields.mjs --bare-stated-tolerances (negative control, must exit 1)', f'{HERE}/make_fields.mjs', 'node make_fields.mjs --bare-stated-tolerances', 1),
    ('discriminate.mjs', f'{HERE}/discriminate.mjs', 'node discriminate.mjs', 0),
    ('discriminate.mjs --slack-tolerances (negative control, must exit 1)', f'{HERE}/discriminate.mjs', 'node discriminate.mjs --slack-tolerances', 1),
    ('gate_collisions.mjs', f'{HERE}/gate_collisions.mjs', 'node gate_collisions.mjs', 0),
    ('gate_capstone_leak.py --no-banks', f'{HERE}/gate_capstone_leak.py', 'python3 gate_capstone_leak.py --no-banks', 0),
    ('gate_capstone_leak.py --no-banks --plant-lesson (negative control, must exit 1)', f'{HERE}/gate_capstone_leak.py', 'python3 gate_capstone_leak.py --no-banks --plant-lesson', 1),
    ('gate_capstone_leak.py --no-banks --plant-brief (negative control, must exit 1)', f'{HERE}/gate_capstone_leak.py', 'python3 gate_capstone_leak.py --no-banks --plant-brief', 1),
    ('gate_vocabulary.py', f'{HERE}/gate_vocabulary.py', 'python3 gate_vocabulary.py', 0),
    ('gate_vocabulary.py --plant (negative control, must exit 1)', f'{HERE}/gate_vocabulary.py', 'python3 gate_vocabulary.py --plant', 1),
    ('leakage.mjs --tier beginner', f'{KIT}/leakage.mjs', f'node {KIT}/leakage.mjs . --tier beginner', 0),
    ('leakage.mjs --tier intermediate', f'{KIT}/leakage.mjs', f'node {KIT}/leakage.mjs . --tier intermediate', 0),
    ('leakage.mjs --tier advanced', f'{KIT}/leakage.mjs', f'node {KIT}/leakage.mjs . --tier advanced', 0),
    ('leakage.mjs --selftest', f'{KIT}/leakage.mjs', f'node {KIT}/leakage.mjs --selftest', 0),
    ('gate_claims.mjs', f'{HERE}/gate_claims.mjs', 'node gate_claims.mjs', 0),
    ('gate_claims.mjs --plant-a-recon-figure (negative control, must exit 1)', f'{HERE}/gate_claims.mjs', 'node gate_claims.mjs --plant-a-recon-figure', 1),
    ('gate_copy_rule.py', f'{HERE}/gate_copy_rule.py', 'python3 gate_copy_rule.py', 0),
    ('h2_dump.mjs owners selftest', f'{HERE}/h2_dump.mjs', 'H2_OWNERS_SELFTEST=1 node h2_dump.mjs', 0),
    ('digestrepro.sh', f'{KIT}/digestrepro.sh', f'bash {KIT}/digestrepro.sh {HERE} {NG}', 0),
    ('digestprose.mjs --rules', f'{KIT}/digestprose.mjs', f'node {KIT}/digestprose.mjs digest.txt --rules .', 0),
    # THE DIGEST WAS THE ONLY THING THIS GATE SWEPT HERE, and digestprose takes
    # --lessons and --banks. So the lessons went the whole foundation and bank
    # phase unswept by it and finished with three UNFRAMED history failures and
    # three HIGH warnings that nothing in the pinned set could see: "as the
    # previous module showed" reads to the rule as a previous ENGINE, which is
    # exactly the confusion the rule exists to catch. A gate the wave owns and
    # does not run is not a gate. Both sweeps are pinned from here on.
    ('digestprose.mjs --lessons', f'{KIT}/digestprose.mjs',
     f'node {KIT}/digestprose.mjs digest.txt --rules . --lessons {NG}/src/content/courses/hygiene', 0),
    ('digestprose.mjs --lessons --banks', f'{KIT}/digestprose.mjs',
     f'node {KIT}/digestprose.mjs digest.txt --rules . --lessons {NG}/src/content/courses/hygiene '
     f'--banks {NG}/tools/course-banks/hygiene', 0),
    # The bank gates, pinned now that the banks exist. bankleak REFUSED every
    # run on this course until the x1/60 opt-in reached it, so it had never
    # swept a single H2 bank; pinning it here is what stops that recurring.
    ('check-bank-sources.py hygiene', f'{NG}/tools/course-banks/check-bank-sources.py',
     f'python3 {NG}/tools/course-banks/check-bank-sources.py hygiene', 0),
    ('bankleak.py all tiers', f'{KIT}/bankleak.py',
     f'python3 {KIT}/bankleak.py . --banks {NG}/tools/course-banks/hygiene', 0),
    ('bankleak.py --selftest', f'{KIT}/bankleak.py', f'python3 {KIT}/bankleak.py --selftest', 0),
    ('leakage.mjs --banks beginner', f'{KIT}/leakage.mjs',
     f'node {KIT}/leakage.mjs . --banks {NG}/tools/course-banks/hygiene --tier beginner', 0),
    ('leakage.mjs --banks intermediate', f'{KIT}/leakage.mjs',
     f'node {KIT}/leakage.mjs . --banks {NG}/tools/course-banks/hygiene --tier intermediate', 0),
    ('leakage.mjs --banks advanced', f'{KIT}/leakage.mjs',
     f'node {KIT}/leakage.mjs . --banks {NG}/tools/course-banks/hygiene --tier advanced', 0),
    ('gate_capstone_leak.py --banks', f'{HERE}/gate_capstone_leak.py',
     f'python3 gate_capstone_leak.py --banks {NG}/tools/course-banks/hygiene', 0),
    ('dupaxes.py all three tiers', f'{KIT}/dupaxes.py',
     f'd=$(mktemp -d) && cp {NG}/tools/course-banks/hygiene/*/*.json "$d"/ '
     f'&& python3 {KIT}/dupaxes.py "$d"; rc=$?; rm -rf "$d"; exit $rc', 0),
    ('lengthtails.py beginner', f'{KIT}/lengthtails.py',
     f'python3 {KIT}/lengthtails.py {NG}/tools/course-banks/hygiene/beginner --refuse 40.0 --prefix h2b', 0),
    ('lengthtails.py intermediate', f'{KIT}/lengthtails.py',
     f'python3 {KIT}/lengthtails.py {NG}/tools/course-banks/hygiene/intermediate --refuse 40.0 --prefix h2i', 0),
    ('lengthtails.py advanced', f'{KIT}/lengthtails.py',
     f'python3 {KIT}/lengthtails.py {NG}/tools/course-banks/hygiene/advanced --refuse 40.0 --prefix h2a', 0),
    ('litsweep.py beginner', f'{KIT}/litsweep.py',
     f'python3 {KIT}/litsweep.py . --banks {NG}/tools/course-banks/hygiene/beginner --prefix h2b', 0),
    ('litsweep.py intermediate', f'{KIT}/litsweep.py',
     f'python3 {KIT}/litsweep.py . --banks {NG}/tools/course-banks/hygiene/intermediate --prefix h2i', 0),
    ('litsweep.py advanced', f'{KIT}/litsweep.py',
     f'python3 {KIT}/litsweep.py . --banks {NG}/tools/course-banks/hygiene/advanced --prefix h2a', 0),
    # Pinned at the close of the lesson fix pass (2026-09-21). numsweep and
    # bankrepro were run by hand at each audit and never pinned, and the bank
    # copy rule was swept only by per-tier scratch scripts the audits kept.
    ('gate_bank_copy.py', f'{HERE}/gate_bank_copy.py', 'python3 gate_bank_copy.py', 0),
    ('gate_bank_copy.py --plant (negative control, must exit 1)', f'{HERE}/gate_bank_copy.py', 'python3 gate_bank_copy.py --plant', 1),
    ('numsweep.mjs lessons', f'{KIT}/numsweep.mjs',
     f'node {KIT}/numsweep.mjs . --content {NG}/src/content/courses/hygiene', 0),
    ('numsweep.mjs --banks beginner', f'{KIT}/numsweep.mjs',
     f'node {KIT}/numsweep.mjs . --banks {NG}/tools/course-banks/hygiene/beginner', 0),
    ('numsweep.mjs --banks intermediate', f'{KIT}/numsweep.mjs',
     f'node {KIT}/numsweep.mjs . --banks {NG}/tools/course-banks/hygiene/intermediate', 0),
    ('numsweep.mjs --banks advanced', f'{KIT}/numsweep.mjs',
     f'node {KIT}/numsweep.mjs . --banks {NG}/tools/course-banks/hygiene/advanced', 0),
    ('numsweep.mjs --selftest', f'{KIT}/numsweep.mjs', f'node {KIT}/numsweep.mjs --selftest', 0),
    ('bankrepro.py all three tiers', f'{KIT}/bankrepro.py',
     f'python3 {KIT}/bankrepro.py {NG}/tools/course-banks/hygiene/beginner {NG}/tools/course-banks/hygiene/intermediate '
     f'{NG}/tools/course-banks/hygiene/advanced --prefix h2', 0),
    ('bankrepro.py --selftest', f'{KIT}/bankrepro.py', f'python3 {KIT}/bankrepro.py --selftest', 0),
    ('digestpromise.py', f'{KIT}/digestpromise.py', f'python3 {KIT}/digestpromise.py .', 0),
    ('digestfigures.py', f'{KIT}/digestfigures.py', f'python3 {KIT}/digestfigures.py .', 0),
    ('digestleak.py', f'{KIT}/digestleak.py', f'python3 {KIT}/digestleak.py .', 0),
    ('collisions.py', f'{KIT}/collisions.py', f'python3 {KIT}/collisions.py .', 0),
    ('gradeprecision.py', f'{KIT}/gradeprecision.py', f'python3 {KIT}/gradeprecision.py .', 0),
    ('briefleak.py', f'{KIT}/briefleak.py', f'python3 {KIT}/briefleak.py .', 0),
    ('check-vendored-engines.mjs', f'{NG}/tools/check-vendored-engines.mjs', f'node {NG}/tools/check-vendored-engines.mjs', 0),
    ('check-wave-inputs.mjs', f'{NG}/tools/course-waves/check-wave-inputs.mjs', f'node {NG}/tools/course-waves/check-wave-inputs.mjs', 0),
]

CHECK = '--check' in sys.argv
results = {}
bad = []
for name, script, cmd, want in GATES:
    code, tail = run(cmd)
    results[name] = {'md5': md5(script), 'exit': code, 'expected': want, 'result': tail[:600]}
    if code != want:
        bad.append(f'{name}: exit {code}, expected {want}: {tail[:200]}')

digest = open(f'{HERE}/digest.txt', encoding='utf-8').read()
fields = json.load(open(f'{HERE}/fields.json'))
capstone = json.loads(subprocess.run('node h2_capstone.mjs --evidence', cwd=HERE, shell=True, capture_output=True, text=True).stdout)

WAVE = {
    'slug': 'hygiene',
    'prefix': 'h2',
    'name': 'Occupational Hygiene: Noise, Chemical & Heat Exposure',
    'pathOrder': 62,
    'module': 'hse',
    'prerequisite': None,
    'repo': NG,
    'branch': 'feat/h2-hygiene-course',
    'goldens': ['hse/goldens/exposure_cases.json'],
    'engines': ['engines/hse/exposure.js'],
    'enginesVendoredAt': 'NextGen, sha-identical with petrolord-engines 16fd6c9 (re-vendored 2026-09-21 for #231, the own-property preset lookups: exposure.js and FINDINGS-exposure.md moved, no H2 value moved, fields.json regenerates byte-identical and the digest's engine line count moved from 708 to 714; before that b43f1d9, main after #220, #222, #223; first vendored at 870cc8f, PR #217). Re-vendored 2026-09-19 for #220 only: exposure.js, the jest suite and FINDINGS-exposure.md moved; the golden, the oracle and the negative-control script are byte-identical between the two commits. SIX paths, walked as an import closure from __tests__/hse.exposure.test.js by vendor_hygiene.sh: the suite, the engine and the golden it reads at runtime, plus three NAMED members (oracle_exposure.py, FINDINGS-exposure.md, negcontrol_exposure.sh mode 755). 24 proofs (blob, sha256, cmp, bytes), 0 deviations. The six paths were first ledgered kind "extra", group h2-hygiene-course; merging main brought the canonical pin to df31f53, which carries all six byte for byte, so the six entries were removed as STALE and VENDOR.json is now identical to main.',
    'leakScales': ['1', 'x1e3', 'x1e-3', 'x1e2', 'x1e-2', 'x60', 'x1/60'],
    'decisions': {
        'heatLabels': 'ACCEPTED 2026-09-19 (BRIEF.md): a WBGT built from thermometer readings carries "the NIOSH 2016-106 section 9.3.2 weighting, checked for transcription only"; a RAL, a REL or a margin against either carries the section 8.1 label. A WBGT the instrument read out, and the graded one-hour averages of stated readouts, are arithmetic on stated values and carry neither.',
        'heat': 'No graded field passes through the NIOSH 2016-106 RAL or REL equation, a margin, an exceedance verdict, or a WBGT built from globe, wet bulb and dry bulb readings. They are TAUGHT as "the NIOSH 2016-106 section 8.1 equation, checked for transcription only". REASON: the constants and the WBGT weights are transcription only (FINDINGS-exposure.md section 6: planting the same error in engine and oracle leaves the suite green), and NIOSH\'s own worked example disagrees with its own equation (27.8 C printed against 27.458939 C at 348.9 W; 25 C against 24.047916 C for the RAL), so a learner following the document\'s figure would be marked wrong. The two graded heat fields are one-hour time weighted averages of STATED readouts, arithmetic by definition.',
        'coefficient16_61': 'OSHA Table A-1 cannot separate 16.61 from 5/log10 2 at its printed decimal (0 of 150 rows reject the exact coefficient; digest section 5). The OSHA TWA and the extended-shift action level are graded on the coefficient the mandatory Appendix A TEXT writes. NIOSH Table 1-2 does separate 10.0 from 3/log10 2 (49 of 83 rows).',
        'weeklyLex': 'Graded with FIVE days given, so the statutory divisor of 5 equals the day count; the capstone generator measures the two agree to 1e-12. The energy average is the one L108 Figure 26 reproduces for the day.',
        'stel': 'A fifteen-minute time weighted average by definition; the prompt STATES the remainder of the window counts as zero.',
        'oracleOnlyNeverGraded': ['NIOSH protector derating by type (0.75/0.5/0.3)', 'OSHA dual protection +5 dB', 'Brief and Scala WEEKLY factor on its own (only decides which factor governs; the capstone asserts the weekly factor sits above the daily one by more than 0.2)'],
    },
    'constants': {
        '$comment': 'MEASURED out of the engine in digest section 3 and pinned against a literal typed in h2_dump.mjs, a third location. 40 pins, all within 1e-12 relative except the three limit doses, bisected, within 1e-9.',
        '16.61 and 10.0': 'the printed TWA coefficients, J1. GRADED through the TWA fields (decision coefficient16_61).',
        '5 and 3': 'the decibel exchange rates. GRADED through every noise field; Tables G-16a and 1-1 reproduce them.',
        '90, 80, 80': 'the thresholds of the PEL, action-level and NIOSH presets. GRADED; inclusive (J2); no capstone input sits on one.',
        '59.9, 14.1, 56.7, 11.5': 'RAL and REL constants. TRANSCRIPTION ONLY, NEVER GRADED.',
        '0.7, 0.3, 0.2, 0.1': 'WBGT weights. TRANSCRIPTION ONLY, NEVER GRADED.',
        '0.75, 0.5, 0.3': 'NIOSH protector derating. ORACLE ONLY, NEVER GRADED.',
        '16 and 128': 'Brief and Scala denominators. The daily one is reproduced by BC OHS Reg 5.50; the weekly one is ORACLE ONLY.',
    },
    'plan': {
        'state': 'LESSONS WRITTEN (78, committed on feat/h2-hygiene-course), gates repaired 2026-09-19 before the banks: gate_capstone_leak reads the lessons (direction 8) and wave.json plus every brief (direction 9), gate_vocabulary gates digest section 24, leakage runs on all three tiers with the x60 and x1/60 scales. No bank, key truth or migration is written. No database write of any kind.',
        'thesis': 'An exposure figure is a measurement read against a criterion, and it means nothing until the criterion is named, so the course reads one record three ways, builds each metric from the formula its source prints, and says for every formula how strong the evidence behind it is.',
        'tiers': {
            'beginner': 'Associate. NOISE DOSE AND ITS CRITERIA: reference duration, decibel exchange rate, threshold, noise dose, TWA, the printed coefficients, OSHA PEL / OSHA action level / NIOSH noise REL on one record, warnings and refusals.',
            'intermediate': 'Professional. PROTECTION AND CHEMICALS: LEX,8h and exposure points, the weekly LEX, four hearing protector methods, the 8-hour chemical TWA, the STEL, the mixture index.',
            'advanced': 'Expert. HEAT, THE LONG SHIFT, AND READING THE EVIDENCE: WBGT and the one-hour averages, the NIOSH RAL and REL as published transcription-only equations, the evidence status of every formula, the published errata, the extended-shift action level, Brief and Scala, and combining exposures into a sampling decision.',
        },
        'modulesPerTier': 6, 'lessonsPerTier': 26, 'lessonsInWave': 78,
        'questionsPerTier': 132, 'questionsPerModuleBank': 15, 'examQuestions': 42,
        'panels': {'hy-noise-dosimeter': 'NoiseDosimeterExplorer.jsx', 'hy-protection-chemicals': 'ProtectionChemicalsExplorer.jsx', 'hy-heat-stress': 'HeatStressExplorer.jsx'},
        'route': '/dashboard/apps/hygiene',
        'next': 'banks (BANK_TASK.md) with a key-truth second reader (KEY_TRUTH_TASK.md), then the five-migration ladder with the go-live HELD.',
    },
    'fields': {
        'count': len(fields),
        'perTier': {t: sum(1 for f in fields if f[0] == t) for t in ('beginner', 'intermediate', 'advanced')},
        'keys': [f[1] for f in fields],
        'evidence': {k: v[0] for k, v in capstone['evidence'].items()},
        'clearanceRows': len(capstone['clearances']),
        'itemsCleared': capstone['items'],
    },
    'digest': {
        'lines': len((digest[:-1] if digest.endswith('\n') else digest).split('\n')),
        'sections': sum(1 for l in digest.split('\n') if l.startswith('# SECTION ')),
        'md5': hashlib.md5(digest.encode()).hexdigest(),
        'sha256': hashlib.sha256(digest.encode()).hexdigest(),
        'history': None,
        'note': 'The engine has no repair history, so there is no history section. Section 19 is about ERRATA IN THE SOURCES, which are current.',
    },
    'vocabulary': {
        'dose': 'always "noise dose" (flowassurance and gasprocessing dose inhibitors)',
        'exposure': 'always qualified (fdp, uncertainty, wellcost use it for money)',
        'noise': 'say "sound level" for a reading (dca, welltest, seismolord use noise for scatter)',
        'exchange rate': 'always "decibel exchange rate" (economics)',
        'heat': 'always "heat stress" (heattransfer duty; separation and relief radiation)',
        'REL': '"NIOSH noise REL" and "NIOSH heat REL" are two limits',
    },
    'scopeSeams': {
        'flare and pool-fire radiation': 'separation (FC1) and relief (FC5)',
        'BTEX emissions': 'gasprocessing (FC4)',
        'incident rates': 'safetystats (H1)',
        'risk matrix': 'riskchange',
    },
    'openItems': {},
    'closedItems': {
        'engine message names the wrong field': 'CLOSED 2026-09-19. petrolord-engines PR #220 merged (d9c1a89, main 466f21f) and the closure was re-vendored at b43f1d9. The digest rebuilt with two lines changed: section 10 now prints "wbgtPeriods[0].wbgtC must be a finite number" for heat-bad-wbgt-row, and the header states b43f1d9 and the engine source length (706 to 708 lines). Numeric literal multiset: 3366 before and after, the only change the engine line count 706 to 708; no figure moved.',
    },
    'cleared_claims': [],
    'gates': results,
}
if CHECK:
    old = json.load(open(f'{HERE}/wave.json'))
    diff = [k for k in results if old.get('gates', {}).get(k, {}).get('exit') != results[k]['exit']]
    print(f'finalise --check: {len(diff)} gate result(s) differ from wave.json: {diff}')
    sys.exit(1 if diff or bad else 0)
json.dump(WAVE, open(f'{HERE}/wave.json', 'w'), indent=1, ensure_ascii=False)
open(f'{HERE}/wave.json', 'a').write('\n')
print(f'wrote wave.json: {len(results)} gates run, {len(bad)} not at their expected exit')
for b in bad:
    print(f'  {b}')
sys.exit(1 if bad else 0)
