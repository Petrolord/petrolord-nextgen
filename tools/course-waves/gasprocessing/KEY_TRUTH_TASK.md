# FC4 KEY TRUTH TASK. The capstones and their answer files.

## What a capstone is here

Three capstones, one a tier, **six engine-derived graded fields each**,
eighteen in the wave. A graded field is a RETURN VALUE OF THE ENGINE. It is
never arithmetic performed in the generator, never a figure typed by hand,
and never a value that reads a held-for-literature item.

The generator is `fc4_capstone.mjs`. It is already written and it runs. It
imports `fc4_fields_capstone.mjs` and nothing else from this wave, and
**nothing in the digest generator imports either of them**, which is what
keeps the two roads apart.

## The streams

| tier | stream | what it is |
|---|---|---|
| Associate | IKOT ABASI | a TEG dehydration train making pipeline spec |
| Professional | OTUMARA | a sour gas train, read as a staged device and as a mole balance |
| Expert | ESCRAVOS | a dew point skid letting down into a low temperature separator |

## Every held item is neutralised by CONSTRUCTION

Do not change any of this without re-checking the whole list, because each
one is load bearing:

- **The McKetta real-gas correction is held.** IKOT ABASI and BOTH ESCRAVOS
  water reads sit below the pressure at which the engine warns. Verified by
  asserting the `warning` field is null on all three calls. Re-run that check
  after any change to a pressure or a temperature.
- **The 1100 Btu per lb water overhead is held.** NO Associate graded field
  reads a reboiler duty. The duty is taught in the lessons; the SENSIBLE
  half, built entirely from stated inputs, is what is graded.
- **The contactor's liquid density is held and is the wrong fluid for an
  amine.** NO Professional graded field reads a contactor diameter.
- **The amine duty per gallon is a customary value.** OTUMARA states its own.
- **The BTEX absorbed fraction and molecular weight are operating values.**
  Both are stated on the one capstone that grades a BTEX figure.

## THE EXPERT ANSWER FILE IS NOT CUT

Four of the six Expert fields read the Joule-Thomson chain, which FC4-0 is
repairing. They are marked `[FC4-0]` in the generator's own output. **Cut the
Associate and Professional answer files now. Do not cut the Expert one until
FC4-0 is vendored and the generator is re-run against the repaired engine.**

The two Expert fields that do NOT move are the compressibility temperature
derivative at the inlet and the water the warm gas carries. Those two are
stable and are deliberately placed first in the list so it is obvious which
four are waiting.

## Write the go-live assertions from the engine's OUTPUT

Not from the intuition the prompt was written with. A previous wave's first
clean go-live run refused because the assertion encoded an expectation the
course itself disproved. Run the generator, read the number, assert the
number.

## The leak gate

`gate_capstone_leak.py` checks both directions: every condition in
`fc4_fields_capstone.mjs` must be absent from `digest.txt` and from
`fc4_dump.mjs`, and every graded value must be absent from `digest.txt` at
three renderings. It refuses to report success unless it swept at least ten
conditions and exactly eighteen graded values, and it fails on a dead row in
its own shared-values ledger.

**It has already caught one real leak**: an earlier IKOT ABASI absorber and
still temperature pair produced exactly the same sensible heat per gallon as
a row of the digest's own reboiler-temperature table. Run it after every
change to a condition.

## Hand back

The eighteen fields with their values and units, the held-item check re-run
and its three null warnings, the leak gate output with its counts, and a
statement of which four Expert fields are still waiting on FC4-0.
