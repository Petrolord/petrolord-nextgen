# The Ekene triangle

The previous two lessons built the machinery. This one is about the three inputs, because the machinery is exact and the inputs are not, and a reserves range is only as defensible as the sentences behind $a$, $m$ and $b$.

## Where the mode comes from

The mode is 461709.132532792 stb, and it is not an opinion. It is the sum of the four producers' closed-form EURs at the 10 stb/d economic limit:

$$91666.6666666667 + 111270.166537926 + 153505.672866270 + 105266.626461929 = 461709.132532792$$

Ekene-1 exponential, Ekene-3 hyperbolic at $b = 0.5$, Ekene-5 harmonic, Ekene-6 hyperbolic at $b = 0.35$, each fitted to its primary window, each booked with the analytic rate-cumulative relation for its family. Nothing in that total is a scenario. It is what the four planted declines deliver if nothing surprises anyone.

One detail belongs in the audit trail. The engine's group roll-up of the same four base scenarios reports 461475.535264973 stb, which is 233.597267818579 stb lower, or -0.0505940323374476 percent. That gap is the daily-sum discretization the Professional tier dissected, not a disagreement about the reservoir. The triangle uses the closed form because a mode that depends on a forecast time step is a mode that moves when someone changes a setting.

## Where the minimum comes from

The minimum is 380000 stb, which is 17.6971012214034 percent below the mode. A minimum on a triangular distribution is a strong claim: it asserts probability zero below that value. Justify it by naming what would have to go wrong and showing that the arithmetic still lands above it.

Push the economic limit from 10 to 20 stb/d, roughly a doubling of unit operating cost or a collapse in netback, and the four closed-form EURs total 372230.076701345 stb. That is already below 380000 stb, which tells you the minimum is not a doomsday case: it corresponds to something milder, such as the limit drifting up modestly while the post-flood tails come in shorter than the response model suggests. The bracket is defensible precisely because a genuinely severe limit case falls outside it, and you should say so rather than let a committee assume the low case covers everything.

## Where the maximum comes from

The maximum is 580000 stb, which is 25.6202139252263 percent above the mode. Two levers get you there and they are not equal.

Dropping the limit from 10 to 5 stb/d raises the closed-form total to 535469.764892198 stb on its own. The rest is the decline exponent. The Expert tier's leverage table, at fixed $q_i = 120$ stb/d and $D_i = 0.0012$ per day with a 10 stb/d limit, runs EUR from 91666.6666666667 stb at $b = 0$ to 321875.914758613 stb at $b = 1.2$, a factor of 3.51137361554850. A field maximum only 25.6 percent above the mode is therefore a **governed** maximum: it assumes SPEE Recommended Evaluation Practice #6 discipline holds and nobody books a transient $b$. Write that assumption into the high-case sentence, because the number is meaningless without it.

## The quantiles, and what they say

With $a = 380000$, $m = 461709.132532792$ and $b = 580000$, the closed forms of lesson 3 give

| Quantity | Value (stb) | Reading |
|---|---|---|
| P90 (low) | 420425.025054486 | 90 percent chance of at least this |
| Mode | 461709.132532792 | the deterministic booking |
| P50 (median) | 471238.394887162 | half above, half below |
| Mean | 473903.044177597 | the expected-value input |
| P10 (high) | 531360.331525141 | 10 percent chance of at least this |

and $F$ at the mode is 0.408545662663958.

That last number is the sentence worth carrying out of this module. The deterministic booking sits at the 40.85th percentile of the range built around it, so 59.1454337336040 percent of the distribution lies above it. The triangle is right skewed because the governed upside is wider than the observable downside, and a deterministic total is therefore a mildly conservative number on this field rather than a central one. Whether that is appropriate is a governance question. Whether it is true is arithmetic, and it is true.

{{panel:dca-uncertainty-explorer}}

## Stop and check it yourself

Load the panel with the defaults and confirm all five tiles against the table above. Then test the sensitivity of each quantile to each input, one at a time, and watch which one moves.

Raise the minimum from 380000 to 400000 stb, leaving the other two alone. The P90 rises by 12903.1069902332 stb, the P50 by 5581.28687312320 stb and the P10 by only 2496.02737004613 stb. Reset, then raise the maximum from 580000 to 620000 stb. Now the P10 moves by 27003.7956473161 stb, the P50 by 10939.6036179203 stb and the P90 by only 3858.37116562098 stb. Reset again and raise the mode by 10000 stb: the P90 moves 2402.33361559565 stb, the P50 moves 4698.70708130661 stb, the P10 moves 2101.32568803220 stb.

Each headline number is dominated by the bound on its own side, and the mode, which is the only input backed by an engine calculation, moves the answers least. That is uncomfortable and it is the honest picture: your reserves range is mostly a record of two elicited opinions.

## The misconception to retire: the mode is the P50 because it is the base case

The deterministic total is the base case in the sense that it is what the engine returns with no scenario applied. It is not the median of any distribution, unless you have deliberately built a symmetric one. Here it sits 9529.26235437050 stb below the P50 and 12193.9116448053 stb below the mean. An evaluator who reports the deterministic total, then separately reports P90 and P10 from a skewed triangle, and lets the reader assume the middle number is the median, has published three consistent numbers and one misleading implication.

A second habit worth naming: treating the minimum and maximum as physical limits. They are not. They are statements about the evaluator's own bracket, and a triangular distribution converts them into hard probability-zero boundaries. If you cannot defend "there is no chance of less than 380000 stb", then you should widen the bracket or move to a distribution with tails.

## Exercise

The asset team accepts the mode and the minimum but argues that the maximum understates the upside, because it was set under a $b$ governance assumption they now want relaxed. They propose 620000 stb.

Recompute $F$ at the mode, the P90, the P50, the P10 and the mean under $a = 380000$, $m = 461709.132532792$, $b = 620000$. Use the panel to check each one. Then write two sentences: the first stating how much of the change in the P50 came from the shift in the branch threshold rather than from the new maximum directly, and the second stating what evidence you would require from that team, in terms of the fitted $b$ values on the four producers, before you would sign the wider bracket.
