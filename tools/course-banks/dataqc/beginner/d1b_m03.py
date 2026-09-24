import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Associate m03, Is It Valid.
# Sources: digest sections 7, 8 and 9, and the unit and channel refusals in section 4.
# Every figure is printed there.

q(3, "What kind of limit does the engine ship for its range check?",
 "Definitional limits only: bounds a value cannot cross by the definition of the quantity, each keyed by unit.",
 ["Typical ranges for each log curve, drawn from published sand and shale values and applied to every well by default.",
  "Basin ranges set for the Ekene field, which the caller can widen or narrow when checking a well in another field.",
  "Tool ranges supplied by the logging contractor for each curve it records."],
 "The engine ships definitional limits and no other kind, keyed by unit, with a bound marked exclusive when the bound itself is not allowed. It carries no plausibility range for any basin or tool; a narrower range is a claim about a place and a tool, and the caller supplies it."),

q(1, "EKENE-7's resistivity at entry 120 is zero. What does the range check do with it, and why?",
 "It flags the value below the minimum, because the resistivity minimum of 0 is exclusive: resistivity is positive.",
 ["It passes the value, since a resistivity equal to its minimum sits inside the limit, as every value on a bound does.",
  "It flags the value as missing, since a zero resistivity means the tool recorded nothing.",
  "It refuses the call, since a zero divides nothing and the unit ohm.m cannot hold it."],
 "The resistivity limit in ohm.m has a minimum of 0 with the minimum excluded. The engine's reason says so in its own words: \"value 0 is below the minimum 0 (the minimum itself is not allowed)\". Strictly beyond is the rule for an inclusive bound; an exclusive bound is the declared exception. Zero is a present value, and nothing is refused."),

q(0, "A gamma ray of exactly 0 gAPI and a resistivity of exactly 0 ohm.m go through the range check. What happens?",
 "The gamma ray passes and the resistivity fails, since only the resistivity minimum is marked excluded.",
 ["Both fail, since a reading of zero on either tool means the tool recorded no signal at that depth at all.",
  "Both pass, since each value sits exactly on its minimum, and a value on a minimum is always inside the limit.",
  "The gamma ray fails and the resistivity passes, since API units are counts above zero."],
 "Both channels carry a minimum of 0. The gamma ray scale is non-negative, so 0 is allowed; resistivity is positive, so its minimum is excluded and 0 fails. The minimum excluded column, beside the same number, changes what the number means."),

q(2, "The range check reports EKENE-7's density as 228 checked and the neutron as 237. Why not 240 each?",
 "The checked count covers present values only, and the density has 12 missing samples and the neutron 3.",
 ["The range check skips the samples inside the splice, where two logging runs overlap.",
  "The engine drops the values it flags before it counts what it checked, and those two channels had failures.",
  "The count excludes each channel's first and last samples, which have no neighbouring step on one side of them."],
 "A missing value is not checked against a limit, so the checked count is the present count: 240 less 12 for the density, 240 less 3 for the neutron. The density has 0 failures, so nothing was dropped for failing, and the engine drops nothing in any case."),

q(0, "You pass EKENE-7's density with a caller minimum of 1.950000 and a maximum of 2.950000. It reads 228 checked and 0 failed. What does that result establish?",
 "That every present density sits inside the band you chose, which is only as strong as the band itself.",
 ["That every density on the log is a correct reading for the Ekene sands and shales it was logged across.",
  "That the engine agrees with the band, since it rejects any caller range it judges too wide for the tool.",
  "That the density log also matches the engine's own built-in plausibility range for a density tool in a sand."],
 "Zero failures against a caller range says every present value sits inside the band you chose, and nothing about whether the band was well chosen. The engine carries no range of its own for any tool, so it neither endorses nor rejects a band, and the basis says \"limits supplied by the caller\"."),

q(3, "Why does the engine carry no density or gamma ray range for any basin or tool?",
 "A range that suits one field or tool would flag honest data in another, so the assumption stays with the caller who knows the well.",
 ["It does carry them, but only applies them when the caller names the basin in the call.",
  "Ranges are too costly to compute from a log of 240 samples inside the engine.",
  "It carries one range per curve, and a caller range is added on top of it."],
 "A check should only claim what it can defend everywhere. A density range from one field would flag honest data in another with a different mineralogy, and a default would produce flags that look like engine findings and are really someone's assumption. The engine has no basin input and no built-in plausibility range."),

q(1, "The Professional tier owns a dimension called plausibility. How does a caller's minimum and maximum in this tier differ from it?",
 "A caller range is a validity check against limits you stated in advance; plausibility asks which values stand apart from the rest by a statistical measure.",
 ["They are the same check, and a caller range is the Associate name for the plausibility dimension.",
  "A caller range is a consistency check between two channels that should agree.",
  "A caller range is a completeness check, since values outside it are counted as missing."],
 "The course uses plausibility range for a caller's band, and that is still validity: each value is compared with limits chosen beforehand. The plausibility dimension asks a different question, which values sit far from the rest, and this tier uses only the first. A caller range compares one channel with its band and counts nothing as missing."),

q(2, "Asked to check a sonic log in a unit it does not list, what does the engine do?",
 "It refuses, naming the field `unit`, lists us/ft and us/m, and states that units are never converted here.",
 ["It converts the values to us/ft using a factor looked up from the unit name, and says so in its basis.",
  "It checks the values against the us/ft limit, the first unit it lists, and adds a flag saying the unit was assumed.",
  "It refuses, naming the field `channel`, since sonic is listed only in us/ft."],
 "The engine's own words are: unit must be one of us/ft, us/m for channel sonic: units are never converted here. Unit names in files are not reliable enough to act on silently, so the engine refuses and leaves the decision to a person who can read the header. Sonic is listed in both us/ft and us/m."),

