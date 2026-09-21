import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional final exam, 42 questions across m01 to m06.
# Figures from digest Sections 13 to 20 (and Associate recaps from Sections 2,
# 3 and 7). At least six questions need two modules at once; they are marked
# TWO-MODULE below. ROUNDING TRAP: no key is the result of doubling or
# otherwise combining printed six-decimal figures where the last digit could
# move. No capstone workplace, input or graded answer appears.

# 1 TWO-MODULE m01 + m02
q(2, "On the IMO ladder, the row for 2 events in 200000 hours reads 0.242209 to 7.224688 per 200,000 hours, and the Garwood table's count limits for 2 are 0.242209278544 and 7.224687667724. Why do the digits match?",
 "The base over the hours is 200,000 over 200000, which is one, so scaling leaves the count limits as they are.",
 ["The ladder is computed on a base of 1 over 1 hour, the same base the Garwood table itself is printed on in the course.",
  "At 2 events the Poisson distribution is symmetric about its mean, so the rate limits and count limits coincide.",
  "The ladder rounds every limit to the nearest count limit printed in the Garwood table."],
 "A rate limit is the count limit times the base over the hours. With 200000 hours on the 200,000 base that multiplier is one, so the rate limits are the count limits printed to six decimals. The ladder uses the 200,000 base, and the Poisson distribution is skewed at every small count.")

# 2
q(0, "On the IMO ladder at 5 events, the width over rate column reads 2.008969. How is that figure formed?",
 "The upper limit minus the lower limit, divided by the rate of 2.000000.",
 ["The upper limit divided by the lower limit, 4.667333 over 0.649395.",
  "The upper limit divided by the rate, which measures how far the interval reaches above the estimate.",
  "The count of 5 divided by the square root of the hours on the row."],
 "4.667333 minus 0.649395, over 2.000000, is the width over rate the course gives as 2.008969. The upper over the lower is a different column, 7.187207 on that row, and the ladder has no square root column.")

# 3 TWO-MODULE m01 + m02
q(3, "The Garwood count limits for 1 event are 0.025317807984 and 5.571643390939. The IMO ladder row for 1 event in 100000 hours reads 0.050636 to 11.143287. What links them?",
 "Both count limits are multiplied by 200,000 over 100000, which is two.",
 ["Both are multiplied by 100000 over 200,000, the hours over the base.",
  "The ladder adds one event to the count before computing the limits, which doubles them.",
  "The ladder reports a 0.990000 interval where the table reports 0.950000."],
 "The rate limit is the count limit times the base over the hours, and 200,000 over 100000 is two: twice 0.025317807984 rounds to 0.050636 and twice 5.571643390939 to 11.143287. Inverting the fraction would halve them, and both tables are at 95 percent.")

# 4
q(1, "A site's recordables tend to arrive in clusters, several people hurt in one incident. What does that mean for the Garwood interval on its count?",
 "Real counts scatter wider than the Poisson count model says, so the interval may understate the uncertainty.",
 ["Nothing, since the Garwood interval is exact and so holds whatever the pattern of arrivals.",
  "The interval becomes too wide, since clusters make counts more predictable.",
  "The engine refuses counts from clustered events."],
 "The model assumes events arrive one at a time and independently, and the Garwood interval is exact for a count that follows it. Where one job injures several people the events are dependent and the scatter widens beyond the model's. The engine cannot detect clustering and refuses nothing on that ground.")

# 5
q(2, "A league table sorts sites by their bare recordable rates. What does the table hide?",
 "Which rung of the IMO ladder each rate came from, and so how far its true rate might sit from it.",
 ["The base each site used, which is always the part of a rate that a league table leaves out of its columns.",
  "Nothing that matters, since each rate already divides out the hours that its own site worked in the year.",
  "Each site's headcount, which sets its interval."],
 "Two sites printing 2.000000 can rest on 1 event or on 100, with intervals of 0.050636 to 11.143287 and 1.627280 to 2.432536. Dividing by the hours makes rates comparable in scale and says nothing about how sure each one is. The engine takes no headcount.")

