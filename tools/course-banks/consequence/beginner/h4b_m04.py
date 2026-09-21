import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, ASSOCIATE m04 "Pools and Evaporation".
# Digest sections 8 (a spill becomes a pool: confined, unconfined at a stated
# thickness, overtopping, the Yellow Book pool diameter) and 9 (Mackay and
# Matsugu evaporation, its two refusals and its single route status).

q(2,
  "A spill of 30 m3 lands in a bund of 400 m2 with a 0.5 m wall. What pool does the engine return?",
  "CONFINED, 400.000000 m2, 0.075000 m deep, equivalent diameter 22.567583 m.",
  ["UNCONFINED_STATED_THICKNESS, 3000.000000 m2 at a thickness of 0.01 m, equivalent diameter 61.803872 m, because the spill spreads past the wall.",
   "CONFINED, 400.000000 m2, 0.5 m deep, the height of the wall.",
   "CONFINED, 600.000000 m2 at 0.05 m, diameter 27.639532 m."],
  "Section 8: the pool covers the bund floor, 400 m2, at a depth of 0.075000 m (30 m3 over 400 m2) and an equivalent diameter of 22.567583 m from D = sqrt(4 A / pi). The spill stands well below the 0.5 m wall, so it is confined and nothing spreads. The wall height only decides overtopping and is never the depth. 600.000000 m2 and 27.639532 m are the unconfined row at 0.05 m.")

q(0,
  "Shrink the bund floor to 50 m2 and keep its wall. What does the engine do with the same spill?",
  "It refuses: the spill would stand 0.600000 m deep, above the wall, and the message is \"spillVolumeM3: the spill overtops the bund (depth above the wall height), so the pool is not confined by it\"",
  ["It returns a CONFINED pool 0.600000 m deep over 50 m2, with a warning that the depth is above the wall.",
   "It returns a CONFINED pool 0.5 m deep over 50 m2 and treats the rest of the spill as lost over the wall.",
   "It spreads the overflow outside the bund and returns a larger UNCONFINED pool around it."],
  "Section 8: in a 50 m2 bund the spill would stand, derived, 0.600000 m deep behind a 0.5 m wall, and the engine refuses on `spillVolumeM3` in the quoted words. A refusal carries no number, so there is no warned result and no truncated pool. The engine has no spreading model, so it cannot spread the overflow either.")

q(1,
  "No bund applies and the analyst states a thickness of 0.01 m for the 30 m3 spill. What does the engine return?",
  "UNCONFINED_STATED_THICKNESS, 3000.000000 m2, equivalent diameter 61.803872 m.",
  ["UNCONFINED_STATED_THICKNESS, 1500.000000 m2, equivalent diameter 43.701937 m, the row the table prints at 0.02 m.",
   "UNCONFINED_STATED_THICKNESS, 6000.000000 m2, equivalent diameter 87.403874 m, since half a centimetre is the default film.",
   "CONFINED, 400.000000 m2, since the thickness is read as a bund depth."],
  "The thickness table prints 3000.000000 m2 and 61.803872 m at 0.01 m, from A = V / delta and D = sqrt(4 V / (pi delta)). 1500.000000 m2 and 43.701937 m are the 0.02 m row. 6000.000000 m2 and 87.403874 m are the 0.005 m row, and the engine has no default thickness at all. A stated thickness gives an unconfined pool.")

q(3,
  "The stated thickness of the 30 m3 pool is halved from 0.01 m to 0.005 m. What happens to the equivalent diameter?",
  "It rises by 1.414214, from 61.803872 to 87.403874 m.",
  ["It doubles, from 61.803872 m, because the area doubles when the thickness is halved and the diameter follows the area.",
   "It halves, from 61.803872 to 27.639532 m, since a thinner pool is a smaller pool on the ground.",
   "It is unchanged at 61.803872 m, because the diameter depends on the volume alone and the thickness only sets the depth."],
  "Section 8: the diameter goes as one over the square root of the thickness, so halving it raises the diameter by, derived, 1.414214, from 61.803872 to 87.403874 m. The AREA doubles, from 3000.000000 to 6000.000000 m2, but the diameter goes as the square root of the area. A thinner pool covers more ground, and 27.639532 m belongs to 0.05 m. The thickness enters D = sqrt(4 V / (pi delta)) directly.")

