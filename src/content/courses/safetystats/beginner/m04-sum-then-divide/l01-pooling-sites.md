# Pooling sites and workforces

{{panel:ss-rates-explorer}}

The KWALE field has three sites. Together they recorded 12 recordable cases in 2478540 hours, and the engine's pooled rate is 0.968312 per 200,000 hours. That figure comes from adding the counts, adding the hours, and dividing once. The engine's formula line reads sum(counts) x base / sum(exposureHours).

| site | recordables, stated | hours, stated | site rate per 200,000 |
| --- | --- | --- | --- |
| compression station | 3 | 512300 | 1.171189 |
| flow station | 8 | 1904760 | 0.840001 |
| jetty | 1 | 61480 | 3.253090 |
| pooled | 12 | 2478540 | 0.968312 |

Each site rate is its own count over its own hours. The pooled rate is the whole field's count over the whole field's hours. It is the rate you would get if you had never split the field into sites at all.

## Sum, then divide

The engine names this choice and makes it for every pooled and rolling rate: sum the counts, sum the hours, then divide. The pooled rate is the rate of the whole workforce. Every hour worked anywhere in the field counts once, and every recordable counts once, so a site with more hours carries more weight in the answer, in proportion to those hours.

If someone asks how safe KWALE was last year, the honest answer is the rate at which recordables happened across all the hours KWALE worked: 0.968312 per 200,000 hours.

## The same rule for workforces

Sites are one way to split a workforce. Crews, shifts, contractors and company staff are others. The rule is the same for all of them. To get the rate for the whole, add up the events of every part, add up the hours of every part, and divide once. The engine's `pooledRate` function takes a list of counts and a list of hours, one entry per part, and does exactly that.

The two lists must line up: the first count goes with the first hours, the second with the second, and so on. If the lists are different lengths the engine refuses, naming the hours list:

> exposureHours must be an array the same length as counts

The events and the hours must also come from the same people, which the engine cannot see; it can only check the lists line up.

## The same rule at industry scale

IOGP computes its own five year rolling fatal accident rate the same way, as the sum of fatalities over the sum of hours. From 2020 to 2024 that gives 0.826095 per 100,000,000 hours, and the engine matches the golden figure with a relative difference of 0. The rule this lesson applies to three sites is the rule an industry body applies to five years of its members' data.

## What the pooled result carries

The pooled result carries more than the rate. It returns the pooled `count`, 12, and the pooled `exposureHours`, 2478540, so a reader can check the division. It also returns a second figure, the mean of the site rates, labelled as such, which the next lesson takes apart.

## Exercise

Add the three KWALE counts and confirm they make 12. Add the three sites' hours and confirm they make 2478540. Then multiply 12 by 200,000, divide by 2478540, and check you reach 0.968312. Finally, open the rates explorer's pooling view, type the three sites, and confirm the engine prints the same pooled count, hours and rate you worked out by hand.