# 6
q(3, "For the BLS count of 7, the engine reads 28.845350723405 off the chi-square distribution on 16 degrees of freedom. Which figure does it then report as countUpper?",
 "14.422675361702",
 ["28.845350723405, since the quantile on 16 degrees of freedom is already the limit",
  "13.148113802432, the upper count limit that the Garwood table prints at 90 percent",
  "7.211338, which is the BLS rate upper limit on the 200,000 base"],
 "The Garwood upper limit is chi2(1 - alpha/2; 2N + 2)/2, so it is half of 28.845350723405, which is 14.422675361702 and matches the engine's countUpper. The unhalved quantile is twice the limit, 13.148113802432 belongs to 90 percent, and 7.211338 is a later step, scaled to a rate.")

# 7
q(0, "For a count above zero, which exported function does the engine use for each Garwood limit?",
 "`chiSquareQuantile` for the lower limit, `chiSquareQuantileUpper` for the upper.",
 ["`chiSquareQuantileUpper` for both limits, since each one leaves alpha/2 in a tail.",
  "`chiSquareQuantile` for both limits, at alpha/2 and at 1 minus alpha/2.",
  "`regularizedGammaQ` for both."],
 "The engine solves the smaller tail directly. The lower limit has alpha/2 below it, which `chiSquareQuantile` asks for as it stands, and the upper has alpha/2 above it, which `chiSquareQuantileUpper` asks for directly. Asking the lower-tail function for 1 minus alpha/2 is the route the course shows losing digits as the tail probability shrinks. At a count of zero the lower limit is 0 and needs no quantile.")

# 8
q(1, "Which confidence value does `rateConfidenceInterval` accept?",
 "0.990000",
 ["95, read as a percentage and converted",
  "1, since certainty is a fraction",
  "0, as the smallest fraction"],
 "The engine accepts a fraction strictly between 0 and 1. It refuses 95 with the message confidence must be a fraction strictly between 0 and 1, for example 0.95, and strictly excludes both 0 and 1: an interval at 1 would have no upper limit and one at 0 would promise nothing.")

# 9
q(2, "With confidence 0.95 the engine forms alpha as 0.050000000000000044. What does that do to the 95 percent interval?",
 "Nothing visible: alpha is off only in its seventeenth decimal, far below any digit the course prints.",
 ["It widens the interval slightly at every count, which is part of why the coverage sits above 0.95.",
  "It forces the engine onto the upper-tail route, since the lower-tail route cannot handle it at 95 percent.",
  "It makes the engine refuse 0.95 and ask for a percentage in its place."],
 "0.050000000000000044 differs from 0.05 by less than one part in ten to the fifteen, and at a tail of 0.025 the two routes agree to the last digit printed, 7.377758908228. The coverage excess comes from the whole-number count, and the upper-tail route is chosen for small tail probabilities, where the lower-tail route loses digits and at 1e-17 cannot be asked at all.")

# 10
q(3, "The course's last row asks both quantile routes for a tail of 1e-17. What becomes of the route that works through 1 minus q?",
 "1 minus q rounds to exactly 1, so it cannot be asked the question at all.",
 ["It returns 78.287893161798, the same as the upper-tail route, to the last digit.",
  "It returns a relative error of 2.32e-5, the same as it does at 1e-15.",
  "It refuses with a message naming `confidence` as the field at fault."],
 "At 1e-17 the double 1 minus q is 1, and a quantile at probability 1 has no finite answer. The upper-tail route still returns 78.287893161798, matching minus 2 ln q, and 2.32e-5 is the lower route's error at 1e-15.")

# 11
q(0, "A reviewer sees coverage of 0.956795 at a true mean of 20.000000 and says the interval barely meets its promise there. What is the better reading?",
 "It still meets the promise; the excess is smaller at larger means because the coverage steps are finer there.",
 ["It falls short of the promise there, since 0.956795 is below 0.95 once rounding is removed.",
  "It shows the engine switches to a normal approximation above a mean of 10.",
  "It shows coverage peaks at larger means."],
 "Every coverage in the table is at or above 0.95, and at 20.000000 the excess is the smallest because a larger mean spreads over more counts. The largest excess is at 3.500000, 0.990126. The interval is exact at every mean; no approximation is switched in.")

