import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Associate m01, What a Dosimeter Day Is.
# Sources: digest sections 1, 4, 6 and 10 (Associate-owned). Every figure is printed there.

q(1, "The third OBEN period is 0.800000 h at 94.600000 dBA, and its OSHA reference duration is 4.228072 h. What share of the OSHA PEL noise dose does that period carry?",
 "18.921153 percent, the period's hours over its reference duration.",
 ["91.895868 percent, the share the same period carries on the NIOSH noise REL.",
  "23.100555 percent, the share of the 89.800000 dBA period on the action level.",
  "8.827030 percent, the share of the loudest period."],
 "A contribution is the period's hours divided by its reference duration, in percent: 0.800000 over 4.228072 is 18.921153 percent. The tempting 91.895868 percent is the same period on the NIOSH noise REL, where the reference duration at 94.600000 dBA is only 0.870551 h, so it answers a different criterion than the one asked.")

q(3, "Which statement defines the reference duration the engine returns from `noiseReferenceDurationH`?",
 "The time at a sound level that gives exactly 100 percent noise dose on the named criterion.",
 ["The time the dosimeter actually recorded at that sound level during the shift being assessed.",
  "The 8 hours of a standard shift, against which every period is divided whatever its level.",
  "The time left at a level once the periods already on the record have been subtracted."],
 "Digest section 4 defines it as the time at a level that gives exactly 100 percent noise dose, so it belongs to the criterion and the level and not to the record. The recorded hours are the numerator of a contribution and the reference duration is its denominator; mixing them up inverts the arithmetic. The time left at a level is a later derived quantity.")

q(0, "On the OSHA criterion, T = 8 / 2^((L - 90)/5) hours. What reference duration does the engine give at 100.000000 dBA?",
 "2.000000 h, two steps of 5 dB above the 90 dBA criterion level.",
 ["0.793701 h, which is what a 3 dB step up from the 90 dBA level would give.",
  "0.250000 h, the NIOSH reference duration at the same sound level.",
  "4.000000 h, the OSHA reference duration at 95.000000 dBA."],
 "100 dBA is 10 dB above 90, which is two 5 dB steps, so 8 hours halves twice to 2.000000 h. The tempting 0.793701 h comes from using a 3 dB step with the OSHA criterion level; that is the same figure NIOSH gives at 95.000000 dBA, and it mixes the two criteria. 0.250000 h is NIOSH's own answer at 100.000000 dBA.")

q(2, "OSHA Table G-16a prints 0.063 at 125 dBA, while the engine returns 0.062500 h. What does the difference mean?",
 "The printed 0.063 is a round-half-up of the fourth decimal of the formula's 0.062500.",
 ["The engine is off by 0.000500 h and needs the printed row pasted into its tables.",
  "OSHA used a 3 dB decibel exchange rate for the loud rows at the top of the table.",
  "Above 115 dBA the table stops following the formula and prints measured values."],
 "Digest section 4 says it: the formula gives exactly 0.062500 h and the table prints 0.063, a round-half-up of the fourth decimal. The difference is the table's rounding, so treating the printed figure as the true one takes the rounding for the physics. Every other G-16a row sits inside its printed tolerance in the same way.")

q(2, "The OSHA criteria carry a decibel exchange rate of 5.000000000000 dB. How does the engine measure it?",
 "It asks for the level giving a 4 hour reference duration, 95.000000 dBA, and subtracts the 90 dBA criterion level.",
 ["It asks for the level giving a 2 hour reference duration, 100.000000 dBA, and subtracts the 90 dBA criterion level.",
  "It reads the step between two adjacent rows of Table G-16a and averages the 51 steps across the whole table.",
  "It takes the printed TWA coefficient 16.61 and divides it by the 8 hours of the standard shift."],
 "Digest section 3 gives the method: the level for a 4 hour reference duration less the criterion level. On OSHA that is 95.000000 less 90.000000, so 5 dB halves the time. The 2 hour level is two halvings away and would read 10 dB, twice the rate, and G-16a rows are one decibel apart, so their steps measure nothing about the rate.")

q(0, "Using only each criterion's decibel exchange rate, at what level does the NIOSH reference duration reach 1.000000 h?",
 "94.000000 dBA, three 3 dB steps above 85.",
 ["105.000000 dBA, three 5 dB steps above 90.",
  "91.000000 dBA, where NIOSH gives 2.000000 h.",
  "88.000000 dBA, one step above 85."],
 "From 8 hours at 85 dBA, three halvings reach 1 hour, and each costs 3 dB on NIOSH, so 85 plus 9 is 94.000000 dBA, which is 60.000000 minutes in Table 1-1. The tempting 105.000000 dBA is the OSHA ladder, 5 dB a step from 90. 91.000000 dBA is only two halvings, which gives 2.000000 h.")

q(1, "On the OBEN record, how many of the six periods does the OSHA PEL setup integrate?",
 "2 of the 6, because only 94.600000 and 99.100000 dBA reach its 90 dBA threshold.",
 ["5 of the 6, because every period at or above 80 dBA counts toward the noise dose.",
  "3 of the 6, because 89.800000 dBA rounds up to the 90 dBA threshold on the day.",
  "6 of the 6, because the threshold only changes the TWA and never the noise dose."],
 "The PEL threshold is 90.000000000000 dBA, so only the third and fifth periods count. The tempting 5 of 6 is what the OSHA action level and the NIOSH noise REL integrate, because their threshold is 80. A level of 89.800000 dBA is under 90 and the engine does not round it up.")

