import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m05, formal tests and many variables.
# Figures from digest Section 22 (Grubbs, the critical table, masking),
# Section 23 (the Mahalanobis distance on the EKENE-7 oil sand, the alpha
# table), Section 4 (the alpha and rows refusals) and Section 17 recaps. No
# capstone well, input or answer appears.

q(2, "What is Grubbs' G on the fourteen EKENE-7 core plugs with the one fractured plug?",
 "2.985356",
 ["2.507321",
  "3.611249",
  "5.890633"],
 "The Grubbs lesson prints G 2.985356, which equals the largest |z| of the z-score module. 2.507321 is the two-sided critical value at alpha 0.05, 3.611249 is the t point used to build it, and 5.890633 is the plugs' largest modified z-score.")

q(0, "For the two-sided test on the fourteen plugs at alpha 0.05, which t point does the engine use to build the critical value?",
 "The upper 0.001786 point of Student's t on 12 degrees of freedom.",
 ["The upper 0.05 point on 13 df.",
  "The upper 0.025 point on 14 df.",
  "The upper 0.001786 normal point."],
 "The Grubbs lesson: t is the upper alpha / (2N) point of Student's t on N - 2 degrees of freedom, and the table prints the tail probability 0.001786 and t 3.611249 for N = 14. Dividing alpha by 2N is the correction for testing the largest of N values.")

q(3, "The two-plug copy of the core set faces the same critical value, 2.507321, as the one-plug set. Why?",
 "The critical value depends on n, alpha and the side only, and all three are unchanged.",
 ["The engine caches the first critical value it computes and reuses it for every later call on core data.",
  "The two sets have the same mean.",
  "The second high plug sits exactly on the critical value, so the engine holds the value fixed there."],
 "The Grubbs lesson: the critical value depends on n, alpha and the side only; the values the rows were run on do not enter it. Both sets hold fourteen plugs, tested two-sided at 0.05.")

q(1, "With a second high plug at entry 2, what does Grubbs' test report on the fourteen plugs?",
 "G 2.275359 below the critical 2.507321, so no rejection.",
 ["G 2.985356 above 2.507321, with entry 2 as the suspect.",
  "G 2.275359 above a critical value that fell to 2.371654.",
  "A refusal, since the test is for one outlier and the set holds two."],
 "The Grubbs lesson's masking row: sample SD 0.024800, G 2.275359, critical 2.507321, reject false, suspect entry 8. 2.371654 is the one-sided critical at n = 14, and the engine runs the test with no refusal.")

q(2, "In the masking example, what moves G from 2.985356 down to 2.275359?",
 "The second plug raises the sample SD from 0.019859 to 0.024800.",
 ["The critical value rises.",
  "The suspect switches to entry 2.",
  "The engine drops the most extreme plug and tests the next one, as a generalised ESD test would."],
 "The Grubbs lesson: with a second high plug the sample SD rises from 0.019859 to 0.024800, and G falls to 2.275359. The critical value stays 2.507321, the suspect stays entry 8, and the generalised ESD test is not built.")

q(0, "What is the one-sided critical value for Grubbs' test at n = 14 and alpha 0.05?",
 "2.371654",
 ["2.507321",
  "3.474396",
  "2.031652"],
 "The Grubbs lesson's table prints 2.371654 one-sided and 2.507321 two-sided at n = 14. 3.474396 is the largest G fourteen values can produce, and 2.031652 is the one-sided critical at n = 8.")

q(3, "How does the two-sided Grubbs critical value at alpha 0.05 move across the table's sample sizes, from 6 to 30?",
 "It rises, from 1.887145 to 2.908473.",
 ["It falls, from 2.908473 to 1.887145, since a larger sample makes the estimate steadier.",
  "It holds near 3 at every size, the same bar the z-score uses.",
  "It tracks the largest possible G row by row, since the critical value is that ceiling."],
 "The Grubbs lesson prints 1.887145 at n = 6 rising to 2.908473 at n = 30. The largest possible G runs from 2.041241 to 5.294651 over the same rows, above the critical value at every n.")

q(2, "At ten values the z-score cannot pass 3, since its ceiling is 2.846050. Can Grubbs' test reject at ten values and alpha 0.05, two-sided?",
 "Yes: its critical value is 2.289954, below the ceiling of 2.846050.",
 ["No, since Grubbs' G is the largest |z| and so shares the z-score's ceiling of 3.",
  "No: the engine refuses Grubbs' test below eleven values.",
  "Only one-sided, at 2.176068."],
 "The Grubbs lesson prints the two-sided critical 2.289954 and the largest possible G 2.846050 at n = 10. G shares the ceiling, and the bar it must clear is 2.289954 in place of 3, so a rejection is reachable one-sided (2.176068) or two-sided.")