# 12
q(1, "For a count of 7 at 0.800000, the count limits are 3.894766804876 and 11.770914461548. How much of the miss does each tail hold?",
 "10 percent in each tail.",
 ["20 percent in each tail, the whole of alpha, since a central interval places all of the miss on either side of it.",
  "5 percent in each tail, the same as at 90 percent.",
  "0.800000 in the upper tail."],
 "Alpha at 0.800000 is 20 percent, and the central interval splits it evenly, 10 percent below the lower limit and 10 percent above the upper. Putting the whole 20 percent in each tail would build a narrower interval than the one asked for.")

# 13
q(2, "At 95 percent the count of 7 has limits 2.814363051520 and 14.422675361702. Why can't that interval be written as 7 plus or minus a single figure?",
 "The interval is lopsided: the lower limit sits much closer to 7 than the upper one does.",
 ["The engine's rounding produces two different figures, which average to one single spread.",
  "A single figure would need a standard deviation, which the engine computes and hides.",
  "It can, as 7 plus or minus half the width of the interval."],
 "The Poisson distribution is skewed to the right, so the Garwood interval stretches further above the count than below it. Writing it as the count plus or minus one figure would force a symmetry that is absent, which is one reason the engine returns two limits.")

# 14
q(3, "The engine calls its rate interval exact. Which property earns it that word?",
 "The limits come from the Poisson distribution itself, with no normal approximation standing in for it.",
 ["The limits are correct to every decimal and carry no rounding at any precision the engine prints.",
  "The interval covers the true rate exactly 95 times in a hundred at every true mean.",
  "The limits are whole numbers of events."],
 "The chi-square form reads the limits off the Poisson distribution directly, which holds at the small counts safety work usually has. Coverage is at or above 0.95, never exactly 95 percent at every mean, and the limits are printed to twelve decimals as counts and six as rates.")

# 15 TWO-MODULE m02 + m03
q(0, "Read off the chi-square form, what makes the Garwood table's first row start at 0.000000000000?",
 "The lower limit sits on 2N degrees of freedom, none at N of zero, so it is 0, the value the engine returns.",
 ["The raw lower limit comes out negative, and the engine floors it at zero and flags that it did so in its result.",
  "The engine takes the lower limit from the rule of three whenever the count that it is passed is zero.",
  "Zero is the rounding of a very small positive limit."],
 "In chi2(alpha/2; 2N)/2 the degrees of freedom are 2N, and at N of zero a chi-square on none has all its mass at 0. The probability reading agrees: zero or more events always happens, so no positive mean leaves alpha/2 there. The engine returns 0 for a zero count, the golden differs by 0, and nothing is floored or rounded, and the upper quantile on 2N + 2 degrees of freedom gives the row its 3.688879454114.")

# 16
q(1, "The ABO crew's upper limit at 0.800000 is 11.150533 per 200,000 hours. What is the count upper limit behind it?",
 "2.302585092994, the mean at which zero events has probability 10 percent.",
 ["2.995732273554, the mean at which zero events has probability 5 percent, the one-sided 95 percent figure.",
  "3.688879454114, the count upper limit at 95 percent.",
  "0.800000, the confidence itself."],
 "At 0.800000 half the miss is 10 percent, and the count upper limit at zero is minus ln of half the miss, 2.302585092994; times 200,000 over 41300 that is 11.150533. The 2.995732273554 figure belongs to 0.900000 and 3.688879454114 to 0.950000.")

# 17
q(2, "Before any scaling by hours, what does the engine return as countUpper for a zero count asked at 0.990000?",
 "5.298317366548",
 ["3.688879454114, the 95 percent count limit",
  "2.995732273554, the central 90 percent count limit",
  "25.657711, the 0.990000 limit as a rate"],
 "At 0.990000 half the miss is half of one percent, and minus ln of that is 5.298317366548. Scaled by 200,000 over 41300 it becomes 25.657711 per 200,000 hours, a rate, which the question did not ask for.")

