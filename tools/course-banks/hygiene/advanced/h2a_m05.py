import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Expert m05, The Shift That Is Not Eight Hours.
# Figures from digest Section 20 (the extended-shift action level, Table IV-3,
# the OLOMORO shift), Section 21 (Brief and Scala daily and weekly, which
# governs, the cap, the ESTA example), Section 22 (the teaching crew's adjusted
# limits), Section 3 and Section 4. The weekly factor is never keyed as a
# figure to compute.

q(0, "What does `oshaActionLevelForShiftDbA` return for a 10.000000 hour shift?",
 "83.390216 dBA, from 16.61 log10(50 / (12.5 x 10)) + 90, with the PEL left where it was",
 ["85.000000 dBA, the eight-hour action level carried unchanged to a longer shift",
  "84.999892 dBA, the closed form at 8 hours, whatever the shift is",
  "83.390216 dBA for the PEL, with the action level held at 85 dBA"],
 "The OSHA Technical Manual closed form at h of 10 gives 83.390216 dBA, which Table IV-3 prints as 83.400000. Only the action level moves on a longer shift; the PEL is not reduced. Carrying 85 forward ignores that the same 50 percent noise dose is spread over more hours. 84.999892 dBA is the value at 8 hours, and it is the action level, never the PEL, that the formula lowers.")

q(2, "At 8.000000 hours the closed form gives 84.999892 dBA, and Table IV-3 prints 85. Why is the engine's value short of 85?",
 "50 / (12.5 x 8) is 0.5, so the result is 90 less 16.61 log10 2, and the printed 16.61 rounds the exact 16.609640474437",
 ["The engine uses the exact coefficient 16.609640474437, and exact arithmetic always stops a little short of a round result",
  "The closed form subtracts a small allowance for the shift, so it never quite returns the eight-hour action level itself",
  "The engine truncates every action level to six decimals, which trims the last digits off a result that is really 85"],
 "With the exact coefficient, 5 over log10 2 times log10 2 is exactly 5 and the result is exactly 85. The regulation writes 16.61, which sits 0.000359525563 dB above the exact value, and the engine uses the coefficient the regulation writes, so it lands at 84.999891772021. The formula carries no allowance, and 84.999892 is that value rounded at six decimals with nothing cut.")

q(1, "A 4.000000 hour shift is put through the extended-shift closed form. Which level comes back, and what does it mean?",
 "90.000000 dBA, the level that held for 4 hours gives a 50 percent noise dose",
 ["85.000000 dBA, since the action level is never raised for a short shift",
  "95.000000 dBA, the level whose reference duration is 4 hours, so 4 hours there give 100 percent",
  "A refusal on `shiftHours`, since the form needs 8 hours or more"],
 "50 over 12.5 times 4 is 1, and log10 of 1 is 0, so the action level is 90.000000 dBA: four hours at 90 dBA is half the 8 hour reference duration, a 50 percent noise dose. 95 dBA over 4 hours reaches 100 percent, which is the PEL's line. The engine returns the level at any shift above zero and up to 24 hours, and nothing in it caps the level at 85.")

q(3, "On a 12.000000 hour shift the OSHA action level falls to 82.075016 dBA. What happens to the OSHA PEL?",
 "Nothing: the PEL keeps its 90 dBA criterion and 100 percent limit, and the noise dose sums the whole shift",
 ["It falls by the same amount as the action level, since the two share one criterion level and one decibel exchange rate",
  "It is multiplied by the Brief and Scala daily factor of 0.500000, since a longer shift lowers every limit it carries",
  "It falls to 85 dBA, one step of the decibel exchange rate down"],
 "The PEL is not reduced. Table IV-3 moves the action level only, because the action level is a 50 percent noise dose held over the shift. The PEL still reads the noise dose over every period against 100 percent, so a longer shift already raises its noise dose. Brief and Scala adjust chemical limits and are never applied to noise, and no rule moves the PEL to 85 dBA.")

q(1, "The OLOMORO shift is 86.100000 dBA for 3.100000 h, 83.400000 for 3.600000 h, 90.800000 for 1.200000 h and 78.900000 for 2.100000 h. What action-level noise dose does the engine report?",
 "57.350093 percent, the three integrated contributions summed over the whole 10.000000 hours",
 ["45.880074 percent, the shift's noise dose rescaled by 8 over 10 to an eight-hour equivalent",
  "16.759307 percent, the contribution of the one period at or above the 90 dBA criterion level",
  "The noise dose over all four periods, the 78.900000 dBA one included on a shift this long"],
 "The contributions are 22.566713, 18.024072 and 16.759307 percent, and the 78.900000 dBA period is below the 80 dBA threshold. Their sum is 57.350093 percent. Rescaling gives 45.880074, a number Appendix A does not define. 16.759307 percent is what the PEL setup integrates. The noise dose sums every period of the shift, so no hours are cut off, and the 78.900000 dBA period stays out on any shift length.")

