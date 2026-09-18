import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate m04, Steam. Written from digest.txt Sections 8 and 9, which are
# the four lessons of this module: the steam equation and its constant, the
# Napier correction and the pressure it starts at, the superheat factor the
# engine types, and the two ends of the published range.

q(3, "What does the steam route need handed to it that the gas route also needs, and what can it do without?",
 "It needs a flow, a relieving pressure and the coefficients, and it needs no molecular weight, compressibility, temperature or isentropic exponent.",
 ["It needs a flow, a relieving pressure and the coefficients, and it needs no outlet pressure, isentropic exponent or certified discharge coefficient.",
  "It needs a flow, a relieving pressure, a temperature and the coefficients, and it needs no molecular weight, compressibility or isentropic exponent.",
  "It needs a flow, a relieving pressure and a superheat factor, and it needs no certified coefficient, molecular weight or compressibility at all."],
 "Saturated steam at a stated pressure is a defined state, so the published equation folds the gas properties into one leading constant. The certified coefficient is stated on this route as on every other."),

q(1, "TEBIDABA states 94000.0000 lb/hr at a set pressure of 1740.000000 psig with a 10.000000 percent allowance. What does the engine return?",
 "A relieving pressure of 1928.700000 psia, a correction of 1.021727 and a required area of 0.949984 in2.",
 ["A relieving pressure of 1928.700000 psia, a correction of 0.998342 and a required area of 1.144559 in2.",
  "A relieving pressure of 1928.700000 psig, a correction of 1.021727 and a required area of 1.287000 in2.",
  "A relieving pressure raised from the set pressure by the allowance alone, with the same correction and the same area."],
 "The allowance is applied to the gauge set pressure and the atmospheric constant is added afterwards, which is what puts the relieving pressure in psia. The 1.287000 in2 is the J orifice this case selects rather than the area it needed, and 1.144559 in2 is the same case run superheated."),

q(0, "The Napier correction is 1.0 up to a threshold and then does what?",
 "It steps below one, stays below one to a crossing the engine derives and exports, and rises past one above that.",
 ["It steps above one, stays above one to a crossing the engine derives and exports, and falls back through one above that.",
  "It slides smoothly below one from the threshold and returns through one at the top of the published range.",
  "It steps below one at the threshold and holds that value until the route refuses at the top of the published range."],
 "Between the threshold and the crossing the correction sits below one, which makes the required area larger than the uncorrected equation would give. Above the crossing it rises for the rest of the published range."),

q(2, "A millionth of a psi below the threshold the correction is 1.000000000000 and a millionth above it is 0.995677635301. What does that pair establish?",
 "That the correction steps rather than sliding, by -0.004322364699 across two millionths of a psi.",
 ["That the correction slides, since a change that small across a change that small is a smooth gradient.",
  "That the threshold was bisected wrongly, since a continuous fit cannot move by that much over that interval.",
  "That the required area steps by the same -0.004322364699, since the correction multiplies it directly."],
 "A step matters more than its size suggests, because two cases a psi apart in relieving pressure get different valves with nothing in the inputs looking like a discontinuity. The area moves by the reciprocal of the step rather than by the step."),

q(3, "Which relieving pressures on the TEBIDABA sweep carry a warning?",
 "1520.000000, 1550.000000 and 1580.000000 psia, which are the rows between the threshold and the crossing.",
 ["1600.000000, 1800.000000 and 2000.000000 psia, which are the rows where the correction has risen past one.",
  "3000.000000 and 3200.000000 psia, which are the rows approaching the top of the published range.",
  "1000.000000, 1400.000000 and 1500.000000 psia, which are the rows where the correction is exactly one."],
 "The engine flags the interval where the correction is below one and the required area is therefore larger. Below the threshold the correction is exactly one and nothing is flagged, and above the crossing the correction behaves the way a correction is normally expected to."),

q(0, "The crossing back through unity is reported twice, at 1580.310880829016 psia. Why is that worth printing twice?",
 "Because one figure was bisected out of the returned correction and the other is the engine own exported constant, so the two are a real agreement.",
 ["Because one figure belongs to the published fit and the other to the engine implementation of it, so the two are a tolerance.",
  "Because one figure is the crossing and the other is the top of the range, and on this route the two happen to coincide.",
  "Because one figure is measured at the TEBIDABA load and the other at unit coefficients, so the pair shows the load does not move it."],
 "A derived constant and a bisection of the behaviour it is supposed to describe are two different routes to the same pressure. The top of the published range is a separate figure at 3200.000000000003 psia."),

q(1, "What happens above 3200.000000000003 psia on the steam route?",
 "The route refuses, because the correction is published only that far.",
 ["The route refuses, because the required area has fallen below the smallest listed orifice.",
  "The route returns an area with a warning, because the fit is being extrapolated past its range.",
  "The route holds the correction at its value on the boundary and returns an area anyway."],
 "That refusal is a stated limit rather than a numerical failure. Nothing breaks at that pressure, and the engine declines to extrapolate a published fit past where it was published."),