# 18
q(3, "Which formula gives the hours a crew with zero events needs before its central 95 percent upper limit reaches a target rate?",
 "The count upper limit, 3.688879454114, times 200,000 over the target.",
 ["3 times 200,000 over the target, the rule of three turned around, which the engine confirms at every target row.",
  "The target times the crew's hours over 200,000, which scales the limit down to the target directly.",
  "The target over the count upper limit, times the base."],
 "The rate upper limit is the count limit times 200,000 over the hours, so solving for the hours gives the count limit times 200,000 over the target; the engine returns the target exactly at each row, 737775.890823 hours for 1.000000. The rule of three would give fewer hours because it answers the one-sided question.")

# 19 TWO-MODULE m03 + m06
q(0, "On any hours, the rule of three figure at zero events sits roughly a fifth below the engine's central 95 percent upper limit. Why is the gap the same on every hours?",
 "Both are a count, 3 and 3.688879454114, times the base over the same hours, so their ratio never moves.",
 ["The gap depends on the hours and only looks like a fifth on the ABO crew's 41300 hours.",
  "The engine adds a fixed allowance of about a fifth to every limit at zero events.",
  "The rule of three is defined as a fifth below the exact limit."],
 "Scaling by base over hours multiplies both figures by the same factor, so their ratio is 3 against 3.688879454114 on every exposure; on the ABO hours that is 14.527845 against 17.863823. No allowance is added, and the rule of three is its own approximation to a one-sided limit.")

# 20
q(1, "A manager says the ABO crew's clean record shows it is safer than UGHELLI, which recorded 0.776317 per 200,000 hours. What does the interval say?",
 "The crew's upper limit is 17.863823, many times higher, so its clean record cannot show that.",
 ["The crew is safer, since 0 is below 0.776317 and both rates are taken on the same base of 200,000 hours.",
  "Neither can be judged, since the engine refuses to compare a zero with anything.",
  "The crew is less safe, since its upper limit is higher."],
 "A zero on 41300 hours is a small amount of evidence. Its upper limit sits far above UGHELLI's observed rate, so the record cannot rank the crew below it. A high upper limit shows only that the data are thin; it makes no case that the crew is worse.")

# 21
q(2, "What does the zero on the ABO crew's 41300 hours measure?",
 "It bounds the true rate from above.",
 ["It shows the true rate is zero over those hours, since no event was recorded at any point in them.",
  "Nothing, since an observed rate of 0 carries no information and so the interval is undefined.",
  "It bounds the rate from below."],
 "Zero is still a measurement. At 95 percent the true rate cannot be ruled out up to 17.863823 per 200,000 hours, and the lower limit is 0.000000, so the only bound the zero supplies is from above.")

# 22
q(3, "What is east's share of the ERHA events, and what does the conditional test compare it with?",
 "0.352941, set against the expected share of 0.210374 from the hours.",
 ["0.210374, set against the expected share of 0.352941 from the hours.",
  "0.352941, set against an even share of one half.",
  "0.128104, set against 0.05."],
 "East recorded 6 of the 17 events, a share of 0.352941, against 0.210374 of the hours. Under equal rates the expected share is the hour share. An even split would assume equal hours, and 0.128104 is the upper tail, the probability of a share at least that large.")

# 23 TWO-MODULE m02 + m04
q(0, "The engine's rate-ratio interval is Clopper-Pearson. In what sense is it exact in the same way the Garwood interval is?",
 "It is the exact central interval for east's binomial share of the events, converted into a ratio of rates with the hours.",
 ["It is a normal interval on the log of the ratio, which is exact once the counts pass 10 on each side.",
  "It combines the two Garwood intervals, dividing one group's limits by the other's.",
  "It is exact only when both groups worked equal hours."],
 "Conditioning turns the comparison into a binomial share, and Clopper-Pearson is its exact interval with half the miss in each tail, built like the Garwood interval. Each limit on the share becomes a ratio through the hours. A Wald log interval is an approximation, and dividing two separate intervals is no exact method.")

