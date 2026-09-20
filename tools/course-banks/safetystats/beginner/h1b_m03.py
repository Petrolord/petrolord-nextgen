import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m03, Fatal, Severity Rate and Process Safety.
# Sources: digest sections 4, 7, 8, 9 and 28. Every figure is printed there.

# target rank 2
q(3, "IOGP's 2024 figures are 32 fatalities in 21 fatal incidents over 4158877000 hours. What observed FAR does the engine return?",
 "0.769438 per 100,000,000 hours, from the 32 fatalities.",
 ["0.504944, from the 21 fatal incidents, since one incident is one fatal event on the record.",
  "0.820324, the figure IOGP published for the year the 2024 report covers.",
  "0.77 exactly, as published."],
 "32 x 100,000,000 / 4158877000 is 0.769438. The FAR counts people who died, so a fatality count goes in; the 21 fatal incidents give the fatal incident rate of 0.504944, a different count on the same hours. 0.820324 is the 2023 FAR, and the published 0.77 is the engine's figure at two decimals."),

# target rank 0
q(1, "A report prints 0.504944 per 100,000,000 hours for IOGP 2024 and calls it the FAR. What has gone wrong?",
 "0.504944 is the fatal incident rate from 21 incidents; the FAR uses the 32 fatalities on the same hours and reads 0.769438.",
 ["Nothing, since a fatal incident and a fatality are the same event in IOGP's counting.",
  "The report used the 2023 hours, which is why the figure sits below the 0.820324 printed that year.",
  "The figure is on the OSHA base and needs multiplying by 500.000000 to reach the FAR."],
 "In 2024 the 32 fatalities happened in 21 fatal incidents, because some incidents killed more than one person. The first count gives the FAR of 0.769438 and the second the fatal incident rate of 0.504944. Treating them as one event loses the people who died in the same incident. Both are per 100,000,000 hours, on the 2024 hours."),

# target rank 1
q(0, "Why does `fatalAccidentRate` take no base argument when every other rate in the engine requires one?",
 "The engine takes IOGP's definition of FAR, fatalities per 100,000,000 hours, and fixes that base; every other rate is quoted on more than one.",
 ["Fatality counts are too small for the caller to be trusted with a base, so the engine picks one for them.",
  "The FAR base is the product of the OSHA base and the IOGP base, so it is already implied by the two named bases in the engine's `RATE_BASES` export.",
  "It does take one, but it defaults to 100,000,000 when left out, which is the only default in the engine."],
 "The engine takes the IOGP definition of FAR and fixes its base; every other rate in this course is quoted on more than one base, so there the engine refuses to guess. A recordable rate may be per 200,000 or per 1,000,000 hours. Other bodies frame a fatal rate differently, per worker-year for one, so a FAR quoted from elsewhere needs its definition checked before it is set beside this one. There are no defaults anywhere; the FAR function simply has no base input."),

# target rank 3
q(2, "The same 32 fatalities and 4158877000 hours go into `incidenceRate` with a base of 100,000,000. What comes back?",
 "0.769438, the same as the FAR function.",
 ["A refusal, since a fatality count may only be rated by the fatal accident rate function and nowhere else.",
  "0.769438 with a `standard` key reading IOGP safety performance indicators, FAR, exactly as the fixed base function prints it.",
  "0.504944, since the general function counts incidents where the FAR function counts people."],
 "The arithmetic is identical, so the two functions agree at 0.769438; a report pack can keep that as a check against a mistyped input. The `standard` key belongs to the FAR function's basis block only, because `incidenceRate` cannot know what its count means. The engine counts whatever it is given."),