q(0, "Why does the course reject rescaling the OLOMORO noise dose by 8 over 10?",
 "Appendix A defines the noise dose as a sum over every period of the shift, and nothing in it refers to 8 hours",
 ["The rescaled figure of 45.880074 percent falls below the 50 percent line, which would hide a noise dose over it",
  "The rescaling should divide by 8 rather than multiply, so the rescaled figure would come out above 57.350093",
  "Appendix A allows the rescaling only for shifts of 12 hours or more, and the OLOMORO shift is 10 hours long"],
 "The rescaled 45.880074 percent answers what the noise dose would have been had the worker left at eight hours at the same average, and the worker did not leave. It is not a quantity Appendix A defines. Where it falls against 50 percent is a consequence and never the reason; a definition does not depend on the verdict it gives. No direction of scaling is right, and Appendix A has no shift threshold.")

q(2, "Why is the 78.900000 dBA period of the OLOMORO shift left out of its action-level noise dose?",
 "It lies below the 80 dBA threshold of the action-level setup, which is inclusive at 80",
 ["It lies below the 10 hour action level of 83.390216 dBA, which replaces the threshold on a long shift",
  "It lies below the 85 dBA action level, and only periods at or above the action level are integrated",
  "It lies below the 90 dBA threshold, which the action-level setup shares with the PEL setup"],
 "The action-level setup integrates every period at or above 80 dBA, judgement J2, whatever the shift length. The extended-shift action level is a line for the whole shift, never a threshold for a period, and 85 dBA is the eight-hour action level, which is no threshold either. The 90 dBA threshold belongs to the PEL setup alone.")

q(3, "On the OLOMORO record the 90.800000 dBA period contributes 16.759307 percent under the action level and the same 16.759307 percent under the PEL. Why the same figure?",
 "Its hours at 90.800000 dBA are divided by one reference duration, since both setups build it from 90 dBA and 5 dB",
 ["The PEL and the action level are both scaled to the 10 hour shift, which gives every period the same share of both",
  "The period sits on the 90 dBA PEL threshold, and on a threshold the engine credits the contribution to both setups",
  "The PEL setup copies the action-level contribution for every period above 85 dBA and discards the rest of them"],
 "A period's contribution is its hours over the reference duration at its level, and the reference duration depends on the criterion level and the decibel exchange rate, which both setups share. The setups differ only in threshold, 90 against 80 dBA, and in limit, 100 against 50 percent. 90.800000 dBA is above the 90 dBA threshold. Neither setup rescales to the shift, and nothing is copied between them.")

q(0, "The teaching crew works 10 hour shifts and 50 hours a week. Toluene's limit is 200.000000 ppm. What limit does `briefScalaAdjustedLimit` return?",
 "140.000000 ppm, the daily factor of 0.700000 governing as the smaller",
 ["The limit scaled by 8 over 10 alone, for the extra hours spent breathing the air",
  "The limit times the weekly factor of 0.737500, since a 50 hour week is past the 40 hours of a standard week",
  "200.000000 ppm, since Brief and Scala leave a limit alone until a shift reaches 12 hours"],
 "The daily factor is (8/10) x (24 - 10)/16, 0.700000, and the weekly factor at 50 hours is 0.737500; the smaller governs, so the limit is 200.000000 times 0.700000, 140.000000 ppm. Scaling by 8 over 10 alone drops the recovery term, the reduction for fewer hours away from the air. The weekly factor is the larger here and does not govern. The factor falls below 1 for any shift over 8 hours.")

q(1, "What does the (24 - h)/16 part of the Brief and Scala daily factor account for?",
 "The recovery time away from the air, against the 16 hours an 8 hour day leaves",
 ["The hours of breathing the air, scaled against an eight-hour day of intake at the limit",
  "The hours of the working week that fall outside a 40 hour standard week",
  "The fraction of the day spent at rest inside the workplace between tasks"],
 "RF = (8/h) x (24 - h)/16: the first part scales intake by the longer time breathing the air, the second scales recovery, since an eight-hour day leaves 16 hours to clear what was taken in and a longer shift leaves fewer. The 40 hour week belongs to the weekly factor, and rest breaks inside the shift are still time at work.")