# 24
q(1, "The ERHA comparison is rerun with both sides reported on the 1,000,000 base. What is the rate ratio?",
 "2.047326, unchanged.",
 ["Five times 2.047326, since the IOGP base is five times the OSHA base and it scales both rates.",
  "One fifth of 2.047326, since the base moves into the denominator of the ratio.",
  "The engine refuses the 1,000,000 base."],
 "The base appears in both rates and cancels in their ratio, which is why `compareRates` takes no base at all. A base scales a single rate; it never changes a ratio of two rates on the same base.")

# 25 TWO-MODULE m04 + m05
q(2, "After the ERHA groups are swapped so that west comes first, what is the central p-value?",
 "0.256209, the same as before.",
 ["0.951727, now that the other tail is the observed one.",
  "0.128104, the smaller tail on its own.",
  "One minus 0.256209, since the question is reversed."],
 "Swapping the groups exchanges the two tails, and the smaller one keeps its value, so twice it is unchanged. The ratio and its limits invert; the p-value does not. 0.128104 is a single tail left undoubled.")

# 26
q(3, "Which of these is an input to `compareRates`?",
 "The confidence.",
 ["The base, on which both rates are then expressed before the ratio is taken.",
  "The headcount of each group, which sets the expected proportion.",
  "The common rate, to be tested against."],
 "`compareRates` takes count1, exposureHours1, count2, exposureHours2 and confidence. The base cancels in a ratio, the expected proportion comes from the hours, and conditioning on the total removes the common rate.")

# 27
q(0, "In compare-first-zero the empty group comes first and the engine returns a ratio of 0.000000. In compare-second-zero the empty group comes second. What changes in the shape of the output?",
 "The ratio becomes null with an unbounded upper limit and a finite lower limit, where before it was zero with a finite upper limit.",
 ["Nothing, since the engine sorts the groups so that the empty one always comes first.",
  "The comparison is refused, since a zero in the denominator is undefined.",
  "The p-value becomes null."],
 "Put the empty group first and the ratio is zero with a finite upper limit, 0.990863 in the golden; put it second and the ratio is something over zero, returned as null with upperUnbounded true and a finite lower limit, 1.100207. The p-value exists in both, 0.048748 and 0.039551.")

# 28
q(1, "Which call does `compareRates` refuse?",
 "One with a group that has no hours.",
 ["One with a first group that has no events, as in compare-first-zero.",
  "One with a second group that has no events, since its rate ratio is unbounded.",
  "One with counts under five, as a binomial on so few events is too coarse to be tested."],
 "A group with no hours has no rate, and the engine names `exposureHours2` in that case; both groups empty is refused too. One empty group is a legitimate comparison, returned with a zero or an unbounded ratio, and no minimum count applies.")

# 29
q(2, "What is UTOROGU's rate ratio of 3.445148?",
 "North's rate over south's, from 7 events in 355200 hours and 6 in 1048900.",
 ["North's count over south's count, 7 over 6.",
  "South's rate over north's, from the same counts and hours.",
  "The ratio of the two groups' hours."],
 "The rate ratio divides one rate by the other, each a count over its hours; the base cancels. The raw count ratio ignores that south worked far more hours, and the engine reports north over south because north is passed first.")

# 30
q(3, "Why is UTOROGU's minlike p-value of 0.025879 labelled DERIVED?",
 "The engine does not compute it; it is derived beside the engine's central figure for comparison.",
 ["It is derived from the central p-value by halving it, which is the minlike convention on every input.",
  "It is read off the rate-ratio interval.",
  "The engine computes it and hides it."],
 "The engine returns one p-value, the central one, 0.051759. The minlike figure is the convention of R and scipy, computed outside the engine so the two can be set side by side. It is a different sum over the binomial, and halving the central figure is no general route to it.")