q(0,
  "The engine has no spreading model. Where does the thickness of an unconfined pool come from?",
  "The analyst states it, and the pool the engine returns is only as good as that stated thickness.",
  ["The engine spreads the spill until it reaches a minimum film thickness it holds for each kind of ground.",
   "It is read from the Yellow Book table for the substance.",
   "The engine derives it from the spill volume, by solving the Yellow Book spreading equation for a pool that is fed until it stops."],
  "Section 8 says no spreading model is implemented and the thickness is the analyst's, with the model string \"A = V / delta with the stated thickness; D = sqrt(4 V / (pi delta))\". The engine holds no minimum film thickness and reads no thickness table. It does not solve a spreading equation: that is exactly the model it does not implement.")

q(2,
  "The Yellow Book pool example (V 28.3 m3, delta 0.02 m) prints D = 42.445 m and A = 1415 m2. What does the engine give, and why the small difference?",
  "42.445659 m and 1415.000000 m2; the book prints its values truncated.",
  ["43.701937 m and 1500.000000 m2, since the engine works from a 30 m3 spill at that thickness.",
   "42.445 m and 1415 m2 exactly, rounded to the book's digits.",
   "42.445659 m, from a different value of pi, with a warning."],
  "Section 8: the engine gives a diameter of 42.445659 m and an area of 1415.000000 m2, and the book prints its values truncated. 43.701937 m and 1500.000000 m2 are the 30 m3 teaching spill at 0.02 m, a different volume. The engine returns its full value, and nothing about pi or a warning is involved.")

q(3,
  "The engine returns `containment` on every pool. Which value does it carry for a pool of stated thickness?",
  "UNCONFINED_STATED_THICKNESS",
  ["CONFINED, with the stated thickness recorded in the basis block beside the bund area it replaces.",
   "UNCONFINED_SPREAD, since the pool spreads until it reaches the thickness the analyst typed for it.",
   "OVERTOPPED, since a pool with no bund is one that has spilled past every wall there is."],
  "Section 8 tables `containment` as UNCONFINED_STATED_THICKNESS on every row of the thickness table and CONFINED for the bund. The label says the thickness was stated, because nothing spreads. An overtopping spill is refused, so there is no OVERTOPPED result, and CONFINED belongs to a bund floor.")

q(1,
  "The hexane-like pool (10 m, wind at 10 m of 3 m/s, vapour pressure 16000 Pa, 0.08618 kg/mol, 293.15 K) evaporates by Mackay and Matsugu. What rate does the engine return?",
  "0.451595 kg/s, from an evaporation flux of 0.005749887804 kg/(m2 s) over 78.539816 m2.",
  ["0.010163820387 kg/s, the mass transfer coefficient.",
   "0.005749887804 kg/s, the evaporation flux alone.",
   "0.672653 kg/s, the rate the wind sweep prints at 5 m/s, since Mackay and Matsugu uses the wind at 2 m."],
  "Section 9 prints the rate as 0.451595 kg/s, the evaporation flux 0.005749887804 kg/(m2 s) times the pool area 78.539816 m2. 0.010163820387 is the mass transfer coefficient in m/s. The model string ends \"x A\", so the area enters. 0.672653 kg/s is the 5 m/s row; the argument is the wind at 10 m, `windSpeed10mMS`.")

q(0,
  "The wind at 10 m over the hexane-like pool is doubled from 1 to 2 m/s. Why does the rate go from 0.191688 to only 0.329153 kg/s?",
  "The rate grows with the wind to the power 0.78, so doubling the wind less than doubles it.",
  ["The rate is linear in the wind, and the pool cools as the wind rises, which pulls the vapour pressure down.",
   "The rate is capped by the vapour pressure.",
   "The rate grows with the square root of the wind, as the evaporation flux of a pool does in the Yellow Book spreading model."],
  "The mass transfer coefficient is km = 0.004786 u10^0.78 (2r)^-0.11 Sc^-0.67, and section 9 says the rate grows with the wind to the power 0.78. The vapour pressure is a stated input the engine never adjusts, so there is no cooling and no cap. The power is 0.78, and the engine has no spreading model.")

q(3,
  "The hexane-like pool grows from 10 m to 40 m across. What happens to the evaporation flux and to the rate?",
  "The evaporation flux falls slowly, to 0.004936654932 kg/(m2 s), while the rate rises to 6.203584 kg/s with the area.",
  ["Both stay proportional to the area, so the evaporation flux is unchanged at 0.005749887804 kg/(m2 s) and the rate rises.",
   "The evaporation flux rises to 0.006863506842 kg/(m2 s) as the pool widens, and the rate rises faster than the area.",
   "The evaporation flux falls to 0.004936654932 kg/(m2 s) and the rate falls to 0.021562 kg/s."],
  "Section 9: the diameter enters to the power minus 0.11, so the evaporation flux FALLS slowly as the pool grows, to 0.004936654932 kg/(m2 s) at 40 m, while the rate still grows with the area, to 6.203584 kg/s. 0.006863506842 kg/(m2 s) is the 2 m pool, the largest evaporation flux in the table. 0.021562 kg/s is the rate of the 2 m pool.")

