import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m01, A Rate Is a Count over Exposure.
# Sources: digest sections 1, 2, 3, 4 and 28. Every figure is printed there.

q(1, "UGHELLI states 9 recordable cases in 2318640 hours for one year. The report you are writing uses the 200,000 hour base. What recordable rate goes in it?",
 "0.776317 per 200,000 hours, from 9 x 200,000 / 2318640.",
 ["3.881586, which is the same 9 cases over the same hours on the IOGP base of 1,000,000 hours.",
  "0.345030 per 200,000 hours, which is what the 4 DART cases give over the same 2318640 hours worked.",
  "388.158576, the figure the engine returns when the base passed is 100,000,000 hours."],
 "The engine's formula is count x base / exposureHours, so 9 x 200,000 / 2318640 gives 0.776317. The tempting 3.881586 is the same record on the IOGP base: nothing is wrong with its arithmetic, it answers a different base than the report asked for, and it reads five times larger for that reason alone."),

q(3, "Two crews of 40 people each had one recordable apiece. The day crew worked 80000 hours and the rotation crew 116480. What does the engine report for the rotation crew per 200,000 hours?",
 "1.717033, because its one case is spread over 116480 hours, which is more exposure than the day crew's 80000.",
 ["2.500000, the same as the day crew, since both crews have 40 people and one recordable each and so share one rate.",
  "1.456000, the ratio of the rotation crew's hours to the day crew's.",
  "2.500000 per 100 people, the per head figure for both crews."],
 "1 x 200,000 / 116480 is 1.717033. The per head figure of 2.500000 recordables per 100 people is the same for both crews, which is exactly why it hides the difference: the rotation crew was exposed for more hours. 1.456000 is the ratio of the two rates, and the engine has no headcount input at all."),

q(0, "The day crew's rate is 1.456000 times the rotation crew's rate, although each crew had one recordable and 40 people. Where does that factor come from?",
 "It is the rotation crew's 116480 hours over the day crew's 80000 hours, because with the count held equal only the exposure can move the rate.",
 ["It is the day crew's headcount over the rotation crew's headcount, scaled to the 200,000 hour base.",
  "It records that the day crew's recordable was the more serious case of the two.",
  "It is the ratio of the per head figures, which the engine derives from the hours."],
 "With one case each, the rates stand in the inverse ratio of the hours: 116480 over 80000 is 1.456000, the same as 2.500000 over 1.717033. The headcounts are equal at 40 and the per head figures are equal at 2.500000, so neither can produce the factor, and the engine does not look at how serious a case was."),

q(2, "A contractor sends you headcounts and asks why the engine will not take them. What does the engine do with a headcount?",
 "Nothing: it has no headcount input at all, and takes the hours worked as the exposure.",
 ["It converts each head into a full-time year of 40 h x 50 weeks and uses the product as the exposure hours.",
  "It accepts headcount on the OSHA base only, since that base is defined as 100 full-time workers.",
  "It takes headcount when the hours are blank and flags the rate as an estimate."],
 "The engine takes hours and has no headcount input. A headcount is a snapshot of a list and says nothing about how long anyone worked, so the two crews of 40 would read the same per head and differ per hour. The OSHA label describes an imaginary 100 workers as a reading scale; it is no invitation to pass heads."),

q(1, "The rotation crew reads 1.717033 per 200,000 hours. Which reading of that figure is the one the engine's own base label supports?",
 "At this crew's observed rate, 100 full-time workers on 40 hours for 50 weeks would have about 1.717033 recordables in a year.",
 ["The crew of 40 had about 1.717033 recordables for every 100 of its own people over the year it worked.",
  "The crew had 1.717033 recordables in its year, spread across the 116480 hours it actually worked.",
  "At this crew's rate, 200,000 people would have 1.717033 recordables between them in a year."],
 "The label reads per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks), and 100 times 40 times 50 is 200000. It describes an imaginary workforce. The per head reading is the trap: per 100 of its own people the crew reads 2.500000, which is a different figure, because the base has no headcount in it."),

q(2, "Your script calls the rate function with a count and hours and forgets the base. What comes back?",
 "An error object whose field is `base`, carrying the engine's words that there is no default, and no rate.",
 ["The rate on the OSHA base of 200,000 hours, which is the engine's default when no base is named.",
  "A rate on the IOGP base of 1,000,000 hours, with a note in the basis block saying a default was used.",
  "An error object whose field is `exposureHours`, since the hours cannot be scaled to anything without a base."],
 "The engine's own words are: base is required: name the base (200,000 for OSHA/BLS, 1,000,000 for IOGP, 100,000,000 for FAR); there is no default. The tempting answer is a default, and it is the very thing the engine refuses to supply, because the two common bases put the same record five times apart."),

q(3, "Why does the engine refuse a missing base instead of assuming the most common one?",
 "A silent default would print one of two readings five times apart, and nobody would see a warning.",
 ["The base changes the count of events the engine accepts, so it has to be known before the count is checked.",
  "Every rate has a fixed base, and the refusal says to look it up.",
  "A missing base means the hours cannot be validated, since hours are only checked against a named base."],
 "UGHELLI reads 0.776317 on the OSHA base and 3.881586 on the IOGP base, 5.000000 apart. A default would quietly hand half the callers the wrong one. Only FAR has a fixed base; every other rate needs the caller to name it, and neither the count nor the hours depend on the base."),

