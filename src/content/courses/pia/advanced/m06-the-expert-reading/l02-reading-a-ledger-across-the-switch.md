# Reading a ledger across the switch

{{panel:pia-ledger-calculator}}

This lesson reads one ledger from its first year to its last, naming the provision behind every line that changes character at 1 January 2026. The case is ekene_onshore_across_2026 (synthetic; onshore, converted lease, 2024 to 2028, oil at 75 USD/bbl and no gas). Its arithmetic belongs to the cash flow course. The reading belongs here.

## The framework column

The engine reports the ledger as "pia_only_then_nta_2025", with the first NTA year 2026. The first two rows are years under the Act alone and the last three years under the Nigeria Tax Act 2025. Every line below either ignores that column or turns on it, and telling the two apart is the whole skill.

## The lines that ignore it

The royalty and the royalty by price do not read the framework. The terrain rates and the tranches are restated word for word, and the royalty by price benchmarks escalate each year on their own rule whichever Act governs. The hydrocarbon tax rate of a converted onshore lease is 30 percent under both. So the royalty and hydrocarbon tax rows of this ledger move with production and the benchmarks, and the switch leaves them alone.

## The lines that turn on it

| year | framework | capital allowance | CIT assessable profit | CIT | TET | development levy |
| --- | --- | --- | --- | --- | --- | --- |
| 2024 | pia_only | 18000000.000000 | 153422584.102902 | 40626775.230871 | 4602677.523087 | 0.000000 |
| 2025 | pia_only | 18000000.000000 | 138422805.570953 | 36126841.671286 | 4152684.167129 | 0.000000 |
| 2026 | nta_2025 | 18000000.000000 | 123013136.548913 | 31503940.964674 | 0.000000 | 4920525.461957 |
| 2027 | nta_2025 | 18000000.000000 | 109119842.223295 | 27335952.666989 | 0.000000 | 4364793.688932 |
| 2028 | nta_2025 | 18000000.000000 | 96315736.305067 | 23494720.891520 | 0.000000 | 3852629.452203 |

Read the rows provision by provision.

**The education tax and the levy.** 2024 and 2025 carry the tertiary education tax at 3.000000 percent of the assessable profit (Finance Act 2023 s.26). From 2026 that line is empty, because NTA s.197(5) deletes sections of the Act behind the tax, and the development levy of NTA s.59(1) takes its place at 4 percent of the same kind of base.

**The capital allowance.** The single spend of 2024 claims 20 percent in each of its five years. Its fifth year is 2028, a year under the new Act, so it claims 20 percent there too (NTA First Schedule Part II para 14(1)). Under the Act alone that year would have claimed 19 percent and retained 1 percent.

**The restriction.** The engine flags the two thirds restriction as applying in 2024 and 2025 and not from 2026. On this lease it does not bind: two thirds of each assessable profit is larger than the allowance, so the whole allowance is claimed in every year.

**The notes.** Among its notes, the ledger carries the one on the Nigeria Tax Act version, because it holds years under that Act, and the note on the restriction, because it holds years under the Act alone.

## What a reader says about this ledger

Put in a sentence: the royalty and hydrocarbon tax lines follow production under texts that did not change, while companies income tax, the education tax and the levy change character at 2026 under the Nigeria Tax Act 2025 as gazetted in June 2025. A reader who can write that sentence for any ledger has the Expert skill.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_onshore_across_2026. Confirm the TET and levy columns and read every note under the ledger. Then set pia_under_nta_2025_override to "force_pia", read the 2028 row again and explain each change from a provision named in this lesson. Repeat with "force_nta" for the 2024 and 2025 rows.