# 31
q(0, "A report reads UTOROGU's central p-value of 0.051759 as nearly significant and writes that north's rate is higher. What should it carry in place of that claim?",
 "Both ends of the interval, 0.991404 and 12.408545, which leave equality and a very large gap both open.",
 ["That north's rate is higher, since 0.051759 is within rounding of 0.05 and so counts as significant.",
  "That the rates are equal, since the p-value is above 0.05 at the stated confidence and nothing was found.",
  "That the minlike figure of 0.025879 settles it."],
 "The interval 0.991404 to 12.408545 includes 1 and also reaches far above it, and a report has to give both ends. Treating a p-value above 0.05 as a difference or as equality each tells half the story, and swapping to the minlike convention after seeing the result changes the rule and not the evidence.")

# 32 TWO-MODULE m04 + m05
q(1, "ERHA's interval is 0.621694 to 6.039396 and UTOROGU's is 0.991404 to 12.408545. Which comparison is the thinner evidence, judged by the upper limit over the lower?",
 "UTOROGU, whose upper limit is over twelve times its lower where ERHA's is under ten times.",
 ["ERHA, since its p-value of 0.256209 is the larger of the two and so marks the weaker evidence.",
  "UTOROGU, since it has fewer events in total than ERHA, and the total count alone sets the width.",
  "They are equally thin, since both include 1."],
 "The ratio of the limits measures how much the data leave open, and UTOROGU's spans a wider multiple, from just below 1 to 12.408545. A larger p-value is no measure of how wide the uncertainty is, and a total count alone does not settle the width of a ratio's interval, which depends on both counts and the hour split.")

# 33
q(2, "What does the size of a p-value tell you about the size of a difference between two rates?",
 "Nothing on its own; the rate-ratio interval answers that.",
 ["A smaller p-value always means a larger rate ratio.",
  "The p-value is the probability that the rate ratio is 1, so its size measures how far the ratio sits from equality.",
  "The p-value divided by 0.05 is the ratio."],
 "A p-value is the probability, under equal rates, of a split at least as lopsided as the one seen. It mixes the size of a difference with the size of the counts, so a large difference on few events and a small one on many can read alike. The interval gives the size and the verdict together.")

# 34
q(3, "Why does the lesson say to report the interval first and the central p-value beside it?",
 "The interval carries the size of the difference as well as the verdict.",
 ["The p-value is less accurate than the interval at six decimals, so it belongs second in the line.",
  "Readers in R will only recognise the interval.",
  "The p-value is optional in the house form."],
 "The interval says how large a difference the data allow at each end and, by whether it includes 1, gives the same verdict as the central p-value. The p-value is kept as a check and must name its convention. Both are printed to six decimals.")

# 35
q(0, "A report must carry IOGP's 2024 observed FAR with its uncertainty. Which version follows the course's house form?",
 "0.769438 per 100,000,000 hours (32 fatalities in 4158877000 hours; 95 percent exact interval 0.526295 to 1.086218)",
 ["0.77 per 100,000,000 hours (32 fatalities in 4158877000 hours; 95 percent exact interval 0.526295 to 1.086218)",
  "0.769438 per 100,000,000 hours (21 fatal incidents in 4158877000 hours; 95 percent exact interval 0.526295 to 1.086218)",
  "0.769438 (32 fatalities; 95 percent exact interval 0.526295 to 1.086218)"],
 "The house form keeps six decimals, the base, the count and hours, and the interval with its confidence. The published 0.77 drops the precision, 21 is the fatal incident count behind a different rate, 0.504944, and the last line drops the base and the hours.")

# 36
q(1, "IOGP's 2024 observed FAR is 0.769438 with an upper limit of 1.086218. How far above the observed rate does that limit sit?",
 "More than a third above it.",
 ["About twice it, as the limits on 32 events span a factor of two.",
  "Within rounding of it, since the hours run to billions.",
  "Exactly one third above it, which is the Garwood rule at 95 percent."],
 "1.086218 over 0.769438 is more than one and a third: 32 events is a modest count even on 4158877000 hours. The factor of about two is the upper limit over the lower one, 0.526295, and no fixed fraction applies at every count.")

