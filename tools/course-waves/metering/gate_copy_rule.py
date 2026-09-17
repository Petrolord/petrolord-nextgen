#!/usr/bin/env python3
"""GATE: the owner copy rule, over everything a learner reads.

No em dashes, no en dashes, and no "X, not Y" contrastive, in the digest, in any
lesson body, or in any manifest title. Headings included.

The digest is swept because every lesson is written from it, so a contrastive in
the digest becomes a contrastive in a lesson.

FOUR STRINGS THE ENGINES THEMSELVES OWN. The vendored engines' own note and
refusal text carries four contrastives, and the digest quotes those messages
VERBATIM, because a digest that paraphrases a message teaches a sentence the
learner will never see on the screen. They are exempted BY EXACT FRAGMENT in
ENGINE_TEXT below, with the finding recorded against the engine, and a DEAD
exemption fails this gate: a row that clears nothing is a claim about work never
done. Every writer brief in this wave says the same thing: quote the message
inside backticks as the engine's own words and never write a contrastive of your
own.

REFUSALS. Exit 2 if the digest is missing, if fewer than 500 lines were read, or
if the course directory exists with lesson files in it and not one was examined.
A gate that reports success while examining nothing validates nothing.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.environ.get('FC8_COURSE', '/root/wt-fc8-nextgen/src/content/courses/metering')
DASHES = re.compile('[—–]')
CONTRASTIVE = re.compile(r',\s+not\s+\w')

# Verbatim engine text the digest quotes. Each is the engine's OWN words, and
# each is a FINDING against the repaired engine: the message breaches the owner
# copy rule and should be recast upstream.
ENGINE_TEXT = {
    'these are table values, not a calculation':
        "straightRunDiameters' note on every answered row. The digest quotes it verbatim "
        "because it is the sentence that stops a table value being read as a calculation, "
        "and a learner running the shipped app sees exactly these words.",
    "stated screen, not a value read from a":
        "valveAuthority's thresholdBasis. It is the sentence that tells the reader the "
        "0.5 and 0.25 boundaries belong to the engine rather than to a standard, which is "
        "the whole point of printing it.",
    'whether to ask the question, not to':
        "noiseIndication's note. It is the sentence that draws the line between a screening "
        "indication and a prediction, and a paraphrase would blur exactly that line.",
    'the water test governs this course, not the product':
        "shellCourse's note when the hydrostatic test governs. It is the one sentence in "
        "the tank module that names the mistake it exists to prevent, so the exact wording "
        "is the lesson.",
}


def sweep(label, text):
    out = []
    for i, line in enumerate(text.split('\n'), 1):
        if DASHES.search(line):
            out.append((label, i, 'dash', line.strip()[:110], None))
        for _m in CONTRASTIVE.finditer(line):
            hit = next((k for k in ENGINE_TEXT if k in line), None)
            out.append((label, i, 'contrastive', line.strip()[:110], hit))
    return out


def main():
    digest_path = os.path.join(HERE, 'digest.txt')
    if not os.path.exists(digest_path):
        print('  GATE REFUSES: no digest.txt')
        return 2
    findings, files, lines, lesson_files = [], 0, 0, 0
    d = open(digest_path, encoding='utf-8').read()
    findings += sweep('digest.txt', d)
    files += 1
    lines += d.count('\n') + 1
    on_disk = 0
    if os.path.isdir(COURSE):
        for root, _, names in os.walk(COURSE):
            for nm in sorted(names):
                p = os.path.join(root, nm)
                if nm.endswith('.md'):
                    on_disk += 1
                    t = open(p, encoding='utf-8').read()
                    findings += sweep(os.path.relpath(p, COURSE), t)
                    files += 1
                    lesson_files += 1
                    lines += t.count('\n') + 1
                elif nm == 'manifest.json':
                    m = json.load(open(p, encoding='utf-8'))
                    titles = [mm['title'] for mm in m.get('modules', [])] + \
                             [ls['title'] for mm in m.get('modules', []) for ls in mm.get('lessons', [])]
                    findings += sweep(os.path.relpath(p, COURSE), '\n'.join(titles))
                    files += 1
                    lines += len(titles)
    exempt = [f for f in findings if f[4]]
    bad = [f for f in findings if not f[4]]
    hit = sorted({f[4] for f in exempt})
    dead = sorted(set(ENGINE_TEXT) - set(hit))
    print(f'  files examined: {files}  (lesson bodies: {lesson_files}, lesson files on disk: {on_disk})')
    print(f'  lines and titles examined: {lines}')
    print(f'  exempt engine strings declared: {len(ENGINE_TEXT)}, hit: {len(hit)}, dead: {len(dead)} -> {dead}')
    print(f'  quotations of engine text found: {len(exempt)}')
    print(f'  VIOLATIONS: {len(bad)}')
    for f, i, kind, ctx, _ in bad:
        print(f'   {kind.upper()} {f}:{i}  {ctx}')
    if lines < 500 or (on_disk and lesson_files == 0):
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if dead:
        print('  GATE FAILS: an exempt engine string nothing quotes is a dead row, not an amnesty')
        return 1
    return 1 if bad else 0


sys.exit(main())