q(0, "A caller passes a negative base. How does the engine's answer differ from the one it gives when the base is missing?",
 "The field is `base` both times, and the message changes to say a base must be a finite number of hours above zero.",
 ["The message is identical, base is required with no default, because the engine treats a negative base as missing.",
  "The engine drops the sign and computes the rate on the positive base, flagging it in its note.",
  "The field named becomes `exposureHours`, since a negative base makes the whole division meaningless."],
 "Two refusals guard the base. A missing one gets the message about naming the base with no default; a negative one gets the engine's words: base must be a finite number of hours above zero. The field is `base` in both. The engine never repairs an input by changing its sign."),

q(2, "A tally sheet shows half a case added to UGHELLI's 9 recordables. The count is passed as it stands. Which field and message does the refusal carry?",
 "`count`, with the message that a count must be a whole number, zero or more, because an event count is not a fraction.",
 ["`count`, with the message that a count must be above zero, since the engine reads a fractional count as a partial event that never finished.",
  "`exposureHours`, because the engine checks the hours before anything else and stops at the first input it cannot use.",
  "None: the engine rounds the count to the nearest whole number and returns the rate on it."],
 "The engine's own words are: count must be a whole number, zero or more: an event count is not a fraction. The same message answers a negative count. Zero is allowed, so the tempting message about a count above zero is invented, and the engine rounds nothing."),

q(1, "UGHELLI's 2318640 hours are typed in as 0 by mistake. What does the engine return?",
 "A refusal naming `exposureHours`, saying a rate over no exposure is undefined.",
 ["A rate of 0.000000, since no hours means nothing could be recorded against the count.",
  "A refusal naming `count`, since 9 events are impossible when nobody worked.",
  "A rate with a null value and a note that the hours were zero."],
 "The engine's words are: exposureHours must be a finite number of hours above zero: a rate over no exposure is undefined. A rate divides by the hours, so with none there is nothing to divide by. 0.000000 is a real rate for zero events over real hours, which is a different situation entirely."),

q(3, "UGHELLI had 0 fatalities in its 2318640 hours. What does the engine do with a count of zero?",
 "It accepts it: zero is a real observation, and the observed FAR comes back as 0.000000.",
 ["It refuses it, because a count must be above zero for the rate to mean anything, and names the field `count` in its reply.",
  "It returns null for the rate, since a zero count carries no information about the underlying hours or the base.",
  "It returns a rate of 0.000000 and names the field `count` as a warning that zero events should be checked."],
 "The count rule is a whole number, zero or more, so zero passes. A period in which people worked and nothing happened is a real statement, and UGHELLI's observed FAR of 0.000000 is exactly that. Null is kept for a period with no hours, and a warning field is only ever part of a refusal."),

q(0, "A site counted a first aid case as recordable, so its year reads 9 recordables where 8 was right. What does the engine do with the 9?",
 "It rates the 9 without complaint, because it only checks that a count is a whole number, zero or more.",
 ["It refuses the count, because the recordable class is checked against the OSHA definition before any rate is computed.",
  "It rates the 9 but adds a note to its basis block saying the case class could not be confirmed by the engine.",
  "It asks for the case list, since a count needs its cases to be classified."],
 "The engine does not classify events. The count arrives classified, and a wrongly classified recordable is still a whole number, so the engine rates it. Nothing in the arithmetic can repair a count that was classified wrongly, and no note or request for cases exists."),

q(2, "Your code receives an object carrying `error` and `field` set to `exposureHours`. What can you conclude?",
 "The call was refused over the hours and no rate was computed; the field names the input to fix.",
 ["A rate was computed and the field marks the input most likely to be wrong, for a later review.",
  "The hours were replaced with a default and the rate in the same object uses that default.",
  "The call succeeded and the field is where the basis block keeps its formula."],
 "Every function returns one of two shapes: a result object with a `basis` block, or an object with `error` and `field`. There is no third shape, so a refusal never carries a number and a rate never arrives without its basis. The field is spelled as the function spells the input."),

q(1, "Suppose corrected timesheets show the rotation crew worked exactly the day crew's exposure, with its single case unchanged. What would it then read on the OSHA base?",
 "2.500000, the day crew's rate, since count and hours would both match.",
 ["1.717033, the rate the rotation crew reads on the hours it actually worked, since the crew itself has not changed.",
  "1.456000, the ratio the rotation pattern keeps.",
  "It cannot be said without the rotation crew's headcount, which the engine would need to scale the hours."],
 "1 x 200,000 / 80000 is 2.500000. The rate follows only the count, the hours and the base, so the same count over the same hours gives the same rate whoever worked them. 1.717033 belongs to 116480 hours, and 1.456000 is the ratio of the actual hours, which would have become one."),

q(3, "Multiply out the OSHA label's 100 full-time workers at 40 h x 50 weeks. What do you get, and what is it in the engine?",
 "200000 hours, which is exactly the exported `OSHA_200K`.",
 ["200000 people, the size of the notional workforce the rate describes each year.",
  "200000 hours, which the engine uses as its default base when none is named in the call.",
  "200000 hours for each of the 100 workers, so the base is really a measure of one person's career."],
 "100 times 40 times 50 is 200000, the exported `OSHA_200K`. It counts hours and has no people in it, and it is a named base the caller may pass. The engine has no default base at all, so the tempting default reading is exactly the mistake the refusal exists to stop."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m01.json', expect_n=15)
finish()
