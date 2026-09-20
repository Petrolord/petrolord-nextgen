# Days per hour and days per case

{{panel:ss-rates-explorer}}

UGHELLI lost 96 days across its 2 lost time cases. Divided by the cases, that is 48.000000 days a case. Put through the engine as a severity rate on the 200,000 hour base, the same 96 days read 8.280716. Both figures describe how serious UGHELLI's injuries were, and they are different quantities.

| quantity | how it is made | UGHELLI | computed by the engine |
| --- | --- | --- | --- |
| severity rate | days lost x base / hours | 8.280716 per 200,000 hours | yes |
| severity rate | days lost x base / hours | 41.403581 per 1,000,000 hours | yes |
| days per case, derived | days lost / lost time cases | 48.000000 | no |

## Two questions about the same days

The severity rate asks how many days were lost for each block of hours worked. Its denominator is exposure, so it rises when there are more injuries or when each one keeps someone off work longer. It can be set beside another site's severity rate on the same base.

Days per case asks how long the average lost time case kept someone away. Its denominator is the number of cases, and it has no hours in it at all. A site with one injury that cost 48 days and a site with fifty injuries that each cost 48 days both read 48.000000 days a case. Their severity rates would be very different.

## What IOGP calls it

The days per case shape is the shape of IOGP's LWDC severity: lost workday case days per lost workday case. The name carries the same word as the engine's severity rate, and the two quantities have different units and answer different questions. This course keeps them apart by always saying "severity rate" for days per base hours, and "days per case" for the other.

The engine does not compute days per case. It has one function in this area, `severityRate`, and it returns days lost times a base over hours. The 48.000000 above is derived by hand, 96 over 2, to show the difference. A learner who wants days per case divides the days by the cases; a learner who wants a severity rate asks the engine and names a base.

## Why the difference matters in a report

Suppose a report says injuries got less serious this year. If the report means days per case, a site could have more injuries, each slightly shorter, and still show a fall. If the report means the severity rate, the same site might show a rise, because the total days per block of hours went up. Both readings are arithmetic on real records, and a reader who does not know which quantity was printed cannot tell whether things improved.

So any figure for how serious injuries were should travel with its denominator. Days per base hours is a severity rate and needs its base named. Days per case needs its case definition named, because a lost time case at one company may not be a lost time case at another.

## Exercise

Take UGHELLI's 96 days and 2 lost time cases. Divide one by the other and confirm the 48.000000 days a case. Then compute the severity rate on the OSHA base from the 96 days and 2318640 hours and check it against 8.280716. Finally, suppose the same 96 days had been spread over 4 lost time cases in the same hours. Say which of the two figures would change, which would stay, and why.
