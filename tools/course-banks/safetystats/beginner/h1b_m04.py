import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Associate m04, Sum, Then Divide.
# Sources: digest sections 4 and 10. Every figure is printed there.

# target rank 1
q(0, "KWALE's three sites recorded 3, 8 and 1 recordables in 512300, 1904760 and 61480 hours. What is the field's recordable rate per 200,000 hours?",
 "0.968312, from 12 recordables over 2478540 hours, summed and then divided once.",
 ["1.754760, the mean of the three site rates, which gives each site an equal say in the field figure.",
  "3.253090, the jetty's rate, since the field is only as safe as its worst site.",
  "0.840001, the flow station's rate, as the largest site."],
 "Sum the counts to 12, sum the hours to 2478540, divide once: 12 x 200,000 / 2478540 is 0.968312. The mean of the site rates, 1.754760, weights the jetty's 61480 hours like the flow station's 1904760 and describes no workforce. A single site's rate describes only that site."),

# target rank 3
q(2, "A group report prints 1.754760 per 200,000 hours as KWALE's recordable rate. What did the author do?",
 "Averaged the three site rates.",
 ["Pooled the counts and hours correctly, then converted the result to the IOGP base of 1,000,000 hours.",
  "Divided the field's 12 recordables by the field's hours, without the 200,000 base in the numerator.",
  "Added the jetty's rate to the pooled rate of 0.968312 to allow for the highest risk site."],
 "1.171189, 0.840001 and 3.253090 average to 1.754760, the engine's `meanOfPeriodRates`. The engine's note reads: meanOfPeriodRates is the unweighted mean of the per-period rates over periods with hours; it is NOT the pooled rate. The pooled rate is 0.968312, and nothing in 1.754760 came from a change of base."),

# target rank 0
q(1, "Why does the mean of KWALE's site rates sit so far above the pooled rate?",
 "The mean gives the jetty a weight of 0.333333 though it worked a share of only 0.024805 of the hours, and its rate is the highest at 3.253090.",
 ["The pooled rate leaves out the jetty, because a site with so few hours is set aside.",
  "The mean is taken on the IOGP base and the pooled rate on the OSHA base.",
  "The pooled rate divides by more sites, which lowers it."],
 "In the mean of rates each site carries one third, 0.333333. In the pooled rate each carries its share of the hours, and the jetty's is 61480 over 2478540, which is 0.024805. One recordable in very few hours gives the jetty 3.253090 and the mean lets that pull the average up. The pooled rate counts every site's hours and events once, on one base."),

# target rank 2
q(3, "By what factor does KWALE's mean of site rates exceed its pooled rate, and what drives the size of that factor?",
 "1.812185, driven by unequal hours meeting unequal rates: the jetty's high rate sits on very few hours.",
 ["1.812185, and it is fixed for any three sites, since a mean of three rates always sits that far above their pooled rate.",
  "5.000000, the ratio between the IOGP and OSHA bases, since the two figures are quoted on different bases.",
  "1.456000, the ratio of the two largest sites' hours, since the flow station and compression station dominate."],
 "1.754760 over 0.968312 is 1.812185. The gap comes from weighting: the mean weights every site equally and the pooled rate weights by hours. Unequal hours alone do not make a gap: three sites at one rate read that rate both ways, however unequal their hours. KWALE's gap is large because its highest rate, the jetty's 3.253090, sits on its smallest share of the hours. The IOGP five yearly FARs, with far less unequal hours, sit much closer: 0.833228 against 0.826095. Both KWALE figures are on the OSHA base."),

# target rank 0
q(2, "Besides the rate, `pooledRate` hands back a pooled `count` and pooled `exposureHours`. What are they for KWALE, and why are they returned?",
 "12 and 2478540, so a reader can repeat the one division that produced 0.968312 and check it.",
 ["8 and 1904760, the largest site's figures.",
  "12 and 2478540, which are needed to compute 1.754760.",
  "3 and 512300, the first site's figures."],
 "The engine returns the pooled count and hours beside the rate: 3 + 8 + 1 is 12 and the hours sum to 2478540, and 12 x 200,000 / 2478540 is 0.968312. The mean of rates is built from the three site rates, so the pooled totals are no part of it; it is returned beside them under its own name."),