q(2,
  "What Schmidt number does the evaporation call use when none is typed, and what constant leads the mass transfer coefficient?",
  "0.8, the Yellow Book value for gases and vapours in general, and `MACKAY_MATSUGU_C` of 0.004786.",
  ["0.67, the exponent in the correlation, and a constant of 0.78, the exponent on the wind.",
   "0.8, and a constant of 0.010163820387, the mass transfer coefficient of the hexane-like pool.",
   "1, and no constant."],
  "Section 9: the Schmidt number defaults to 0.8, the Yellow Book's value for gases and vapours in general, and `MACKAY_MATSUGU_C` is 0.004786. The 0.67 and 0.78 are exponents in km = 0.004786 u10^0.78 (2r)^-0.11 Sc^-0.67. 0.010163820387 m/s is a result of the correlation for one pool.")

q(1,
  "An evaporation call is made with a wind at 10 m of zero. Why does the engine refuse it?",
  "The correlation gives zero evaporation in calm air, which is its form and not physics, so the engine refuses on `windSpeed10mMS`.",
  ["A still pool does not evaporate at all, so the engine refuses rather than return a rate of zero it would have to warn about.",
   "The wind enters as a divisor.",
   "The engine needs the stability class for calm air."],
  "The engine's own words are \"windSpeed10mMS: must be above 0 m/s: the correlation gives zero evaporation in calm air, which is its form and not physics\". A real pool does evaporate in still air, and the refusal says the zero is a property of the correlation. The wind enters km to the power 0.78, as a multiplier. No stability class is involved in the evaporation call.")

q(3,
  "A pool is typed with a vapour pressure above ambient. What does the engine say?",
  "\"vapourPressurePa: is at or above ambient: the pool is boiling, and this non-boiling evaporation model does not apply\"",
  ["It computes the evaporation rate with the vapour pressure capped at ambient, 101325 Pa, and warns that the pool may be close to its boiling point.",
   "It computes the evaporation rate as normal, since Mackay and Matsugu holds for any vapour pressure above zero and the pool itself is not modelled.",
   "\"windSpeed10mMS: must be above 0 m/s: the correlation gives zero evaporation in calm air, which is its form and not physics\""],
  "Section 9: two refusals draw the model's edge, and a vapour pressure at or above ambient is refused on `vapourPressurePa` in the quoted words, because Mackay and Matsugu is a model for a pool below its boiling point. A refusal carries no number, so nothing is capped or computed. The calm air message is the other refusal.")

q(0,
  "Why is the Mackay and Matsugu evaporation rate taught in this course and never graded?",
  "It is a single route quantity: no second derivation and no public worked number stands behind it, only the transcription from the Yellow Book.",
  ["It is graded in the Professional tier, since the evaporation rate feeds the pool fire.",
   "Its output is a rate in kg/s, which the course grades only for a hole.",
   "The oracle disagrees with the engine by more than the tolerance, so it cannot be used for a graded answer anywhere in this course."],
  "Section 9 says the correlation has no second derivation and no public worked number behind it in the engine's validation record: the only check is the transcription from the Yellow Book. It is taught and never a graded answer, in any tier. No oracle disagreement is recorded, and a rate in kg/s is graded for the outflow through a hole.")

q(2,
  "What does the engine's model string say it does with a spill in a bund?",
  "\"pool covers the bund floor; D = sqrt(4 A / pi)\"",
  ["It spreads the spill across the bund floor until it reaches the stated thickness, and returns the wetted part of the floor.",
   "It fills the bund to the height of its wall and reports the volume held back, with the excess refused.",
   "It covers the bund floor, D = sqrt(4 V / (pi delta))."],
  "That is the model string for a bund, verbatim, from section 8: the pool covers the whole floor and its equivalent diameter comes from the floor area. A bund takes no thickness, since the floor sets the area. The depth is volume over area and never the wall height. sqrt(4 V / (pi delta)) is the stated thickness form.")

emit(Q, '/root/hse-wip-consequence/banks/h4b_m04.json', expect_n=15)
finish()