q(1, "What does the engine offer for a sample that may hold several outliers?",
 "Grubbs for one outlier only; the generalised ESD test is not built.",
 ["The generalised ESD test, run automatically whenever Grubbs rejects its first suspect.",
  "Grubbs repeated, removing each suspect.",
  "A robust covariance, which the engine applies to any single-channel series."],
 "The Grubbs lesson: the test is for ONE outlier; NIST points to the generalised ESD test for several, which the engine does not build. The engine notes repeat it in the list of what is not built, beside the robust covariance.")

q(0, "What cutoff does `mahalanobis` compare squared distances with on the EKENE-7 oil sand, density and neutron, at the default alpha?",
 "7.377759",
 ["5.991465",
  "9.210340",
  "22.397696"],
 "The Mahalanobis lesson: the default alpha is 0.025 and the cutoff is the chi-square 0.975 quantile on 2 degrees of freedom, 7.377759. 5.991465 is the cutoff at alpha 0.05, 9.210340 at 0.010000, and 22.397696 is entry 60's squared distance.")

q(0, "Oil sand entry 60 reads z -1.074527 on density and -1.645167 on neutron, and neither channel's z-score flags anything. Why does `mahalanobis` flag it at 22.397696?",
 "The pair sits off the density-neutron trend, which only a distance that knows the correlation sees.",
 ["Its density alone is beyond the sand's range, and the distance simply adds the two z-scores together.",
  "The distance uses the population covariance, which inflates every row's distance above the z-scores.",
  "Entry 60 sits beside the density gap, and rows next to a gap are weighted up in the covariance."],
 "The Mahalanobis lesson: each value alone is ordinary, and the pair sits off the trend; the correlation, -0.836264, is what the distance knows. The covariance is the sample one (n - 1), and a density and a neutron inside their sand ranges are what the generator planted.")

q(2, "Of the 60 oil sand rows, how many enter the Mahalanobis calculation, and why?",
 "48: rows with a missing value, EKENE-7 entries 80 to 91, are skipped and listed.",
 ["60: missing densities are filled with the column mean before the covariance is built.",
  "50: the gap's two edge rows are kept, carrying a neutron value alone.",
  "12: only rows beside the density gap are used, so the covariance reflects the pad lift."],
 "The Mahalanobis lesson: 60 rows, 48 complete rows used, and the skipped entries are 80 to 91, the twelve-sample density gap. The engine fills nothing, and rows with a missing value are skipped and listed.")

q(1, "At alpha 0.05 the cutoff on 2 degrees of freedom is 5.991465. Which oil sand rows are flagged?",
 "Entries 60 and 62.",
 ["Entry 60 alone, since the flag count does not move with alpha.",
  "Entries 60, 62 and 56.",
  "Entry 62 alone, since 60 is masked."],
 "The Mahalanobis lesson: at 0.050000 two rows are flagged. Entry 62's d^2 of 6.581737 is above 5.991465 and entry 60's 22.397696 is too; entry 56, at 5.442663, comes in only at alpha 0.100000 with the cutoff 4.605170.")

q(3, "What covariance does `mahalanobis` use, and what does its basis block call it?",
 "The sample covariance (n - 1) with the classical mean, labelled classical and not robust.",
 ["A robust covariance that down-weights rows far from the centre, labelled robust.",
  "The population covariance (n), labelled classical, as the chi-square cutoff assumes.",
  "A covariance from the rows below the cutoff only, refitted until no row is flagged."],
 "The Mahalanobis lesson: d^2 uses the classical mean and the SAMPLE covariance S (n - 1), and a robust covariance is not built. The engine notes quote the label \"sample covariance (n - 1), classical (not robust)\".")

q(0, "A caller passes four rows in which the neutron is exactly twice the density. What does `mahalanobis` return?",
 "A refusal naming `rows`: the covariance matrix is singular.",
 ["A distance of zero for every row, since the rows lie on one line.",
  "A refusal naming `alpha`, since the chi-square cutoff needs more rows.",
  "Four flags, one per row, because the correlation is perfect."],
 "The refusal table lists the refusal for one variable a multiple of the other, field `rows`: \"rows have a singular covariance matrix: a variable is constant or one is a linear combination of others\". Four rows meet the minimum of p + 2 = 4, so the singular matrix is what refuses.")

emit(Q, '/root/wt-dai-d1-nextgen/tools/course-banks/dataqc/intermediate/d1i_m05.json', expect_n=15)
finish()
