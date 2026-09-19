# The IOGP million hour base

{{panel:ss-rates-explorer}}

On the IOGP base of 1,000,000 hours, UGHELLI's 9 recordables read 3.881586, its 4 DART cases read 1.725149 and its 2 lost time cases read 0.862575. The same counts on the OSHA base read 0.776317, 0.345030 and 0.172515. Every IOGP figure is exactly 5.000000 times its OSHA partner.

| case class | count | per 1,000,000 hours | per 200,000 hours |
| --- | --- | --- | --- |
| recordable | 9 | 3.881586 | 0.776317 |
| DART | 4 | 1.725149 | 0.345030 |
| lost time | 2 | 0.862575 | 0.172515 |

The engine labels this base "per 1,000,000 hours (IOGP)". It is exported as `IOGP_1M`, with the value 1000000.

## Who uses it

IOGP, the international association of oil and gas producers, collects safety data from its member companies and publishes it on this base. A company that reports to IOGP, or compares itself with IOGP figures, works in rates per million hours. The same company may also report to a national regulator on the OSHA base. It is common for one site to carry two recordable rates, five times apart, for two different audiences.

That is not a problem as long as each number carries its base. It becomes a problem the moment somebody copies a figure from one report into another without the label. The number looks like a rate, it has the right letters beside it, and it is wrong by a factor of five in one direction or the other.

## IOGP's own definitions

The base is only half of what IOGP fixes. It also defines which cases go into each count. IOGP's lost time injury rate counts fatalities plus lost workday cases per million hours. Its total recordable injury rate counts fatalities, lost workday cases, restricted workday cases and medical treatment cases per million hours. So an IOGP TRIR includes fatalities in its count.

The engine does not know any of this. It takes whatever count it is given and puts it over the hours on the base named. If you want a rate that can sit beside an IOGP figure, you have to count the way IOGP counts before you call the engine, and name the IOGP base when you do. UGHELLI states 0 fatalities for its year, so its recordable count is the same under either definition, but that will not hold for every site.

## A larger base, the same information

A larger base does not make a rate more precise. UGHELLI's 3.881586 per 1,000,000 hours and 0.776317 per 200,000 hours carry exactly the same information, because both came from 9 events in 2318640 hours. The larger number describes the same risk counted over a larger block of hours. Whether 9 events is enough to know the rate well is a question for the next tier, and it has the same answer on every base.

## Exercise

Open the rates explorer and type UGHELLI's 9 recordables and 2318640 hours on the IOGP base. Confirm the engine returns 3.881586 and read the label it prints. Then switch to the OSHA base and divide the IOGP figure by the new one; you should reach 5.000000. Finally, write the UGHELLI recordable rate as a sentence suitable for an IOGP submission, with its base and its count definition.