q(2, "Below the threshold, at 1000.000000, 1400.000000 and 1500.000000 psia, the required area falls from 1.872044 in2 to 1.248029 in2 at one load. Why?",
 "A higher pressure pushes more mass through the same hole, so less hole is needed for the same flow.",
 ["The correction rises with pressure across those three rows, and a larger correction divides the area down.",
  "The three rows sit at different loads, since a relieving pressure is only reached by changing the flow.",
  "The leading constant of 51.500000000000 is scaled by the pressure, which shrinks the area as the pressure climbs."],
 "The correction is exactly 1.000000 on all three rows, so nothing in that column confounds the reading. The leading constant is a constant and the load is the same 94000.0000 lb/hr on every row."),

q(1, "Which of the two corrections on the steam route does the engine compute, and which does it take on trust?",
 "It computes the Napier correction from the pressure and takes the superheat factor KSH as a typed table entry.",
 ["It computes the superheat factor KSH from the pressure and takes the Napier correction as a typed chart value.",
  "It computes both of them, the first from the pressure and the second from the pressure and the temperature.",
  "It takes both of them as typed inputs, which is why the route carries two published references rather than one."],
 "The Napier fit is checked against the standard own SI statement of it. Nothing in this package can derive a single entry of the superheat table, and the oracle cannot check it either."),

q(3, "Run as a superheated service with a factor of 0.830000 typed in, the TEBIDABA area becomes 1.144559 in2 against the 0.949984 in2 the saturated case needed. What does that direction say?",
 "A factor below one makes the required area larger, because superheated steam is less dense and the same hole passes less mass.",
 ["A factor below one makes the required area smaller, because a factor is a credit against the uncorrected equation.",
  "A factor below one leaves the required area alone, because the superheat table is typed rather than computed.",
  "A factor below one makes the required area larger, because the Napier correction is recomputed at the superheated state."],
 "The factor arrives as a number with no explanation attached, and a typed number is easy to enter the wrong way round, so the direction is worth holding onto. The Napier correction depends on the pressure alone."),

q(2, "Two of the five published steam rows share a flow of 60000.0000 lb/hr and a relieving pressure of 314.700000 psia. What makes that a well built pair?",
 "Only the typed superheat factor differs, and both rows sit below the threshold where the other correction is exactly 1.000000.",
 ["Only the flow differs, and both rows sit below the threshold where the other correction is exactly 1.000000.",
  "Only the typed superheat factor differs, and both rows sit inside the band where the other correction is below one.",
  "Only the certified coefficient differs, and both rows sit above the crossing where the other correction is above one."],
 "The published areas are 3.796612 in2 and 4.574231 in2, and a pair that moved two things at once could confirm an answer without testing either of them. What the pair cannot say anything about is the table the factor was copied from."),

q(0, "Three of the five published steam rows have the Napier correction active. At which pressures?",
 "2014.700000, 3100.000000 and 1550.000000 psia.",
 ["2014.700000, 3100.000000 and 314.700000 psia.",
  "1928.700000, 3200.000000 and 1550.000000 psia.",
  "2014.700000, 1580.310880829016 and 1550.000000 psia."],
 "The two rows at 314.700000 psia sit below the threshold with the correction at exactly 1.000000. The 1928.700000 psia is the TEBIDABA relieving pressure rather than a published row."),

q(1, "Why is the published row at 1550.000000 psia more valuable than the others?",
 "It sits inside the band where the correction falls below one, which is the behaviour most people find surprising.",
 ["It sits at the threshold itself, which is the one pressure at which the size of the step can be measured across a row.",
  "It is the only row whose published correction and returned correction agree to every printed digit.",
  "It is the only row that carries a superheat factor away from 1.000000 as well as an active correction."],
 "Its correction is 0.998366 published against 0.998342 returned, which is the fit evaluated twice rather than a disagreement. A published set with no row in that band would leave the most contestable part of the route untested."),

q(2, "The steam leading constant of 51.500000000000 was recovered how, and what checks it?",
 "From one steam area below the Napier threshold at unit coefficients, and the oracle checks it against the published SI form.",
 ["From one steam area above the Napier crossing at unit coefficients, and the oracle checks it against the published SI form.",
  "From the ratio of two steam areas at the same load and different pressures, and the oracle pins it as behaviour.",
  "From the exported crossing of 1580.310880829016 psia divided by the threshold, and the oracle derives it from the fit."],
 "Taking the area below the threshold is what makes the correction exactly one, so nothing but the leading constant is left in the arrangement. The oracle also checks the fit against the standard own SI statement of Napier, so two published routes meet on this equation."),

q(0, "What do the published steam rows leave untested?",
 "The refusal past the top of the range and the step at the threshold itself.",
 ["The band where the correction sits below one and the refusal past the top of the range.",
  "The superheated case and the step at the threshold, neither of which any row reaches.",
  "The agreement between the published and the returned correction."],
 "The set straddles the threshold, puts a row inside the awkward band, reaches close to the top of the range and includes one superheated case. The two behaviours it never visits are covered by bisecting the engine instead."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_m04.json', label='fc5b_m04', expect_n=15)
finish()