# target rank 1
q(0, "UGHELLI's observed FAR is 0.000000 from 0 fatalities in 2318640 hours. How should it appear in a report?",
 "As 0.000000 with its 2318640 hours beside it, since a zero on a few million hours says little on its own.",
 ["As proof that the site's true fatal accident rate sits below the IOGP figure of 0.769438 for 2024, since it had none.",
  "Left out of the report altogether, because the engine refuses to rate a count of zero.",
  "Recomputed on the OSHA base, since a FAR near zero is easier to read per 200,000 hours."],
 "Zero is a real count, so the engine returns 0.000000, and it is correct. A site working a few million hours would rarely see a fatality even at a rate far above the industry figure, so the zero proves nothing against 0.769438. The honest report gives the zero with the hours behind it. The FAR base is fixed."),

# target rank 2
q(3, "A risk assessment in another course will produce a FAR too. When should this course's figure be written as an observed FAR?",
 "Wherever a predicted FAR could be meant, since both are per 100,000,000 hours and both are called FAR.",
 ["Only when the base is not 100,000,000, since the base is the thing that separates an observed figure from a predicted one.",
  "Whenever the count is zero, since a zero FAR is the only one a predicted FAR could ever be confused with.",
  "Never, because a FAR is observed by definition."],
 "In this course a FAR is computed from deaths that happened over hours that were worked. The planned QRA course will teach a predicted FAR, estimated before anyone is exposed, on the same base and under the same name. Writing observed FAR wherever the two could be confused names the difference before a reader confuses it."),

# target rank 0
q(1, "UGHELLI lost 96 days in 2318640 hours. What severity rate does the engine return on the 200,000 hour base?",
 "8.280716 per 200,000 hours, from 96 x 200,000 / 2318640, with no time charges added to the days.",
 ["48.000000, the 96 days divided by the 2 lost time cases.",
  "41.403581, the same days on the 1,000,000 hour base.",
  "0.172515, the lost time rate over the same hours."],
 "The formula is daysLost x base / exposureHours, so 96 x 200,000 / 2318640 is 8.280716. 48.000000 is days per case, a different quantity with no hours in it, which the engine does not compute. 41.403581 answers the IOGP base, and 0.172515 counts cases instead of days."),

# target rank 3
q(2, "UGHELLI's 96 days lost must be restated for a reader who works per 1,000,000 hours. Which figure goes in?",
 "41.403581, from the 96 days.",
 ["8.280716, which is UGHELLI's severity rate on the OSHA base and needs no conversion for a pack.",
  "48.000000, the days lost for each lost time case, which the pack calls its severity rate.",
  "0.862575, the lost time rate UGHELLI reads on the IOGP base of 1,000,000 hours."],
 "96 x 1,000,000 / 2318640 is 41.403581, five times the OSHA figure of 8.280716 because only the base changed. Days per case, 48.000000, has no hours in it and is a different quantity. 0.862575 counts lost time cases where the question wanted days, and answers another question."),

# target rank 1
q(1, "Suppose UGHELLI's same 96 days had been spread over 4 lost time cases in the same hours. What happens to its two measures of how serious its injuries were?",
 "The severity rate stays at 8.280716 and the days per case fall, because only the case count changed.",
 ["Both stay the same, since the 96 days lost did not change and both measures are built on the days.",
  "The severity rate doubles and the days per case stay at 48.000000, because more cases means more exposure.",
  "Both fall, since spreading the same days over more cases makes every single injury less serious on every measure."],
 "The severity rate is days x base / hours and has no case count in it, so it stays at 8.280716. Days per case is days over cases, 96 over 2 today, so doubling the cases halves it. The days and the hours are unchanged, so nothing can move the severity rate."),

# target rank 2
q(0, "Your severity rate for a site does not match a figure computed for the same record under the ANSI Z16.1 convention. Where should you look first?",
 "At time charges: ANSI Z16.1 added scheduled days for fatalities and permanent disabilities, and the engine adds none.",
 ["At the count, since ANSI Z16.1 rates the number of lost time cases while the engine's severity rate works from the days.",
  "At rounding, since the two conventions are the same formula and agree once both are printed to six decimals.",
  "At the hours, since ANSI Z16.1 excludes overtime."],
 "The engine's note reads: no ANSI Z16.1 time charges are added; days are as counted by the caller. ANSI Z16.1 used the 1,000,000 hour base and charged fixed days for a fatality or a permanent disability, so the two can differ from the same record. Both conventions use days, and the note is there so the gap has a known source."),

