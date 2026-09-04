# Two correlations, one dose

Two relations describe the same hydrate depression and they disagree at every concentration. The engine computes both, prints both, and sizes with one of them.

{{panel:pd-hydrate-explorer}}

## What each relation is written in

Hammerschmidt is a depression in weight terms: K W over M times 100 less W, with W the inhibitor weight percent in the aqueous phase and M its molecular weight. The engine carries K on each inhibitor rather than as one global, and all four ship the same 2335, with methanol at molecular weight 32.04, MEG at 62.07, DEG at 106.12 and TEG at 150.17. Nielsen-Bucklin is a depression in mole terms, 129.6 times the negative logarithm of the water mole fraction, and the engine holds NIELSEN_BUCKLIN_CONSTANT_F = 129.600000 degF and WATER_MOLECULAR_WEIGHT = 18.015000 to get from one variable to the other.

## The gap at every concentration

Engine values, methanol.

| Weight percent | Hammerschmidt, degF | Nielsen-Bucklin, degF | Spread, degF | Ratio |
| --- | --- | --- | --- | --- |
| 5.0 | 3.8356659439 | 3.7795926053 | 0.0560733386 | 1.0148358155 |
| 10.0 | 8.0975169926 | 7.8537784436 | 0.2437385490 | 1.0310345588 |
| 15.0 | 12.8607622824 | 12.2606690615 | 0.6000932210 | 1.0489445737 |
| 20.0 | 18.2194132335 | 17.0456465761 | 1.1737666573 | 1.0688602015 |
| 25.0 | 24.2925509779 | 22.2632773467 | 2.0292736312 | 1.0911489175 |
| 30.0 | 31.2332798288 | 27.9798914770 | 3.2533883518 | 1.1162759460 |

At 50.0 weight percent the same two read 72.8776529338 degF and 57.8193913158 degF, a spread of 15.0582616180 degF on a ratio of 1.2604361837.

## Where the engine draws its own line

HAMMERSCHMIDT_RELIABLE_WT_PCT is 25.0 weight percent. At or below it `depression` returns `reliable: true` and reports Hammerschmidt as `recommendedF`. Above it, for methanol, `basis` flips to `nielsenBucklin` and `recommendedF` becomes the smaller of the two: at 30.0 weight percent it is 27.9798914770 degF and not 31.2332798288 degF. The flip changes which number is printed. It does not change the concentration anybody picked.

## The mistake

Reading `reliable: true` as the two relations agreeing. At the reliability line itself, 25.0 weight percent methanol, the spread is 2.0292736312 degF, which is 9.114892 percent of the Nielsen-Bucklin value, and the engine still returns `reliable: true`. The relations do not begin to disagree at 25. They already disagree at 5.0 weight percent, where the ratio is 1.0148358155, and the gap widens without any step in it.

## What the pair refuses

Neither relation says where the hydrate boundary is. Both return a shift, and what to shift is a laboratory number somebody else supplies. The module also refuses to choose between them: it reports both, carries the difference in `spreadF`, and calls the disagreement information rather than resolving it. That is a defensible position for a function whose job is to report. It stops being defensible one call up, where a single number has to come out. Choosing is left to the caller, and one function in this module chooses by accident, sizing with one relation and checking the result with the other.

## Exercise

Compute the methanol depression at 20.0, 25.0 and 30.0 weight percent and record `hammerschmidtF`, `nielsenBucklinF`, `basis` and `reliable` at each.

Then say which of the three rows changes `basis`, and say what changed about the chemistry between 25.0 and 30.0 weight percent to justify it.
