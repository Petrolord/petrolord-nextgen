import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m05, The Rolling Rate.
# Sources: digest sections 4, 10 and 11. Every figure is printed there.

# target rank 2
q(3, "AKASO's first twelve months hold 13 recordables in 2152250 hours, with a shutdown month and a short month inside. What is the rolling rate for that window per 200,000 hours?",
 "1.208038, from 13 x 200,000 / 2152250, one division over the whole window.",
 ["2.026485, the mean of the monthly rates in the window, which lets each month speak for itself.",
  "1.209454, the rolling rate the engine prints for the first window of the series.",
  "1.306019, the window ending in month 15."],
 "A rolling rate is a pooled rate over the window: sum the counts, sum the hours, divide once, and 13 x 200,000 / 2152250 is 1.208038. The mean of the monthly rates, 2.026485, gives the short month the weight of a full one. 1.209454 belongs to months 2 to 13, and 1.306019 to months 4 to 15."),

# target rank 1
q(0, "AKASO has 15 months of data. How many rolling rates does the engine return with a window of 12, and why?",
 "4, one for each complete window: 15 less 12 plus one.",
 ["15, one for each month, with the early months built from however many months exist so far.",
  "12, one per month of the window.",
  "3, since the window moves only after a full year."],
 "The engine returns one entry per COMPLETE window and none for the first eleven months, which have no complete window yet. Months 1 to 12, 2 to 13, 3 to 14 and 4 to 15 make 4. A partial window would be printed beside full ones under the same label while carrying less exposure, so the engine does not build one."),

# target rank 3
q(2, "AKASO's first three windows read 1.208038, 1.209454 and 1.207931, and the fourth jumps to 1.306019. What moved it?",
 "Month 3 left, with 0 recordables, and month 15 came in with 1.",
 ["The shutdown month left the window, so the fourth window has more hours of real work in it than the first three.",
  "The short month 11 dropped out of the window, which had been holding the rolling rate down in the earlier windows.",
  "The fourth window is the first one the engine computes over a full year of work, so it is the one to report."],
 "When the window moves on a month, one month drops out of the back and one comes in at the front. Window 4 runs from month 4 to month 15: month 3 had 0 recordables and month 15 has 1, so the count rises from 13 to 14 over similar hours. The shutdown month 5 and the short month 11 are inside every window."),

# target rank 0
q(1, "Month 11 at AKASO had 1 recordable in 18240 hours. What is its own monthly rate per 200,000 hours, and what does that figure say about month 11?",
 "10.964912, which says little: it is one event over very few hours, and the same recordable in a full month such as month 2 reads 1.006289.",
 ["10.964912, which shows month 11 was the least safe month of the year by a wide margin.",
  "1.006289, since one recordable in any month reads the same on this base.",
  "0.000000, since a short month is left out as incomplete."],
 "1 x 200,000 / 18240 is 10.964912. One event is one event; its rate is large because the hours are few, and month 2 had the same single recordable in 198750 hours and reads 1.006289. The rate depends on the hours, so the months do not read the same, and a short month is kept with its own hours."),

# target rank 2
q(0, "In every AKASO window the mean of the monthly rates sits well above the rolling rate, for instance 2.026485 against 1.208038 in window 1. What is the cause?",
 "The short month's rate of 10.964912 enters the mean with the weight of a full month, and it is inside every window.",
 ["The rolling rate leaves out the shutdown month's recordables, which the mean of the monthly rates keeps and counts in full.",
  "The mean of the monthly rates is computed on the IOGP base and the rolling rate on the OSHA base, a factor of five between them.",
  "Recordables were higher late in the year."],
 "In the rolling rate month 11 adds 1 to the count and 18240 to the hours, so its one event counts like any other. In the mean it is one of the rates averaged, at 10.964912, and pulls the mean up. The gap is steady because the cause is steady. The shutdown month had no recordables, and both figures are on the 200,000 base."),

# target rank 0
q(2, "Window 1 at AKASO covers 12 months. How many monthly rates go into its mean of the monthly rates, and why?",
 "Eleven: month 5 was a shutdown with no hours, so it has no rate and the engine leaves it out of the mean, while it still sits in the window.",
 ["Twelve, with the shutdown month entered as a rate of 0.000000.",
  "Twelve, with the shutdown month given the window's own rate.",
  "Ten, since both the shutdown and the short month drop out."],
 "The engine's note reads: meanOfPeriodRates is shown for comparison only; a period with no hours has no rate and is left out of that mean. Month 5 has 0 hours, so it has no rate at all; entering it as zero would pull the mean down. The short month has hours, so its rate of 10.964912 stays in, and the window reports 1 month without hours."),

# target rank 1
q(3, "Month 5 at AKASO was a shutdown: 0 hours and 0 recordables. What does it do to the rolling rate of each window it sits in?",
 "Nothing: it adds 0 to the count and 0 to the hours, and is reported as 1 month without hours.",
 ["It lowers the rolling rate, because the window is divided across twelve months though only eleven of them were worked.",
  "It stops the window, since the engine refuses any window that contains a month with 0 hours in it.",
  "It enters as a rate of 0.000000 and pulls the window down."],
 "A rolling rate sums the counts and sums the hours, and a month with neither adds nothing to either sum. The engine divides by hours, never by a number of months. It refuses only a month with events and no hours; a month with neither is counted in the months without hours, 1 in every AKASO window."),

