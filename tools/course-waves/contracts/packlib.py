"""Shared readers for the SC5 wave gates: the wave, the structure, the source
table, the passages, the normalisation every text comparison uses, the lesson
tree, and a bank reader that EXECUTES a bank source with a stand-in bankkit so
its questions and their passage traces can be read without writing anything.

Every gate imports this file, and every gate's own logic stays in the gate.
"""
import importlib.util
import json
import os
import re
import sys
import types

HERE = os.environ.get('SC5_WAVE_DIR', os.path.dirname(os.path.abspath(__file__)))
WAVE = json.load(open(os.path.join(HERE, 'wave.json'), encoding='utf-8'))
REPO = os.environ.get('SC5_REPO', WAVE['repo'])
STAGE = os.environ.get('SC5_STAGE', 'foundation')
COURSE = os.environ.get('SC5_COURSE', os.path.join(REPO, 'src/content/courses/contracts'))
BANKS = os.environ.get('SC5_BANKS', os.path.join(HERE, 'banks'))
SRC_DIR = os.path.join(HERE, 'sources')

_spec = importlib.util.spec_from_file_location('structure', os.path.join(HERE, 'structure.py'))
S = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(S)

# Everything in the NextGen app a learner of this course reads.
APP_TEXT = [os.path.join(REPO, p) for p in (
    'src/pages/apps/ContractsLearningPage.jsx',
    'src/pages/apps/PracticeCourseLearningPage.jsx',
    'src/components/course/PracticeCourseBadge.jsx',
    'src/components/course/PracticeCourseNotice.jsx',
    'src/components/course/PracticeCertificateCard.jsx',
    'src/lib/courseType.js',
)]
BRIEFS = [os.path.join(HERE, f) for f in ('BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md')]


def sources():
    return json.load(open(os.path.join(SRC_DIR, 'SOURCES.json'), encoding='utf-8'))


def passages():
    return json.load(open(os.path.join(HERE, 'passages.json'), encoding='utf-8'))['passages']


def norm(t):
    """The one normalisation every verbatim comparison uses: typographic quotes
    and apostrophes made plain, soft hyphens dropped, a word hyphenated across a
    line break joined, every run of whitespace one space."""
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('­', '').replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    t = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', t)
    return re.sub(r'\s+', ' ', t).strip()


def source_text(src):
    """The fetched text of a source, or None for a concept-only entry."""
    if not src.get('txt'):
        return None
    p = os.path.join(SRC_DIR, src['txt'])
    if not os.path.exists(p):
        raise FileNotFoundError(f"{src['id']}: its text {p} is missing")
    return open(p, encoding='utf-8', errors='replace').read()


def lessons():
    """Every lesson as (tier, module_key, lesson_key, title, topics, path, text or None)."""
    out = []
    for tier, mods in S.TIERS.items():
        for mkey, _mt, ls in mods:
            for lkey, title, _m, topics in ls:
                p = os.path.join(COURSE, tier, mkey, f'{lkey}.md')
                out.append((tier, mkey, lkey, title, topics, p,
                            open(p, encoding='utf-8').read() if os.path.exists(p) else None))
    return out


def is_stub(text, title):
    return text is not None and text.strip() == f'# {title}'


def manifest_titles():
    out = []
    for tier in S.TIERS:
        p = os.path.join(COURSE, tier, 'manifest.json')
        if os.path.exists(p):
            m = json.load(open(p, encoding='utf-8'))
            out.append((f'{tier}/manifest.json', '\n'.join(
                [mm['title'] for mm in m['modules']] + [l['title'] for mm in m['modules'] for l in mm['lessons']])))
    return out


def read_bank(py_path):
    """Execute one bank source with a stand-in bankkit. Returns
    {'emit_path', 'expect_n', 'Q', 'TRACE'}; nothing is written."""
    seen = {}
    fake = types.ModuleType('bankkit')

    def emit(Q, path, label=None, expect_n=None):
        seen['emit_path'], seen['expect_n'] = path, expect_n
        return None
    fake.emit = emit
    fake.finish = lambda: None
    saved = sys.modules.get('bankkit')
    sys.modules['bankkit'] = fake
    try:
        g = {'__name__': '__bank__', '__file__': py_path}
        exec(compile(open(py_path, encoding='utf-8').read(), py_path, 'exec'), g)
    finally:
        if saved is not None:
            sys.modules['bankkit'] = saved
        else:
            del sys.modules['bankkit']
    return {'emit_path': seen.get('emit_path'), 'expect_n': seen.get('expect_n'),
            'Q': g.get('Q'), 'TRACE': g.get('TRACE')}


def bank_strings():
    """Every string a learner reads in the 21 banks: from the emitted JSON when
    it exists, else from the source (the questions it holds so far)."""
    out = []
    for tier, bid, stem, n in S.banks():
        j = os.path.join(BANKS, f'{stem}.json')
        if os.path.exists(j):
            for i, q in enumerate(json.load(open(j, encoding='utf-8'))):
                out.append((f'banks/{stem}.json Q{i + 1}', '\n'.join([q['prompt'], q['explanation']] + q['options'])))
        else:
            b = read_bank(os.path.join(BANKS, f'{stem}.py'))
            for i, (k, p, c, ds, e) in enumerate(b['Q'] or []):
                out.append((f'banks/{stem}.py Q{i + 1}', '\n'.join([p, c, e] + list(ds))))
    return out


def unwrap(text):
    return re.sub(r'(?<!\n)\n(?!\n|#|\||\s*[-*]|\s*\d+\.)', ' ', text)
