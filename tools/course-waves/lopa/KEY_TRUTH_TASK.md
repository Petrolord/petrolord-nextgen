# H3 Process Safety: LOPA & SIL Determination: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course; the engine's FINDINGS record, the oracle and the
engine's source comments are PROVENANCE.

## TWO JOBS

1. **The key truths.** One sentence a learner should be able to say afterwards,
   with the number that makes it checkable. A claim with evidence.
2. **The second reader of every bank, before `gen_migration.py`.** The kit's
   README section 10: a bank can be gate-green and mis-keyed, and no gate reads
   the answer. Read prompt, options, explanation, digest and lesson for every
   question, one tier at a time, and swap roles where the explanation supports a
   distractor.

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A LOPA row is one frequency times probabilities: ORONI's 0.45 per year
   becomes 0.013500000000 after its enabling condition and two modifiers.
2. An IPL earns credit only when flagged independent, exactly true, and not
   unauditable: ORONI credits two of four, and crediting all four would move its
   required RRF from 13.500000 to 0.135000.
3. The required RRF is the frequency over the TMEL, and its reciprocal is the
   required PFDavg: 13.500000 and 0.074074074074 for ORONI at 1e-6.
4. The required PFDavg is the binding target: at a TMEL of 1e-7 a SIF of 0.009
   sits in the SIL 2 band and misses the required 0.007407407407.
5. An exact decade belongs to the lower SIL, and the engine snaps within one part
   in a billion: 3 of 5 decade products land at 100.00000000000001 in double.
6. A requirement beyond SIL 3 is a redesign reported with its number: at an RRF
   of 500000 the required PFDavg is 0.000002000000, below the SIL 4 band.

### Professional

7. PFDavg in 1oo1 is half of lambdaDU T: 0.005256000000 against 0.010512000000.
8. Detected failures pull the channel down time far below T1/2 and raise the
   failure rate: tCE 1322.000000 hours against 4380.000000.
9. The simplified forms are the Annex B form with no detected failures and no
   MRT, identical on all five architectures.
10. Common cause dominates the 1oo2 from a beta factor of 0.02, and 2oo2 carries
    no beta factor term at all.
11. A SIF is the sum of its subsystems: the teaching SIF sums to 0.001792971954,
    with the valves carrying 71.78 percent.
12. The published worked SIF reproduces to 1.29E-03 and an RRF of 777, with MRT
    equal to the MTTR.

### Expert

13. PFDavg in 1oo1 with no detected failures doubles with every doubling of T1;
    a redundant subsystem climbs toward four times.
14. A target below the coverage floor is UNACHIEVABLE whatever the interval:
    0.011847600000 at a coverage of 0.7 on the OBAGI valve.
15. Annex B never falls below the time dependent route; the largest departure in
    the golden is 15.12 percent, at a lambda T of 0.438000.
16. The published coverage table reproduces only with an inferred lifetime of 10
    years, and one row only with the beta factor raised to 0.15.
17. The engine has no hardware fault tolerance check and no high demand mode.
18. A SIL that holds is not a requirement that holds: stretched to 3.5 years the
    teaching SIF misses its TMEL while still SIL 2.

## THE RULES

Digest section 32's vocabulary is binding. No em dashes, no en dashes, no "X,
not Y" contrastive. No key truth may carry a capstone facility, distinctive
input or graded answer at any precision.
