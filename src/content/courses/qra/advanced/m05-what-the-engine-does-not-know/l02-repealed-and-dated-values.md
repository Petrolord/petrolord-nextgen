# Repealed and dated values

{{panel:qr-alarp}}

Two sets of values the engine carries have a date on them that matters. The Dutch societal line comes from a decree repealed on 1 January 2024. The HSE values of preventing a fatality are 2001 and 2003 figures. The engine uses both, labels both with their dates, and makes none of them a default where a default would hide the date. This lesson reads each date and what the analyst does with it.

## The Dutch line, published and repealed

The preset `vrom-establishments` is C = 1e-3, alpha = 2, from N = 10, with no upper end. Its source, verbatim: "TNO Purple Book CPR 18E (1999) Figure 6.8; Besluit externe veiligheid inrichtingen (2004, repealed 1 January 2024) art. 13(1)(b)". The three Bevi points lie on the line:

| N | Bevi value, printed | the line, engine constants |
| --- | --- | --- |
| 10 | 1e-5 | 1e-5 |
| 100 | 1e-7 | 1e-7 |
| 1000 | 1e-9 | 1e-9 |

Bevi article 13 asked for the group risk to be COMPARED with those points, calling them an orientation value. Bevi was repealed on 1 January 2024, and the engine did not read its successor. So the analyst treats the Dutch line as a historical published comparison. The JISIKE off-site curve EXCEEDS it, worst ratio 18.000000 at N = 300.000000. That is a statement about a published comparison the analyst chose to make, and it carries its date wherever it is quoted.

## The VPF and its year

| illustrative value | figure |
| --- | --- |
| VPF, 2001 | 1000000 |
| VPF, 2003 Q3 | 1336800 |

Both are in GBP at their own price year. The checklist values are 2003 figures, current HSE figures were not found on a live page, and the engine makes neither a default. A VPF of 1000000 in 2001 prices and one of 1336800 in 2003 prices are sums of money from different years. An analyst who uses either states the figure and its year, and justifies it. The injury values per case in the checklist carry the same 2003 date and need the same treatment.

## What a dated value does to a verdict

For the EDIKAN firewall, which prevents fatalities only, the benefit is deltaPLL times the VPF, so the ratio and the verdict both move with the VPF. Undiscounted at a VPF of 1000000 the ratio is 8.750000. A different VPF gives a different ratio, which is why an ALARP note shows the verdict at the other defensible choices of VPF and its year as well as its own. A date is more than a footnote here: it is an input to the answer, and a reviewer checking the note needs it as much as the figure.

## Exercise

Take the Dutch line's three printed points and check that C / N^alpha, with C = 1e-3 and alpha = 2, gives each of them. Then take the JISIKE worst ratio of 18.000000 at N = 300.000000 and write one sentence for an ALARP note that reports it in a way that makes the repeal of Bevi plain to a reader.