# target rank 0
q(3, "A caller passes 45.5 days lost in 1830000 hours on the 1,000,000 hour base. What does the engine do?",
 "It accepts the half day and returns 24.863388, because days lost may be fractional while an event count may not.",
 ["It refuses, because days lost must be a whole number, like any count.",
  "It rounds the days up to a whole day and returns the rate on that.",
  "It refuses the base, which is for the PSE rate."],
 "The golden case passes 45.5 days and the engine returns 24.863388 with a relative difference of 0. A half day away can be recorded, so the engine accepts it; only a negative number of days is refused. The whole number rule belongs to event counts, and the 1,000,000 base is a named base for any rate here."),

# target rank 1
q(2, "UGHELLI reported 1 Tier 1 process safety event in 2318640 hours. What is its Tier 1 PSE rate on the 200,000 hour base?",
 "0.086257, from 1 x 200,000 / 2318640, with the tier given as an input.",
 ["0.431287, since the PSE rate is quoted on the IOGP base of 1,000,000 hours.",
  "0.345030, which is the rate UGHELLI's process safety events give on this base when the Tier 1 and Tier 2 events are rated together.",
  "0.242424, the Tier 1 golden rate, since the engine uses fixed PSE benchmarks."],
 "1 x 200,000 / 2318640 is 0.086257. The same event on the 1,000,000 base reads 0.431287. 0.345030 is the Tier 2 rate from its 4 events, and the engine rates one tier per call. 0.242424 is a separate golden case, 2 Tier 1 events in 1650000 hours, and the engine carries no benchmarks."),

# target rank 3
q(0, "A caller tries to rate a Tier 1 event on the 100,000,000 hour base. What does the engine say?",
 "It refuses, naming `base`: a PSE rate takes only the 200,000 or the 1,000,000 base.",
 ["It returns a PSE rate on that base, since any positive base is accepted for any rate the engine computes.",
  "It refuses, naming `tier`, since the FAR base is only allowed for Tier 2 events, which are the more frequent kind.",
  "It returns the FAR in place of the PSE rate."],
 "The engine's own words: base must be 200,000 or 1,000,000 for an API RP 754 PSE rate. A PSE rate is taken consistent with the basis for calculating the Company's occupational injury rate, so only those two bases are accepted. The tier is not what failed, and the engine never swaps one function for another."),

# target rank 2
q(1, "You are handed a description of a release and asked for its PSE rate. Why can the engine not rate it as it stands?",
 "The tier is an input, and classifying a release needs API RP 754's licensed threshold tables, which the engine lacks.",
 ["The engine can classify it, but only when the released quantity is given in kilograms and the material is named in the call.",
  "The engine rates releases directly and returns the tier with the rate in its basis block, so nothing is missing.",
  "Only Tier 3 events can be rated from a description, so the engine refuses it."],
 "The engine does not decide whether an event is Tier 1 or Tier 2. That needs the threshold quantity tables of API RP 754, which are licensed and are not in the engine, the golden or this course. A learner given a tier can rate it; a learner given a release has to classify it elsewhere first. Tier 3 is refused."),

# target rank 0
q(2, "UGHELLI's Tier 2 PSE rate and its DART rate both read 0.345030 per 200,000 hours. What does that equality mean?",
 "Only that both counts are 4 over the same 2318640 hours; it says nothing about how process events relate to injuries.",
 ["That each Tier 2 event caused a DART case.",
  "That the engine rates PSEs as injuries.",
  "That the site is equally safe on both measures and has nothing more to learn from either one."],
 "Both are 4 x 200,000 / 2318640, so the equality is arithmetic. A site can do well on one and badly on the other, and nothing in the rates links a process safety event to an injury. The engine has a separate `pseRate` function with its own formula and standard lines, though its arithmetic has the same shape."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m03.json', expect_n=15)
finish()
