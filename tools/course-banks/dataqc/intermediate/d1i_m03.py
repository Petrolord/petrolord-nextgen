import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m03, quartiles and Tukey fences.
# Figures from digest Section 19 (R6, R7, R8; the silicon wafers; the water
# sand quartiles), Section 20 (the fences, the whole log, the golden on the
# fence), Section 4 (the k refusal) and Section 32 (no P label). Every fence a
# distractor quotes belongs to a different rule or k than the one the prompt
# states. No capstone well, input or answer appears.

q(2, "Which quantile rule places the position at h = p(N + 1)?",
 "R6",
 ["R7",
  "R8",
  "R9"],
 "Section 19: h = p(N + 1) for R6, 1 + p(N - 1) for R7 and p(N + 1/3) + 1/3 for R8. The engine implements those three only, as NIST/SEMATECH 7.2.6.2 states them.")

q(0, "Which quartile rule does `iqrFences` use when the caller leaves `method` unset?",
 "R7, the default of Excel, R and numpy.",
 ["R6, as NIST's own rule.",
  "R8, as the fence rule.",
  "Whichever rule gives the widest IQR on the series passed."],
 "Section 20: quartiles by the stated rule, R7 by default, and Section 19 names R7 as the default of Excel, R and numpy. R6 is NIST's rule and is available by name, and the engine never picks a rule from the data.")

q(3, "What is the first quartile of the EKENE-7 water sand gamma ray, entries 130 to 199, by R8?",
 "31.825833",
 ["31.817500",
  "31.947500",
  "38.725833"],
 "Section 19 prints Q1 as 31.817500 by R6, 31.947500 by R7 and 31.825833 by R8. 38.725833 is the R8 third quartile.")

q(1, "On the water sand gamma ray, which rule gives the widest interquartile range?",
 "R6, at 6.920000.",
 ["R8, at 6.900000.",
  "R7, at 6.695000.",
  "None: all three give one IQR."],
 "Section 19 prints the derived IQR as 6.920000 by R6, 6.900000 by R8 and 6.695000 by R7. R6 is the widest, R8 close behind, R7 the narrowest; the three are not equal even on seventy samples.")

q(2, "What is the upper fence on the water sand gamma ray at the defaults, R7 and k 1.5?",
 "48.685000",
 ["49.117500",
  "58.727500",
  "38.642500"],
 "Section 20 prints the default upper fence as 48.685000, Q3 + 1.5 IQR on the R7 quartiles. 49.117500 is the R6 upper fence at k 1.5, 58.727500 the R7 fence at k 3, and 38.642500 the R7 third quartile itself.")

q(0, "A colleague reports the water sand's upper fence at R7 and k 1.5 as 49.117500. What went wrong?",
 "That is the R6 fence; at R7 and k 1.5 the upper fence is 48.685000.",
 ["Nothing; that is the R7 fence at the defaults.",
  "That is the far out fence at k 3 on the same R7 quartiles, which reads 58.727500 on the table.",
  "That is the whole-log upper fence."],
 "Section 20 prints the R6, k 1.5 upper fence as 49.117500 and the default R7, k 1.5 fence as 48.685000. The R7, k 3 fence is 58.727500 and the whole-log fence 186.810000, so the colleague's figure belongs to R6 alone.")

q(3, "The caller changes the water sand run from R7 to R6, keeping k 1.5. What happens?",
 "The IQR widens to 6.920000, the fences move out to 21.437500 and 49.117500, and entry 170 is still the only flag.",
 ["The IQR narrows, the fences move in to 21.905000 and 48.685000, and a second entry is flagged beside 170.",
  "The fences stay where they were, because k sets the fences and the quartile rule only labels the result.",
  "Entry 170 drops inside the wider R6 fences, and the run returns no flag at all on the water sand."],
 "Section 20 prints R6, k 1.5 with IQR 6.920000 and fences 21.437500 and 49.117500, flagging entry 170, against the defaults' 6.695000, 21.905000 and 48.685000. The rule moves the quartiles and so the fences, and the spike at 90.590000 sits beyond either upper fence.")

