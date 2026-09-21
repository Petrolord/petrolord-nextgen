import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m01, a count is a draw.
# Figures from digest Section 13 (the IMO ladder) and Section 20 (the BLS case
# and the IOGP observed FAR with their intervals), with Associate recaps from
# Sections 2, 3, 7 and 11. No capstone workplace, input or answer appears.

q(2, "Under the Poisson count model, what is the count a site records over a year?",
 "One draw around a mean equal to the true rate times the exposure.",
 ["The true rate of the workforce, measured exactly once the hours are known and the base is named.",
  "The mean of the distribution itself, since the model sets the recorded count equal to its mean.",
  "A draw whose spread the caller must supply separately as a standard deviation."],
 "The model says a workforce has a true rate, the true rate times the exposure gives a mean count, and the recorded count is one draw around that mean. Treating the count as the true rate, or as the mean itself, ignores that another year on the same hours could have drawn five cases or nine where the BLS example drew 7.")

q(0, "Why does neither `rateConfidenceInterval` nor `compareRates` ask the caller for a standard deviation?",
 "Once the mean is known, the Poisson distribution fixes how widely counts scatter around it.",
 ["Both functions assume a default spread of one event, which suits the small counts most sites record.",
  "They estimate a spread from the monthly rates, the way a normal approximation would.",
  "The base supplies it."],
 "The Poisson count model carries its own spread: the mean fixes the scatter, so no second number is needed. A normal approximation built from monthly rates is a different method, and it is the one that fails on the small counts safety work usually has.")

q(3, "Which real situation strains an assumption the Poisson count model takes for granted?",
 "One bad job injures three people at once.",
 ["A month in which the crew works fewer hours than usual, so its exposure is small.",
  "A site that reports on the 1,000,000 base where its neighbour uses the 200,000 base.",
  "A crew whose true rate is high, so that it records many events over the year and the count grows large."],
 "The model assumes events arrive one at a time and independently. Three injuries from one job are plainly dependent, and real counts then scatter wider than the model says. A short month is handled by the model through its hours, and the base only rescales the figure.")

q(1, "On the IMO ladder, 1 event in 100000 hours and 100 events in 10000000 hours both read 2.000000 per 200,000 hours. The upper limits are 11.143287 and 2.432536. What does that pair show?",
 "The count underneath sets how sure the rate is, and the rate alone cannot tell the two apart.",
 ["The larger workforce has the lower true rate, because its upper limit is lower than the other one.",
  "One of the two rows must have been computed on a different base, since equal rates on one base carry equal limits.",
  "The engine rounds small counts upwards, which inflates the upper limit on the first row."],
 "Both rows read the same observed rate, so neither shows a lower true rate. What differs is the count, 1 against 100, and the Poisson count model makes the interval on 1 event far wider. Nothing about the base or any rounding differs between the rows.")

q(2, "On the IMO ladder at 1 event, what is the upper 95 percent limit divided by the lower one?",
 "220.068159",
 ["5.546326, which is the width of the interval measured against the rate on that row",
  "29.828286, which is the same ratio read on the second rung of the ladder",
  "1.494848, which is the ratio at the top of the ladder at 100 events"],
 "The row for 1 event reads 0.050636 to 11.143287, and the course gives their ratio as 220.068159. The figure 5.546326 is the width over the rate, a different column, and 29.828286 belongs to 2 events.")

q(3, "The IMO ladder's ratio of limits falls from 220.068159 to 29.828286 between 1 and 2 events, and only from 1.776261 to 1.494848 between 50 and 100. What does that say about adding exposure?",
 "Most of the certainty arrives early, so the first few extra events narrow the interval far more than later ones.",
 ["Every doubling of the exposure narrows the interval by the same factor.",
  "Exposure stops mattering once a site passes 50 events.",
  "It is a rounding effect of printing six decimals."],
 "A hundred times the exposure buys a great deal of certainty, and the first steps buy most of it. The step from 50 to 100 still narrows the interval, just by less, so exposure keeps mattering. The ratios are the engine's own limits divided, and no rounding is involved.")

q(0, "UGHELLI recorded 9 recordable cases in 2318640 hours and reads 0.776317 per 200,000 hours. What does that observed rate estimate?",
 "The true rate of that workforce over those hours, with events classified the way the site classified them.",
 ["The rate UGHELLI will record next year, provided the hours stay near 2318640.",
  "The rate of any sister site doing the same work under the same management.",
  "The industry rate for comparable work, which the observed rate reads directly."],
 "The target of an observed rate is narrow: this workforce, these hours, this site's classification. It says nothing on its own about next year, a sister site or an industry figure, each of which is a different quantity with its own data.")

