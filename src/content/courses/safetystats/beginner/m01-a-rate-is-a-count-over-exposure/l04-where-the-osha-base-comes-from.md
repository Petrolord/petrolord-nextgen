# Where the OSHA base comes from

The number 200,000 looks arbitrary until you multiply it out: 100 times 40 times 50 is 200000. That product is the exported `OSHA_200K`, and the engine's own label for it says where each factor comes from.

| factor | value | what it stands for |
| --- | --- | --- |
| workers | 100 | full-time workers |
| hours a week | 40 | a standard working week |
| weeks a year | 50 | a working year |
| product | 200000 | the OSHA and BLS base in hours |

The label the engine returns beside any rate on this base reads "per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks)". So a rate per 200,000 hours can be read as the number of cases a hundred full-time workers would have in a year at the observed rate.

## The base is a scale for reading

That reading is useful, and it is also where confusion starts. The base describes an imaginary workforce of 100 people working 40 hours for 50 weeks. Nobody counted your people to produce it, and the rate on this base has no headcount in it.

Go back to the two crews of 40 from the last lesson. The day crew worked 80000 hours and read 2.500000 per 200,000 hours. That figure means: at the day crew's observed rate, 100 full-time workers on a 40 hour week for 50 weeks would have about 2.500000 recordable cases in a year. The rotation crew read 1.717033 on the same base. The base translated each crew's own hours into the same imaginary year, and that is exactly why they can be compared.

## The other two bases

The IOGP base of 1,000,000 hours is five times the OSHA base, so the same rate reads five times larger on it. The fatal accident rate uses 100,000,000 hours, large enough that a rare event such as a fatality gives a readable number. On UGHELLI the recordable rate is 0.776317 per 200,000 hours and 3.881586 per 1,000,000 hours; the ratio of 5.000000 is the ratio of the two bases.

None of these bases is more correct than another. Each is a convention a reporting body chose so that everyone reporting to it uses the same scale.

## Reading a rate aloud

Because the base is a scale, a rate read without its base is half a sentence. A recordable rate of 3.5 means one thing on the OSHA base and a far better safety record on the IOGP base. The worked example the BLS publishes reads 3.5 on the OSHA base, from 7 recordables in 400000 hours, and the final module of this tier reproduces it through the engine. Before quoting any rate, say its base out loud with it.

## Exercise

Multiply 100 by 40 by 50 and confirm you reach 200000, the value of `OSHA_200K`. Then take the day crew's 2.500000 per 200,000 hours and say in one sentence what that figure means for a hundred full-time workers over a working year. Finally, divide 1000000 by 200000 and explain why that answer is the same as the 5.000000 ratio between UGHELLI's two recordable rates.
