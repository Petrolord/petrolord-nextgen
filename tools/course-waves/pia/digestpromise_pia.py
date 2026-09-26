#!/usr/bin/env python3
"""THE KIT'S digestpromise.py, RUN ON THE DIGEST WITH THE GAZETTE QUOTATIONS MASKED.

WHY. The EC7 digest quotes the gazetted texts verbatim (concepts.json, verified
by quote_check.py), and an Act cross-refers to its own sections: "in section
267", "section 196". The kit gate reads "in section N" as the DIGEST promising
its own Section N, and there is no Section 267. A cross-reference inside a
verbatim quotation of an Act is the Act's, never the digest's.

WHAT IS MASKED, AND NOTHING ELSE. A double-quoted span whose text is EXACTLY a
quotation concepts.json carries (as the digest prints it, each dash shown as a
colon) is blanked in a scratch copy; every other line, including every
sentence the digest writes itself, is swept by the kit gate unchanged, with the
wave's BRIEF.md for module coverage.

    python3 digestpromise_pia.py            run
    python3 digestpromise_pia.py --plant    THE NEGATIVE CONTROL: appends a digest
                                            sentence promising "see section 99";
                                            must exit 1 naming it
"""
import json, os, re, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.environ.get('EC7_KIT', '/root/dc-wavekit')


def dashfix(q):
    return re.sub(r'\s*[–—]\s*', ': ', q)


def main():
    digest = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    concepts = json.load(open(os.path.join(HERE, 'concepts.json'), encoding='utf-8'))
    quotes = {'"' + dashfix(re.sub(r'\s+', ' ', c['quote']).strip()).replace('|', '/') + '"' for c in concepts}
    masked = 0
    for q in sorted(quotes, key=len, reverse=True):
        n = digest.count(q)
        if n:
            masked += n
            digest = digest.replace(q, '"(a gazette quotation, verified by quote_check.py)"')
    if masked < len(concepts):
        print(f'REFUSED: only {masked} of {len(concepts)} gazette quotations were found to mask; the digest and concepts.json disagree')
        return 2
    if '--plant' in sys.argv:
        digest += '\nA planted sentence: see section 99 for the rest.\n'
    tmp = tempfile.mkdtemp(prefix='ec7-promise-')
    try:
        open(os.path.join(tmp, 'digest.txt'), 'w', encoding='utf-8').write(digest)
        for f in ('BRIEF.md', 'wave.json'):
            if os.path.exists(os.path.join(HERE, f)):
                shutil.copy(os.path.join(HERE, f), tmp)
        p = subprocess.run(['python3', os.path.join(KIT, 'digestpromise.py'), tmp], capture_output=True, text=True)
        out = p.stdout + p.stderr
        print(f'  gazette quotations masked: {masked}')
        print(out.rstrip())
        if '--plant' in sys.argv:
            caught = 'promises Section 99' in out
            print(f'  NEGATIVE CONTROL: a promise of section 99 was planted; {"caught" if caught else "NOT CAUGHT"}')
            return 1 if caught and p.returncode != 0 else 2
        return p.returncode
    finally:
        shutil.rmtree(tmp)


sys.exit(main())
