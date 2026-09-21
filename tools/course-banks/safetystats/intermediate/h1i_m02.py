import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m02, the Garwood exact interval.
# Figures from digest Sections 14, 15 and 16, the confidence refusals of
# Section 4, and the BLS case of Section 20. The reason taught for the upper
# tail route is the Section 16 measurement (digits lost as q shrinks, and no
# question at all at 1e-17). No capstone workplace, input or answer appears.

q(1, "For a count of 7 at 95 percent, how many degrees of freedom do the engine's two chi-square quantiles use?",
 "14 for the lower limit and 16 for the upper limit.",
 ["14 for both, as both use 2N.",
  "16 for both, as both use 2N + 2.",
  "7 for the lower limit and 8 for the upper, the count and one more, with no doubling."],
 "The Garwood limits are chi2(alpha/2; 2N)/2 and chi2(1 - alpha/2; 2N + 2)/2, so at N = 7 the lower uses 14 and the upper uses 16. Using 2N on both sides puts the upper limit too low, and using the count itself forgets that twice a gamma of shape k is a chi-square on 2k degrees of freedom.")

q(3, "Why does the Garwood upper limit use 2N + 2 degrees of freedom where the lower uses 2N?",
 "The upper limit is a gamma quantile of shape N + 1, and twice a gamma of shape k is a chi-square on 2k degrees of freedom.",
 ["A continuity correction of two degrees of freedom is added on the upper side to make the interval conservative.",
  "The upper tail sits at 1 - alpha/2, which is larger than alpha/2 and so needs more degrees of freedom.",
  "The two extra degrees of freedom carry the base and the hours."],
 "The upper limit is the Poisson mean at which N or fewer events has probability alpha/2, a quantile of the gamma distribution of shape N + 1, and doubling it gives 2N + 2 degrees of freedom. No correction is added; the conservatism comes from the whole-number count. The base and hours enter only afterwards, as a rescaling.")

q(0, "At N = 7 and 95 percent, the chi-square lower quantile on 14 degrees of freedom is 5.628726103040. What is the count lower limit?",
 "2.814363051520",
 ["5.628726103040, since the quantile is the count limit itself",
  "1.407182, which is a quarter of that quantile",
  "3.285315691895, which is the count lower limit at 90 percent"],
 "The count limit is half the chi-square quantile, and the engine's countLower is 2.814363051520. Forgetting the half returns the quantile itself. A quarter of it, 1.407182, is the BLS rate lower limit, a later step that also scales by 200,000 over 400000, and 3.285315691895 belongs to 90 percent.")

q(2, "The BLS count limits are 2.814363051520 and 14.422675361702 for 7 cases in 400000 hours on the 200,000 base. What does the engine multiply them by to get the rate limits?",
 "200,000 over 400000, which is one half.",
 ["400000 over 200,000, which is two, the hours over the base.",
  "1,000,000 over 400000, the IOGP base over the hours worked.",
  "Nothing: they are the same."],
 "Each count limit is multiplied by the base over the hours, 200,000 over 400000, giving 1.407182 and 7.211338 per 200,000 hours. Inverting the fraction doubles the limits, and the base in the multiplier must be the one named for the rate, 200,000 here.")

q(3, "The Garwood table gives count limits of 4.795388696132 and 18.390356042018 for 10 events. If those 10 events were recorded in 1000000 hours, what are the limits per 200,000 hours?",
 "0.959078 to 3.678071",
 ["4.795388696132 to 18.390356042018, since a count limit needs no scaling to become a rate",
  "1.221652 to 3.088838, the limits the IMO ladder prints for 20 events on those rates",
  "0.649395 to 4.667333, the limits the IMO ladder prints for 5 events on those rates"],
 "Multiplying each count limit by 200,000 over 1000000 gives 0.959078 and 3.678071, exactly the IMO ladder's row for 10 events. Leaving the count limits unscaled quotes them as rates, and the other two pairs are the ladder's rows for 20 and 5 events.")

q(1, "At 95 percent, how much of the miss does the engine's central interval leave above its upper limit?",
 "2.5 percent.",
 ["5 percent, the whole of alpha, placed above the upper limit.",
  "0.975, which is one minus alpha over two.",
  "None of it, since an upper limit is meant to be certain."],
 "The engine's interval is central: it splits alpha evenly and leaves alpha/2 in each tail, which is 2.5 percent at 95 percent. Putting the whole 5 percent above the upper limit is the one-sided construction, and 0.975 is the probability below the limit.")

q(0, "A learner asks for 95 percent on a count of 7 but puts the whole 5 percent in each tail. Which count limits does that produce?",
 "3.285315691895 and 13.148113802432, the central 90 percent limits.",
 ["2.814363051520 and 14.422675361702, the central 95 percent limits.",
  "2.037337478700 and 17.133593268913, the central 0.990000 limits.",
  "3.894766804876 and 11.770914461548, the central 0.800000 limits, where 10 percent sits in each tail."],
 "Five percent in each tail is a central 90 percent interval, which the digest prints for 7 as 3.285315691895 to 13.148113802432. The engine's 95 percent interval halves alpha and reads 2.814363051520 to 14.422675361702. The tempting mistake is to forget the halving, and the result is an interval that is too narrow for the label it carries.")

