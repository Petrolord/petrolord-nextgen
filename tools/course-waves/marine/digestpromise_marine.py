#!/usr/bin/env python3
"""THE KIT'S digestpromise.py, RUN ON THE SC4 DIGEST, WITH ITS NEGATIVE CONTROL.

The SC4 digest quotes no source, so nothing is masked (the EC11 wrapper masked
the Act's cross-references inside its verbatim quotations). This runs the kit
gate on a scratch copy of digest.txt, BRIEF.md and wave.json, so a planted
sentence never touches the real digest.

    python3 digestpromise_marine.py            run
    python3 digestpromise_marine.py --plant    THE NEGATIVE CONTROL: appends a digest
                                               sentence promising "see section 99";
                                               must exit 1 naming it
"""
import os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
KIT = os.environ.get('SC4_KIT', '/root/dc-wavekit')


def main():
    digest = open(os.path.join(HERE, 'digest.txt'), encoding='utf-8').read()
    if '--plant' in sys.argv:
        digest += '\nA planted sentence: see section 99 for the rest.\n'
    tmp = tempfile.mkdtemp(prefix='sc4-promise-')
    try:
        open(os.path.join(tmp, 'digest.txt'), 'w', encoding='utf-8').write(digest)
        for f in ('BRIEF.md', 'wave.json'):
            if os.path.exists(os.path.join(HERE, f)):
                shutil.copy(os.path.join(HERE, f), tmp)
        p = subprocess.run(['python3', os.path.join(KIT, 'digestpromise.py'), tmp], capture_output=True, text=True)
        out = p.stdout + p.stderr
        print(out.rstrip())
        if '--plant' in sys.argv:
            caught = 'promises Section 99' in out
            print(f'  NEGATIVE CONTROL: a promise of section 99 was planted; {"caught" if caught else "NOT CAUGHT"}')
            return 1 if caught and p.returncode != 0 else 2
        return p.returncode
    finally:
        shutil.rmtree(tmp)


sys.exit(main())