# 37 TWO-MODULE m03 + m06
q(2, "To report UGHELLI's fatality-free year properly, what should sit beside its FAR of 0.000000?",
 "Its 0 fatalities in 2318640 hours and an exact upper limit at a stated confidence, from the zero events arithmetic on the FAR base.",
 ["Nothing more, since a zero FAR has no interval and the fixed base already states what it is per.",
  "The IOGP 2024 interval of 0.526295 to 1.086218, as the reference a zero FAR is read against.",
  "The rule of three figure, which is how the house form writes a zero."],
 "A zero is reported with its upper limit, and the same zero events arithmetic bounds a fatality count on the FAR base. The IOGP interval belongs to a different count on different hours, and the house form writes the engine's exact interval with its confidence.")

# 38
q(3, "Why does the house form keep six decimals, the count whole and the hours as stated?",
 "So that anyone with the engine can check the line figure by figure.",
 ["Because the engine refuses to print a rate at any other precision or with rounded hours.",
  "Because six decimals is the grading tolerance of the course.",
  "Because the confidence requires it."],
 "A report that follows the form can be recomputed line by line from its own count, hours and base. The precision is the course's printing convention; the engine computes at full precision and tolerances are made elsewhere.")

# 39
q(0, "A comparison line in a report quotes a p-value without naming its convention. What is the risk?",
 "A reader who checks it in R finds a different number on some inputs and cannot tell which is right.",
 ["None, since every exact test gives the same p-value on the same counts once the hours are fixed.",
  "The p-value will be read as a percentile.",
  "The engine's p-value is only valid with its name."],
 "The engine's p-value is central; R's poisson.test and scipy's binomtest are minlike, and on 14 of the 399 comparisons the course swept they disagree with the engine's interval. Naming the convention lets a reader compare like with like.")

# 40 TWO-MODULE m01 + m05
q(1, "UTOROGU's comparison rests on 7 events against 6. How does the IMO ladder help explain why it found no clear difference?",
 "A single count of that size already carries a wide interval, and a ratio of two such counts inherits both widths.",
 ["The ladder shows every rate below 20 events is unreliable, so any comparison on fewer is refused.",
  "The ladder holds the rate at 2.000000, which is close to both UTOROGU rates.",
  "It does not; the ladder is about single rates only."],
 "On the ladder the upper limit is 3.835008 times the lower at 10 events, and a comparison of two counts in that range inherits the width of both. So a finding of no difference on counts like these usually says more about the counts than the rates. Nothing is refused for being small.")

# 41
q(2, "In the ERHA comparison, which figure is the probability that east records 6 or fewer of the 17 events if the rates are equal?",
 "0.951727, the lower tail.",
 ["0.128104, the upper tail, which covers 6 or more of the 17.",
  "0.256209, the central p-value.",
  "0.210374, the expected proportion."],
 "The lower tail counts the observed 6 and everything below it, 0.951727. The upper tail counts 6 and above, 0.128104, and is the smaller, so it is the one the central p-value doubles. 0.210374 is the binomial probability for a single event.")

# 42
q(3, "A report writes the BLS case as 3.500000 per 200,000 hours (7 cases in 400000 hours; 90 percent exact interval 1.407182 to 7.211338). What is wrong with the line?",
 "The confidence label: those are the 95 percent limits.",
 ["Nothing, since the house form lets a writer name any confidence as long as some confidence is named.",
  "The limits should be the count limits, 2.814363051520 and 14.422675361702, as the house form quotes counts.",
  "The rate should read 3.5, as BLS publishes it."],
 "Half of the 95 percent count limits for 7, 2.814363051520 and 14.422675361702, gives 1.407182 and 7.211338; the 90 percent count limits, 3.285315691895 and 13.148113802432, would give a narrower pair. The house form quotes rate limits at six decimals, and a wrong confidence label is a wrong claim.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_exam.json', expect_n=42)
finish()