q(1, "The ABO crew recorded 0 recordables in 41300 hours, so its observed rate is 0. What does the engine's 95 percent interval say about the crew?",
 "Its true rate could be as high as 17.863823 per 200,000 hours.",
 ["Its true rate is zero, since the lower and the upper limit both collapse onto the observed count.",
  "Nothing: the engine refuses a count of zero.",
  "Its true rate is at least 0.776317, the UGHELLI figure, because a zero is always too good to be true."],
 "A zero is an estimate too. The engine returns a lower limit of 0.000000 and an upper limit of 17.863823 per 200,000 hours, far above every other observed rate in the lesson's table. A count of zero is a legitimate input and is never refused, and no lower bound from another site applies.")

q(3, "UGHELLI's observed FAR is 0.000000 on 0 fatalities in 2318640 hours. Which reading of that figure is sound?",
 "It records what happened on those hours and bounds nothing until an interval is put beside it.",
 ["It shows UGHELLI's true fatality rate sits below IOGP's 2024 observed FAR of 0.769438.",
  "It is exact, since FAR is the one rate with a fixed base and a fixed base leaves no uncertainty behind.",
  "It proves the site's risk of a fatality over those hours was zero."],
 "An observed FAR on a few million hours with no fatalities describes the record and nothing more; the upper limit on a zero count is what bounds it. A fixed base fixes the scale of the figure and has nothing to say about how sure it is, and a zero on those hours cannot beat a figure resting on 32 fatalities in 4158877000 hours.")

q(2, "In the AKASO stream, month 11 logged 1 recordable in 18240 hours and read 10.964912, and month 12 logged none in 222150 hours and read 0.000000. What best explains the swing?",
 "One event landed in very few hours, then no event landed in many.",
 ["The true rate spiked in month 11 and then recovered.",
  "The two months were reported on different bases.",
  "The engine cannot rate a month that short, so the 10.964912 is an artefact of refusing and retrying."],
 "Nothing the rates can show changed between the two months. A thin denominator puts a small mean under the Poisson distribution, and swings like this follow as a matter of course. The engine rates any month with hours above zero, and every AKASO rate is on the 200,000 base.")

q(0, "AKASO's first rolling window pools twelve months and reads 1.208038, where the short month alone read 10.964912. Why is pooling the first defence against wide swings?",
 "The window carries 13 events, which moves the reading down the ladder from 1 event.",
 ["The window averages the twelve monthly rates to 2.026485, and averaging smooths the swings out.",
  "Pooling drops the short month from the window, which removes the source of the swing entirely.",
  "Pooling switches to the 1,000,000 base."],
 "Sum then divide puts 13 events over the window's hours, and a larger count carries a narrower interval, which is the IMO ladder's lesson. The mean of the monthly rates, 2.026485, is a different figure that still weights the short month's 10.964912 like a full month, and the window keeps the short month in it.")

q(3, "A report quotes the BLS case on the 1,000,000 base instead of the 200,000 base. What happens to the interval relative to the rate?",
 "It does not change: limits and rate move in step.",
 ["It narrows, as more hours sit behind it.",
  "It widens fivefold, the ratio of the bases.",
  "It is undefined until the base is confirmed."],
 "The interval is worked on the count and then multiplied by the base over the hours, exactly as the rate is. Naming a different base rescales the rate and both limits together and changes nothing about how sure the figure is. The hours stay 400000 whatever base is named.")

q(1, "A monthly report prints a bare 2.000000 per 200,000 hours. What should a reader ask for before deciding how much weight it carries?",
 "The count and the hours behind it.",
 ["The crew's headcount.",
  "Last month's rate, for the trend.",
  "The company's usual base."],
 "With the count and the hours, and the base already printed, a reader can run the interval in the explorer, and it shows which rung of the ladder the figure came from: 0.050636 to 11.143287 at 1 event, 1.627280 to 2.432536 at 100. Headcount is no input to the engine at all, and the base only rescales.")

q(2, "IOGP's 2024 observed FAR of 0.769438 carries a 95 percent interval of 0.526295 to 1.086218. Why is that a range a reader can work with?",
 "It rests on 32 fatalities, a respectable count.",
 ["It rests on 4158877000 hours, and hours on that scale make the figure exact.",
  "Its base is fixed, removing the doubt.",
  "IOGP rounds it to 0.77 when publishing."],
 "What sets the width of an interval relative to its rate is the number of events, and 32 is enough for a usable range. The hours are vast, and the interval is still real because the Poisson count model draws the events. A fixed base fixes the scale only.")

q(0, "The day crew in the Associate headcount lesson logged 1 recordable in 80000 hours and read 2.500000 per 200,000 hours. Which rung of the IMO ladder does its interval most resemble?",
 "The first rung, which rests on 1 event and reads 0.050636 to 11.143287.",
 ["The top rung, since 2.500000 is close to the ladder's rate of 2.000000 and the count does not matter.",
  "The rung for 10 events, because 80000 hours is a full year for a crew of 40 people.",
  "None: a crew rate carries no interval."],
 "The width of an interval relative to its rate is set by the count, and the day crew's rate rests on 1 event, the same as the first rung. Its interval will be very wide. Being near the ladder's rate says nothing about which rung it sits on, and every rate the engine computes can carry an interval.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m01.json', expect_n=15)
finish()