q(1, "At R7 the caller raises k from 1.5 to 3. What changes on the water sand?",
 "Only the fences, which move to 11.862500 and 58.727500; the quartiles and IQR are unchanged.",
 ["The quartiles as well, because k is applied to the positions before the quartiles are computed.",
  "The IQR doubles, and the fences then sit 1.5 of the doubled IQR outside the quartiles.",
  "Nothing is flagged any more, since the spike at entry 170 lies inside the far out fences."],
 "Section 20 prints R7, k 3 with Q1 31.947500, Q3 38.642500 and IQR 6.695000, the same as at k 1.5, and fences 11.862500 and 58.727500. Entry 170 is still flagged, since 90.590000 lies beyond 58.727500.")

q(2, "Run at the defaults on the whole EKENE-7 gamma ray log, shale and sand together, the fences are -57.070000 and 186.810000 and flag nothing. Why is the spike at entry 170 missed?",
 "The spread includes the shale, so 90.590000 falls inside the fences.",
 ["R7 falls back to R6 on a long log.",
  "Long series get far out fences at k 3.",
  "A fence cannot flag a value inside a sand."],
 "Section 20: on the whole log the spike reads 90.590000, inside a spread that includes the shale. The rule is R7 on any length, k stays 1.5 unless the caller states another, and the fences know nothing of lithology.")

q(0, "The golden case iqr-exactly-on-both-fences runs -4, 2, 2, 3, 4, 5, 6, 6, 12 at R7 and k 1.5. How many entries are flagged?",
 "0, since -4 and 12 sit exactly on the fences.",
 ["2, the lowest and highest values, which reach the fences.",
  "1, the 12 alone, since the upper fence is the only one reached.",
  "No count: the engine refuses a series whose extremes are symmetric."],
 "Section 20: Q1 2, Q3 6, IQR 4, fences -4 and 12, and 0 flags. A value strictly outside a fence is flagged, so a value on the fence is inside. The engine returns a result, with no refusal.")

q(3, "A caller passes k = 0 to `iqrFences`. What does the engine do?",
 "It refuses, naming the field `k`: \"k must be a finite number above zero\".",
 ["It returns fences on the quartiles.",
  "It uses the default 1.5 in its place.",
  "It returns the quartiles and IQR with no fences and no flags, since a zero k builds no fence."],
 "Section 4 tables the refusal for a multiplier of zero with the field `k` and the message \"k must be a finite number above zero\". The engine never swaps in a default for a bad input and never returns a half result.")

q(2, "On the NIST silicon wafer resistivities, what 0.9 quantile does the engine return by R7?",
 "95.195680",
 ["95.198070",
  "95.197243",
  "95.1981"],
 "Section 19 prints 95.198070 by R6, 95.195680 by R7 and 95.197243 by R8, each equal to its golden. 95.1981 is the figure NIST prints for R6.")

q(1, "How should a report name the water sand's first quartile under this course's vocabulary?",
 "As the first quartile by R7, its probability and its rule.",
 ["By an exceedance label of the kind reserves reports use, so readers know which tail is meant.",
  "As a fixed sorted value of the sand, the same under any rule.",
  "As a percentile with no rule, since the three rules round to the same figure."],
 "Section 32: a quantile is named by a stated probability and a stated rule, R6, R7 or R8, and no P label is used anywhere. The three rules give 31.817500, 31.947500 and 31.825833 on the sand, so the rule has to be named.")

q(3, "The R7 lower fence on the water sand is 21.905000. How is it formed?",
 "Q1 minus 1.5 times the IQR: 31.947500 less 1.5 x 6.695000.",
 ["The median minus 1.5 IQR.",
  "Q1 minus 1.5 sample SDs.",
  "Q3 minus 1.5 IQR."],
 "Section 20: the fences are Q1 - k IQR and Q3 + k IQR. With the R7 quartiles, Q1 31.947500 and IQR 6.695000 at k 1.5 give the lower fence 21.905000. A fence is built from the quartiles, never from a median or a standard deviation.")

q(0, "What does the engine do when a quantile position h falls below the first sorted value or beyond the last?",
 "It clamps the quantile to the minimum or the maximum.",
 ["It extrapolates past the end.",
  "It refuses, naming the probability p as the field at fault.",
  "It switches to R6."],
 "Section 19: with h = k + d the quantile is Y[k] + d (Y[k+1] - Y[k]) on the ordered values, clamped to the minimum and maximum. No refusal and no change of rule is involved.")

emit(Q, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'd1i_m03.json'), expect_n=15)
finish()