q(3, "The second OBEN period is 1.900000 h at 89.800000 dBA. What does it add to the OSHA PEL noise dose?",
 "Nothing, since it is under the PEL threshold of 90 dBA.",
 ["23.100555 percent, the same as on the action level, because both setups share a criterion level.",
  "71.996537 percent, since its reference duration is 2.639016 h at that sound level.",
  "A fifth of a decibel's worth, since the engine prorates a period near the threshold."],
 "A period below the threshold contributes nothing however long it lasts. The tempting 23.100555 percent is the action level's figure: that setup shares the PEL's criterion level and decibel exchange rate, but its threshold is 80, so it lets this period in and the PEL does not. 71.996537 percent is the NIOSH noise REL contribution.")

q(0, "ORONI places 2.000000 h exactly on 90.000000 dBA. How much of the PEL allowance does the engine count for those hours?",
 "25.000000 percent, since judgement J2 makes the threshold inclusive.",
 ["Nothing, since a period sitting on the threshold is below it and left out.",
  "79.370053 percent, the NIOSH noise REL share of that very same period.",
  "9.375000 percent, the action level share of the ORONI 80 dBA period."],
 "Judgement J2 is that the threshold is inclusive, so a period exactly at 90 dBA is integrated on the PEL: 2 hours over an 8 hour reference duration is 25.000000 percent. Reading the line as exclusive would drop the period, which is the choice the engine did not make. 79.370053 percent is the NIOSH noise REL contribution of the same period.")

q(2, "The ORONI record also has 3.000000 h at 79.900000 dBA. Under which of the three criteria in this tier is that period integrated?",
 "Under none of them, because 79.900000 dBA is below every threshold in this tier.",
 ["Under the OSHA action level and the NIOSH noise REL, whose thresholds are both 80 dBA.",
  "Under the NIOSH noise REL alone, whose criterion level is only 85 dBA.",
  "Under all three, since every hour the dosimeter records counts."],
 "The thresholds are 90 dBA on the PEL and 80 dBA on the action level and the NIOSH noise REL, so a period a tenth of a decibel under 80 counts nowhere. The tempting answer treats 79.900000 as if it reached 80; J2 makes a period exactly on 80 count, and this one is below it.")

q(1, "A script asks `noiseReferenceDurationH` for the preset 'ACGIH'. What does the engine return?",
 "A refusal on `criterion`, saying the name is unknown and listing OSHA_PEL, OSHA_ACTION_LEVEL and NIOSH_REL.",
 ["A reference duration on the OSHA PEL, the preset the engine falls back to when a name is not recognised.",
  "A refusal on `levelDbA`, since the level cannot be checked until a known criterion has been named.",
  "A reference duration computed from a limit table the engine keeps for licensed criteria of this kind."],
 "The engine's own words are \"criterion 'ACGIH' is unknown: use one of OSHA_PEL, OSHA_ACTION_LEVEL, NIOSH_REL or pass the parameters\", on the field `criterion`. It never falls back to a default, which would print a number the caller did not ask for. The engine embeds no licensed limit table.")

q(3, "A download's first period has a negative duration. Which field does the engine name in its refusal?",
 "`periods[0].durationH`, pointing at the first period's hours.",
 ["`periods`, since the record is refused as one whole list of periods.",
  "`dosePct`, since a negative period would yield a negative total.",
  "`periods[0].levelDbA`, pointing at the first period's level."],
 "The golden case dose-negative-duration refuses on `periods[0].durationH` with the message \"periods[0].durationH cannot be negative\". The refusal names the period by position so a hygienist can go straight to the row. `periods` is the field for an empty record or one over 24 hours, and `dosePct` belongs to the TWA door.")

q(0, "An input a function cannot use arrives. What does the engine return in place of a number?",
 "An object carrying `error` and `field`, the name of the input it refused.",
 ["A verdict that the record exceeds its limit noise dose, so no number is needed.",
  "A logged message resent to the dosimeter, which reads that period again.",
  "A noise dose of zero, since the criterion cannot integrate that input."],
 "Digest section 1: every function returns a finite result or an object carrying `error` and `field`, the name of the input it refused, so a refusal is a statement about the data handed over. It is no verdict on the worker or the workplace, and the engine does nothing to the instrument. A noise dose of zero is what a real record with nothing above the threshold returns.")

q(1, "One OBEN record reads 27.748183 percent on the OSHA PEL and 265.610944 percent on the NIOSH noise REL. What is the right reading of the two figures?",
 "Both are correct, since each is a fraction of its own criterion's allowance.",
 ["The NIOSH figure is correct and the PEL figure misses periods the dosimeter logged.",
  "The PEL figure is correct and NIOSH double counts the periods above 90 dBA.",
  "One has a units error, since a single record can only give one noise dose."],
 "A noise dose is a fraction of an allowance, and the allowance belongs to a criterion, so the same record supports both numbers. The PEL leaves out periods below its 90 dBA threshold by design, which is the criterion at work. Nothing is double counted on NIOSH: its allowance is smaller, so each period carries a larger share.")

q(2, "A noise dose of exactly 100 percent on a named criterion means what?",
 "The day has used exactly one day's allowance on that criterion.",
 ["The day's loudest period reached the criterion level of that criterion.",
  "Every period on the record was integrated, since none fell below threshold.",
  "The worker spent all 8 hours at the criterion level, and at no other level."],
 "Below 100 percent some allowance remains and above 100 the day used more than one allowance, so 100 means exactly used up. Spending the whole reference duration at one level is one way to reach it, and many mixes of periods reach it too, so the 8 hours at the criterion level is a single case. The percentage says nothing about which period was loudest.")

emit(Q, '/root/hse-wip-hygiene/banks/h2b_m01.json', expect_n=15)
finish()