# target rank 3
q(1, "A caller asks for a twelve month rolling rate over only 8 months of data. What does the engine do?",
 "It refuses, naming `windowPeriods`.",
 ["It returns one rolling rate over the 8 months and labels it as a partial twelve month window in the basis block.",
  "It shortens the window to 8 months to fit the series and reports the change in the basis block's `windowPeriods`.",
  "It returns 8 null windows, each carrying a reason that there are not yet enough months to build a full window."],
 "The engine's own words: windowPeriods is longer than the series: no complete window exists. A rate labelled as a twelve month rate should be one, so the engine neither shortens the window nor builds a partial one. It returns nothing it cannot compute over a complete window."),

# target rank 1
q(2, "A rolling call arrives with no `windowPeriods`. What does the engine reply?",
 "A refusal naming `windowPeriods`: it must be a whole number of periods, 1 or more, with 12 as the example for a rolling 12-month rate.",
 ["A rolling rate with a window of 12, since that is the usual length for monthly data and so serves as the engine's default window for a call.",
  "A single pooled rate over the whole series, since no window means the whole series.",
  "A refusal naming `base`, since the base is checked first and the window second."],
 "The engine's own words: windowPeriods must be a whole number of periods, 1 or more (12 for a rolling 12-month rate). There is no default window, just as there is no default base. The 12 in the message is an example of a common value, and the engine does not quietly fall back on a pooled rate."),

# target rank 2
q(0, "Three periods have 0, 0 and 5000 hours with 0, 0 and 1 events, and a window of 2 is asked for. What do the two windows read?",
 "Window 1 null, with the reason that it has no hours, and window 2 40.000000.",
 ["Window 1 0.000000 and window 2 40.000000, since an empty window is a clean window.",
  "A refusal naming `exposureHours[1]`.",
  "Window 1 null and window 2 null as well, since window 2 still holds one of the empty periods."],
 "Window 1 covers the two empty periods and has no hours, so its rate is null and the engine gives its reason: no hours in this window: the rate is undefined. Window 2 covers 0 and 5000 hours with 1 event, and 1 x 200,000 / 5000 is 40.000000; its mean of rates is also 40.000000 because only one period in it has hours. Nothing here is an event without hours."),

# target rank 0
q(1, "IOGP's five years from 2020 to 2024 are run through the rolling rate with a window of 5 on the 100,000,000 base. What comes back?",
 "One window reading 0.826095, the same figure the pooled rate gives, because five years hold exactly one complete five year window.",
 ["Five windows, one per year, each carrying that year's FAR.",
  "One window reading 0.833228, the mean of the yearly FARs.",
  "A refusal, since the window equals the series."],
 "The IOGP five year rule is a rolling window of 5 years, and 5 years hold one complete window. A rolling rate is a pooled rate over a window, so that window reads 0.826095, the sum then divide figure. 0.833228 is the mean of the yearly rates, which the engine prints beside it for comparison. Only a window longer than the series is refused."),

# target rank 3
q(3, "A dashboard shows a rolling twelve month rate at month 6 of a new site's data. What is wrong with it by the engine's rule?",
 "It is built from six months.",
 ["Nothing, as long as the six months are pooled by sum then divide and the base is named clearly in the label beside it.",
  "It should have been built from the mean of the six monthly rates, since there are too few months to pool them.",
  "It needs a window of 6 named in the call, and the engine would then label it a twelve month rate."],
 "The engine returns nothing until the first window is complete. A figure built from six months would sit beside figures built from twelve under the same label while carrying about half the exposure, and a reader could not tell them apart. Pooling correctly does not fix a window that is only half there."),

# target rank 1
q(0, "For window 4 at AKASO, months 4 to 15, the table gives 14 recordables in 2143920 hours. What rolling rate should you reach by hand?",
 "1.306019, which is 14 recordables times 200,000 over the window's 2143920 hours.",
 ["2.111567, the mean of that window's monthly rates, since each month in the window is a separate report.",
  "1.207931, window 3's rate.",
  "1.208038, the first window's rate."],
 "14 x 200,000 / 2143920 is 1.306019. 2.111567 is the window's mean of monthly rates, printed beside the rolling rate for comparison and pulled up by the short month. 1.207931 belongs to months 3 to 14, and each window gets its own sum then divide."),

# target rank 0
q(2, "AKASO's window 1 reads 1.208038 as a rolling rate and 2.026485 as a mean of monthly rates. Which is AKASO's rolling twelve month rate, and why?",
 "1.208038, because it gives every hour worked in the window the same weight, so a short month counts for the hours it actually holds.",
 ["2.026485, because it treats every month of the year as an equal report.",
  "2.026485, since it includes the short month's high rate.",
  "Their average, to balance the two methods."],
 "Summing the counts and the hours gives every hour the same weight, which is what a rate over a year should mean. The mean of the monthly rates gives a short month the same say as a full one, and one event in the short month then moves a twelve month figure more than several events in full months. Averaging the two figures has no meaning."),

# target rank 2
q(1, "Besides the base, the label and the formula, what does the rolling rate's basis block carry that the pooled rate's does not?",
 "`windowPeriods`, so the length of the window travels with the answer.",
 ["`periodsWithoutHours`, so the number of empty months travels with the base.",
  "`standard`, since the rolling rule is an IOGP standard.",
  "`count`, the total events over the whole series."],
 "The rolling rate's basis keys are base, baseLabel, windowPeriods, formula and note; the pooled rate's are base, baseLabel, formula and note. The months without hours are reported per window beside each rate, and a `standard` key appears only on the FAR and PSE results."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m05.json', expect_n=15)
finish()
