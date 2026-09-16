# The committed course wave inputs

Every NextGen course is built in a wave directory outside the repository, at
`/root/<prefix>-wip-<wave>/`. Two files out of that directory are what the
course's test suites pin their numbers against:

* `digest.txt`, the teaching digest. Every number the 78 lessons quote is a
  line in it, printed by the wave's dump generator straight out of the engines.
* `fields.json`, the eighteen graded capstone answers with their tolerances.

## Why they are committed here

They were not, and that had one large consequence: **the course lab and
capstone guard suites had never run in CI, and could not have.** Each suite
read those two files from an absolute path under `/root`. A GitHub runner has
no `/root/fc-wip-rotating`, so a suite either died on a missing file or, in the
suites that guarded the read with `fs.existsSync`, skipped itself and reported
success. Neither was ever seen, because the CI job had no vitest step at all:
`build-and-test` ran lint, the vendored engine checks and a build. A course
pull request's green tick never meant a single course gate had run.

The inputs live here now and **the committed copy is the default read**. The
suites run anywhere, CI included, and a missing input fails by name instead of
skipping. `waveInputs.mjs` is the resolver they all use.

## Pointing a suite at a live wave directory

A wave author mid-build wants the suite to read the directory the generators
actually write to. Either environment variable does that, and the committed
copy stays the default when neither is set:

```sh
NEXTGEN_WAVE_DIR=/root/fc-wip-rotating npx vitest run src/components/course/panels/rotating
NEXTGEN_WAVE_DIR_ROTATING=/root/fc-wip-rotating npx vitest run src/components/course/panels
```

`NEXTGEN_WAVE_DIR` applies to whichever wave asks, which suits running one
suite. The per-wave form names its wave and is the one to use when several
suites run together.

## The two kit shapes

`waves.json` records `kit` for each wave.

* `full` (FC1, FC2, FC3) mirrors everything the wave is rebuilt from: the
  digest, the fields, every generator, the tier headers, the seed ladder, the
  oracle and the verifier. `mirrorcheck.py` in the wave kit gates this shape
  byte for byte in both directions.
* `inputs` (EC2 to EC6, PD2 to PD9) mirrors the files the suites read, plus the
  generators that spell what those files carry. These waves shipped and merged
  before anything was committed here, and their full kits still live only in
  their wave directories. Committing the inputs is what makes their suites
  portable; it is not a claim that the whole wave is reproducible from the
  repository.

## The drift check

A committed copy can go stale, and a stale copy keeps every gate green while
pinning numbers nothing produces any more. `check-wave-inputs.mjs` is the check
that stops that, and CI runs it before the gates:

```sh
node tools/course-waves/check-wave-inputs.mjs           # check
node tools/course-waves/check-wave-inputs.mjs --update  # re-pin after a re-cut
```

It proves three things per wave and prints every one of them: that each listed
input is present and carries bytes; that `digest.txt` and `fields.json` match
the sha256 pinned in `waves.json`, so re-cutting a wave has to re-pin in the
same commit where a reviewer can see it; and that every section heading the
digest prints and every graded field name `fields.json` carries is spelled by a
generator committed beside it. Known exceptions are recorded per wave with a
count, so a new one is a failure while the recorded ones stay in the output.

## What a new wave must do

Starting at FC5, a wave is not finished until this is true:

1. **Commit the wave's inputs to `tools/course-waves/<wave>/` in the same pull
   request as the course.** At minimum `digest.txt`, `fields.json`, `wave.json`
   and every generator that spells a section heading or a graded field name.
2. **Add the wave to `waves.json`**, with its course code, its live directory,
   its `inputs` list, and its pins from `--update`.
3. **Read the inputs through `waveInputs.mjs`.** No test file may contain a
   `/root/` path. `waveInput(WAVE_NAME, 'digest.txt')` is the whole of it.
4. **Never guard a read with `existsSync` and a `return` or a `skipIf`.** A
   gate that empties itself when its subject is missing reports success without
   examining anything, which is this programme's most repeated defect. Absence
   is a failure, and the message names the file.
5. **Run `npx vitest run src/components/course/panels` before opening the pull
   request**, and run it with the wave directory renamed, because that is the
   only check that the suite will run on a CI runner at all.