# target rank 1
q(0, "A mothballed fourth site with 0 hours and 0 events is added to KWALE's list. What does the engine report?",
 "Pooled rate 0.968312, a null rate for the fourth site, `periodsWithoutHours` of 1, and the mean still 1.754760.",
 ["Pooled rate 0.968312, a rate of 0.000000 for the fourth site, and a mean of the four site rates that falls to reflect the clean site.",
  "A refusal naming `exposureHours[3]`, since any period with zero hours stops the call.",
  "A lower pooled rate, since the list now has four sites to share the 12 recordables."],
 "A site with no hours and no events adds 0 to the count and 0 to the hours, so the pooled rate stays 0.968312. Its own rate is null, never zero, because nobody worked there. A zero would pull the mean down and make the field look safer; the engine leaves it out and counts it in `periodsWithoutHours`. Only events at a zero hour site are refused."),

# target rank 2
q(1, "Why does the engine report the mothballed site's rate as null where a zero might seem simpler?",
 "A rate of zero says people worked and nothing happened; a site with no hours makes no statement at all.",
 ["Null tells the pooled rate to skip the site's hours, which would otherwise be added into the sum twice over.",
  "A zero would be refused by the engine's own count check, which requires at least one event per period of work.",
  "Null is how the engine marks a site that belongs to another field."],
 "Nobody worked at the mothballed site, so nothing could happen there and its rate is undefined. A zero would be read as a clean record from a site that did no work, and in the mean of rates it would drag the figure down. The site's hours are 0, so there is nothing to double count, and a count of zero is accepted."),

# target rank 3
q(3, "KWALE's list is typed with a fourth site at 0 hours and 1 recordable. What comes back?",
 "A refusal naming `exposureHours[3]`.",
 ["The pooled rate 0.968312 with the extra recordable set aside, since it sits against a site that recorded no hours.",
  "A pooled rate over 13 recordables and 2478540 hours, since every event must be counted somewhere in the field.",
  "A null rate for the fourth site and a warning in `periodsWithoutHours`, as for the mothballed site."],
 "The engine's own words: exposureHours[3] is zero but counts has events in that period: an event needs someone at work. Setting the event aside would lose an injury, and keeping it would put it over hours that belonged to someone else. Both would produce a wrong rate, so the engine refuses the whole call and names the period."),

# target rank 1
q(0, "The same bad entry, 0 hours with 1 recordable, is moved from fourth place to second place in the list. What changes in the engine's reply?",
 "The field becomes `exposureHours[1]`, because the index counts from zero and now points at the second entry.",
 ["Nothing: the refusal always names `exposureHours[3]`, since the engine reports the last period it checked in the list.",
  "The engine now accepts the call, since only a zero at the end of a list is treated as missing data.",
  "The field becomes `exposureHours[2]`, since the index counts from one."],
 "The index counts from zero, so `exposureHours[3]` was the fourth entry and `exposureHours[1]` is the second. The refusal names the position so the person fixing it can go straight to that row. A zero hour period with an event is refused wherever it sits in the list."),

# target rank 0
q(2, "A pooled rate is refused over a site with 0 hours and 1 event. A colleague proposes typing 1 hour for that site so the call goes through. Why is that wrong?",
 "It invents exposure; the fix is to find who was working when the event happened and record their hours in the right period.",
 ["It is too small a number, and a full month of hours should be typed in instead.",
  "The engine would still refuse, because 1 hour is below its minimum.",
  "The event would then be counted twice in the field."],
 "An event needs someone at work, so either the hours are missing or the event was recorded against the wrong site or month. Changing the zero invents hours. Any made up figure, large or small, has the same defect, and the engine has no minimum above zero. The honest repair is at the source: record the real hours or move the event."),

