# One credit per IPL

{{panel:lp-worksheet}}

A layer is credited once. The engine's credit rule carries that clause in its first words, verbatim: "an IPL is credited once, and only when flagged independent === true and not flagged auditable === false". One entry, one factor in the product, however many times the same hardware appears on the list.

## The duplicate is refused by name

Two IPLs with the same name are refused, and the comparison ignores case, so the same layer entered twice in different case is caught:

> ipls[1].name: 'relief valve' appears twice: one credit per IPL

The message names the index of the second entry and quotes the name that collided. The refusal carries no number, because the engine computed nothing. It stopped at the list.

## Why a double credit is worse than it looks

A layer counted twice would halve the frequency twice for one piece of hardware. In ORONI's terms, the relief valve carries an IPL PFD of 0.01. Credited once alongside the alarm at 0.1 it produces a credited product of 0.001000000000 and a mitigated frequency of 0.000013500000 per year. Credited a second time it would multiply the frequency by 0.01 again, and the row would claim a hundredfold reduction that exists nowhere in the plant.

| quantity | engine key | value |
| --- | --- | --- |
| product of the credited IPL PFDs | `iplProduct` | 0.001000000000 |
| mitigated frequency without a SIF, per year | `mitigatedFrequencyWithoutSifPerYr` | 0.000013500000 |

The error is quiet. Nothing in a worksheet looks wrong when a relief valve appears as a mechanical layer in one row of the list and again as a pressure relief safeguard a few rows down. The names differ, the intent differs, and the hardware is the same single valve.

## The name is the check

The engine can only compare what the analyst typed, so the name is doing real work. Naming a layer by its tag and its function gives the duplicate check something to catch. Naming it by a general description gives it nothing, and the engine will happily credit the same valve twice under two different descriptions and refuse nothing at all.

That limit is worth stating plainly. The one credit per IPL rule is enforced on the name, and the judgement about whether two differently named entries are the same physical layer stays with the analyst and the review. The engine's check catches the careless duplicate. It does not catch the disguised one.

## Exercise

Take the credited product of 0.001000000000 and work out what it would become if the relief valve at 0.01 were credited twice. Then carry your figure through to a mitigated frequency, starting from ORONI's unmitigated 0.013500000000 per year, and say how far the result sits from the 0.000013500000 per year the engine actually returns. Name the field the engine would have refused on.