q(2, "For a count of 7, the upper limit climbs from 11.770914461548 to 17.133593268913 between 0.800000 and 0.990000, while the lower falls only from 3.894766804876 to 2.037337478700. Why does the upper side move further?",
 "A count cannot fall below zero and has no ceiling, so the Poisson distribution is skewed to the right.",
 ["The upper side uses two more degrees of freedom, which adds a fixed width at every confidence.",
  "The lower limit is floored at zero and so stops moving.",
  "Floating point rounding grows with the size of the limit."],
 "The right skew gives the upper tail further to stretch as the miss is squeezed, which is also why the interval is lopsided around the count. The extra degrees of freedom come from the gamma shape, add no fixed width, and the lower limit of 7 is well above zero at every level in the table.")

q(3, "At every true mean the digest probes, the coverage of the 95 percent interval is at or above 0.95. Why can it never be exactly 95 percent at every mean?",
 "A count is a whole number, so coverage jumps each time the mean crosses a limit.",
 ["The engine adds a margin with 2N + 2 on both limits.",
  "Alpha in floating point is 0.050000000000000044, so the target itself sits slightly off 95 percent.",
  "The coverage check leaves part of the distribution out, as the probabilities it sums fall short of one."],
 "At any true mean each count either has an interval that covers the mean or does not, and coverage sums the probabilities of those that do. That set changes only where the mean crosses a limit, so coverage jumps there and cannot sit on 95 percent throughout. The probabilities summed come to 1.000000 at every mean, so nothing was left out, and the floating point alpha is far too small to matter.")

q(0, "In the coverage table, which true mean pays the largest excess over 0.95?",
 "3.500000, where the coverage is 0.990126.",
 ["20.000000, where the coverage is 0.956795.",
  "0.500000, where the coverage is 0.985612, as the smallest mean probed.",
  "10.000000, at 0.975386."],
 "At 3.500000 the coverage is 0.990126, the highest in the table. At 20.000000 the excess is the smallest, 0.956795, because larger counts make the steps finer. The smallest mean probed does not carry the largest excess: 0.985612 is below 0.990126.")

q(1, "What does conservative mean for the Garwood interval?",
 "It covers the true mean at least as often as its label promises, and pays for that in width.",
 ["It is kept narrow on purpose, so that a sparse count does not alarm the reader of a monthly report.",
  "It covers the true mean exactly 95 times in a hundred at every true mean, with no excess anywhere.",
  "It rounds both limits outwards to the sixth decimal."],
 "The exact interval is built so that coverage never falls short, and the excess over 0.95 is paid in width. Under-coverage would make a sparse count look more certain than it is, which in safety work is the costly error. No rounding produces the conservatism.")

q(2, "A caller passes confidence 95 to `rateConfidenceInterval` for 7 cases in 400000 hours on the 200,000 base. What does the engine return?",
 "A refusal naming `confidence`, in the engine's own words: confidence must be a fraction strictly between 0 and 1, for example 0.95",
 ["The interval 1.407182 to 7.211338, having divided 95 by one hundred on the caller's behalf.",
  "A refusal naming `count`, since 95 is read as the number of events.",
  "An interval with no upper limit, since a confidence above one covers every rate."],
 "The engine refuses to guess whether 95 meant a percentage, and names the field `confidence`. Quietly dividing by a hundred would be a guess that happens to be right most of the time. A refusal carries no number, so nothing can be mistaken for a limit.")

q(0, "Why does `rateConfidenceInterval` have no default confidence?",
 "A silent default would give a caller who meant 0.900000 and forgot it an interval nobody asked for.",
 ["A default of 0.95 would make the interval too narrow for the small counts most crews record.",
  "Every standard sets a different confidence, so the engine cannot compute any interval without a lookup table.",
  "The default was left out to keep the function signature short."],
 "Requiring the value means every interval the engine returns was asked for at a confidence someone chose. The choice matters: the count upper limit for 7 is 13.148113802432 at 0.900000 and 14.422675361702 at 0.950000. The engine refuses a missing value with the same message it gives for 95.")

q(3, "The engine solves the Garwood upper limit on the upper tail at alpha/2, with `chiSquareQuantileUpper`. What reason does the digest measure for that choice?",
 "The lower-tail route must form 1 minus q, which loses digits as q shrinks and at 1e-17 rounds to exactly 1.",
 ["In double precision 1 minus 0.025 is not exactly 0.975, so the lower-tail route misses at 95 percent.",
  "The upper-tail route converges in fewer iterations at every confidence level that the engine accepts.",
  "Alpha at 0.95 is 0.050000000000000044, and the lower-tail route cannot represent that value."],
 "Section 16 prints that 1 minus 0.025 IS the double 0.975, and at q of 0.025 both routes give 7.377758908228. The reason is the rest of the table: the lower-tail route's error grows to 2.32e-5 at 1e-15, and at 1e-17 the number 1 minus q is 1 and the question cannot be posed. Solve the smaller tail directly.")

q(1, "On 2 degrees of freedom at q of 1e-12, the lower-tail route returns 55.262086475787 against an exact 55.262042231857. What does that show?",
 "A relative error of 8.01e-7, lost to forming 1 minus a tiny q.",
 ["A flaw in the exact column, since minus 2 ln q cannot be computed to twelve decimals.",
  "The upper-tail route's error, which the lower route corrects.",
  "An agreement to the last digit printed, as at q of 0.025."],
 "The exact figure is minus 2 ln q, which on 2 degrees of freedom is the chi-square upper quantile, and the upper-tail route matches it at 55.262042231857. The lower route's relative error at 1e-12 is 8.01e-7. Agreement to the last digit printed happens only at 0.025, where both routes give 7.377758908228.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m02.json', expect_n=15)
finish()