q(3, "EKENE-7's sonic, declared in us/m, passes the range check with 240 checked and 0 failed. What does this show about a unit mislabel?",
 "That a mislabel between the two listed sonic units is invisible to the definitional limit, since a slowness is positive in either unit.",
 ["That the engine detected the us/m label and converted the sonic before checking it.",
  "That EKENE-7's sonic was recorded in us/m, since a wrong unit would fail the limit.",
  "That the us/m limit is wider than the us/ft limit and admits every sonic value."],
 "Both units carry the same definitional limit, positive with the minimum excluded, so a log labelled with the wrong one passes at every sample. The label is the caller's responsibility. The engine converts nothing, a pass proves nothing about the unit the tool used, and the two limits are identical."),

q(0, "A caller passes a channel the engine does not list. Which field does the refusal name?",
 "`channel`, with a message listing the ten channels it does list, from fraction to temperature.",
 ["`unit`, with a message listing the units it accepts for the nearest listed channel it could match.",
  "`values`, since the values cannot be checked against any limit until a listed channel is named.",
  "`channel`, with a message listing all 16 channel and unit pairs it holds, each with its limits."],
 "The engine's own words are: channel must be one of fraction, rate, cumulative, gammaRay, resistivity, bulkDensity, sonic, caliper, absolutePressure, temperature. That is the 10 channels; the 16 channel and unit pairs come from some channels being listed in more than one unit, and the message lists channels only."),

q(2, "EKENE-7's neutron fails the fraction limit ten times, at entries 150 to 159, with values such as 23.300000. What do the flags tell you?",
 "That ten values cannot be fractions in v/v; whether they are percentages is for the caller to decide from the header and run notes.",
 ["That ten values were written in percent, which the engine infers from their size.",
  "That ten values were converted back to fractions before the flags were raised.",
  "That ten values are missing, since a fraction above one is read as an absent reading."],
 "Each flag says a value is above the maximum 1, for example \"value 23.3 is above the maximum 1\". The engine never converts a unit and does not guess at the cause; a percent slip is the likeliest story, and the stated defect confirms it, but the same flags could come from another channel pasted into the wrong column."),

q(1, "The fraction limit in v/v runs from 0 to 1. A neutron value of exactly 1 goes through the range check. What happens?",
 "It passes, since the maximum is inclusive and neither end of the fraction range is marked excluded.",
 ["It fails, since the engine flags any value that reaches the maximum as well as any value beyond it.",
  "It fails, since a porosity of 1 would be all pore space and the fraction maximum is marked exclusive.",
  "It is refused, since a value sitting on a bound needs the caller to say which side of it it belongs to."],
 "A value of 1 is allowed and a value above 1 is not: the maximum is inclusive, and the fraction's minimum is not excluded either, so 0 and 1 both pass. The engine fires strictly beyond a limit unless a bound is marked excluded, and it refuses nothing for sitting on a bound."),

q(3, "EKENE-3's oil column goes through `rateCheck`. Which two days fail, and under which rules?",
 "Day 47, -18.500000 bbl/d, under negative-rate, and day 61, 1271.700000 bbl/d, under rate-while-shut-in.",
 ["Day 47 under negative-rate and day 60 under rate-while-shut-in, since day 60 is a shut-in day on the sheet.",
  "Day 59 under rate-while-shut-in, since it ran only 18.500000 hours, and day 61 under that same rule too.",
  "Days 31 to 33 under negative-rate, since a missing rate is read as below zero."],
 "87 days are checked and 2 fail: the allocation back-out on day 47 and the rate carried onto the shut-in day 61. Day 60 is shut in with a rate of 0.000000, which is correct and not flagged. Day 59 ran part of the day and is not shut in. The three missing days are not checked at all."),

q(0, "When does `rateCheck` treat a day as shut in?",
 "When `status` is 'shut-in' or `hoursOn` is 0; a partial day such as day 59's 18.500000 hours is not shut in.",
 ["When `hoursOn` is below 24.000000, since any lost hours mean the well was shut in for part of the day and made nothing.",
  "When the rate is 0, since a zero rate can only come from a shut-in well.",
  "When `status` is 'shut-in' and `hoursOn` is 0 together, since either one alone could be a typing slip."],
 "Shut in means status is 'shut-in' OR hoursOn is 0, and either is enough. A well that flowed part of the day produced something, so a positive rate then is allowed. A zero rate is a value, and the check reads the status and the hours to decide shut in."),

q(1, "The same EKENE-3 oil column goes through `rateCheck` given the rates alone, with no status and no hours on. How many days fail?",
 "1, the negative rate on day 47, since without status or hours the check cannot know day 61 was shut in.",
 ["2, since the engine infers that day 61 was shut in from the rates on the days around it and flags it anyway.",
  "0, since the check needs a status column before it applies either rule.",
  "3, since the three missing days count as failures when no hours are given."],
 "With rates alone the check fails 1; with the status it fails 2, with the hours on 2, and with both 2. Either column reveals the carried-forward rate. The negative-rate rule needs only the rate, and missing days are never judged by this check. A check is only as good as the context you hand it."),

emit(Q, '/root/dai-wip-dataqc/banks/d1b_m03.json', expect_n=15)
finish()