# target rank 2
q(3, "A caller passes 3 counts and 2 hours figures to `pooledRate`. What does the engine return?",
 "A refusal naming `exposureHours`, because the two lists must be the same length.",
 ["A pooled rate over the first two sites, with the unmatched third count set aside and flagged in the note.",
  "A refusal naming `counts`, because the counts list is the one with the extra entry.",
  "A pooled rate over all three counts and the two hours figures."],
 "The engine's own words: exposureHours must be an array the same length as counts. The first count goes with the first hours and so on, and if the lists do not line up nothing can be paired. The engine names the hours list, and it never silently drops an entry."),

# target rank 1
q(1, "Every site in a pooled call has 0 hours and 0 events. What does the engine do?",
 "It refuses the call, naming `exposureHours`: the hours sum to zero, so there is no rate.",
 ["It returns a pooled rate of 0.000000, since no events happened anywhere and a clean record is a real result.",
  "It returns a null rate for every site with `periodsWithoutHours` equal to the number of sites.",
  "It refuses, naming `counts`, since an all zero list carries no events to pool."],
 "The engine's own words: exposureHours sum to zero: a rate over no exposure is undefined. One empty period among many is set aside with a null rate; a series that is all empty has no rate at all. A rate of 0.000000 would claim that people worked and nothing happened."),

# target rank 3
q(0, "IOGP's 2020 to 2024 fatalities and hours give a five year FAR of 0.826095 by one method and 0.833228 by another. Which should a report quote?",
 "0.826095, the sum then divide figure.",
 ["0.833228, since the mean of the five yearly rates treats every year equally and so is the fairer figure.",
  "0.833228, since averaging the yearly rates is how IOGP itself computes its own five year rolling rate.",
  "Either, since the two differ only slightly and a report prints two decimals anyway."],
 "IOGP computes its five year rate as the sum of fatalities over the sum of hours, which the engine reproduces as 0.826095. The mean of the five yearly FARs is 0.833228. Treating every year equally gives a thin year the weight of a heavy one; a pooled figure counts every hour once. Rounded to two decimals the two happen to agree, which hides the choice without making it; the engine prints six, and a report quotes the method IOGP uses."),

# target rank 0
q(2, "KWALE's mean of site rates is 1.812185 times its pooled rate, while IOGP's five yearly FARs average only a little above their pooled figure. Why is the IOGP gap so much smaller?",
 "The five years' hours are far less unequal than KWALE's site hours, so weighting by hours moves the figure much less than at KWALE.",
 ["IOGP rounds its yearly rates to two decimals before averaging them.",
  "IOGP's figures are on a larger base, which shrinks every gap.",
  "Five periods average out better than three."],
 "The mean of rates and the pooled rate differ because one weights periods equally and the other weights by hours, and the gap also needs the rates to differ: KWALE's highest rate sits on its fewest hours. KWALE's jetty worked 61480 hours to the flow station's 1904760; IOGP's years run from 2544201000 to 4158877000 hours. The base scales both figures alike, and no rounding enters the engine's 0.833228 or 0.826095."),

# target rank 2
q(1, "KWALE's pooled rate of 0.968312 sits much nearer the flow station's 0.840001 than the jetty's 3.253090. Why?",
 "The flow station worked 1904760 of the field's 2478540 hours, so the pooled rate weights it most.",
 ["The engine drops the jetty from the pooled rate because a site with so few hours cannot be trusted.",
  "The pooled rate takes the median of the three site rates, and the flow station happens to sit in the middle.",
  "The flow station had the most recordables."],
 "In the pooled rate each site counts in proportion to its hours, and the flow station has most of them, while the jetty's share is 0.024805. The jetty is kept: its 1 recordable and 61480 hours are both in the sums. The engine takes no median, and its 8 recordables matter only alongside its hours."),

emit(Q, '/root/hse-wip-safetystats/banks/h1b_m04.json', expect_n=15)
finish()