q(2, "The BC Occupational Health and Safety Regulation prints daily factors of 0.700000, 0.500000, 0.250000 and 0.100000 at 10, 12, 16 and 20 hours, and the engine reproduces all four. What does that prove?",
 "That the constants 8, 24 and 16 are tested by something outside the two files that hold them",
 ["That the weekly factor is reproduced too, since it shares its form and its two-part logic with the daily factor",
  "That the adjustment suits every substance, since the regulation prints the factors for general use",
  "That the arithmetic is right, while the constants stay oracle only like the weekly ones"],
 "A printed value set against the engine's arithmetic tests the constants as well, so a shared misreading of 8, 24 or 16 would have turned those rows red. That makes the daily door PUBLISHED, REPRODUCED. The weekly factor has constants of its own, 40, 168 and 128, and no printed value, so it stays ORACLE ONLY. Reproducing a factor says nothing about whether a substance fits the model.")

q(0, "A shift of 24.000000 hours is passed to `briefScalaDailyRf`. What comes back?",
 "A factor of 0.000000 without a refusal, so any limit it adjusts goes to zero",
 ["A refusal on `shiftHours`, since the door stops short of 24 hours",
  "A factor of one third, since the recovery term has a floor",
  "A factor of 1.000000, held there by the cap"],
 "At 24 hours, 24 - h is zero and the formula leaves no recovery, so no concentration is acceptable: judgement J8 reports it. The refusal covers shifts of zero hours and over 24, and 24 itself is accepted. There is no floor on the recovery term, and the cap at 1 applies to short shifts, where the raw factor would rise above 1.")

q(3, "On a 6.000000 hour shift the raw daily factor is 1.500000. What does `briefScalaAdjustedLimit` do with a limit of 100?",
 "It keeps 100.000000, since the factor is capped at 1 with the raw 1.500000 kept beside it",
 ["It raises the limit to 150.000000, since a shorter shift leaves more recovery time",
  "It refuses on `shiftHours`, since Brief and Scala apply only to shifts over 8 hours",
  "It keeps 100.000000 and drops the raw factor, since a value above 1 is meaningless"],
 "Judgement J8 caps the factor at 1 so the adjusted limit is never above the limit it started from, and keeps `rawRf` so the reader can see what the formula gave. A reduction factor reduces: the model argues a longer shift needs a lower limit and gives no grounds to relax one, since a short shift may still carry peaks. The door accepts any shift from above zero to 24 hours, and the raw value is reported.")

q(1, "The ESTA 12-hour example adjusts a limit of 10.000000 for 12.000000 hour shifts and 60.000000 hours a week. What adjusted limit results?",
 "5.000000, since the daily 0.500000 is the smaller factor and is the one applied",
 ["The limit times the weekly factor of 0.562500, since a 60 hour week is governed by the week",
  "10.000000, unchanged, since each of the two factors is capped at 1 on that schedule",
  "The limit times the product of both factors, since a schedule carries both a long day and a long week"],
 "The daily factor at 12 hours is 0.500000 and the weekly factor at 60 hours is 0.562500; the smaller governs, so 10.000000 becomes 5.000000. Because the daily factor governs by a clear margin, the ORACLE ONLY weekly formula never enters the adjusted limit. Neither factor is capped here, since both are below 1, and the engine applies one factor and never their product.")

q(2, "A hygienist proposes applying the Brief and Scala daily factor to the 85 dBA action level for a 10 hour noise shift. What does the course say?",
 "Brief and Scala adjust chemical limits; noise has its own rule, the OSHA extended-shift action level",
 ["That is correct, and it gives the same 83.390216 dBA as Table IV-3 for a 10 hour shift",
  "That is correct for the PEL only, since the action level already has its own extended-shift form",
  "The factor applies to noise through the noise dose, so the 50 percent line is multiplied by the factor of 0.700000"],
 "The Brief and Scala factor adjusts an eight-hour chemical exposure limit, and the course says it is never applied to a noise dose. Noise on a longer shift is handled by `oshaActionLevelForShiftDbA`, which gives 83.390216 dBA at 10 hours from its own closed form. The PEL is not reduced for any shift, and no rule scales the 50 percent line.")

emit(Q, '/root/hse-wip-hygiene/banks/h2a_m05.json', expect_n=15)
finish()
