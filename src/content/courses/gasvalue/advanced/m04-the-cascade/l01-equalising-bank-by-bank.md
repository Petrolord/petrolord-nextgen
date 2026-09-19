# Equalising bank by bank

IBAFO's station fills buses from three banks at three pressures. The arrangement is a cascade, and `cascadeFills` works out how the gas moves from the banks into each vehicle. This lesson reads the rule the engine fills by, and what it does to each bank.

{{panel:gasvalue-rollout-explorer}}

## The cascade

IBAFO's cascade: Low 2 m3 at 230 bar(a), Mid 2 m3 at 250 bar(a), High 2 m3 at 270 bar(a). A bus tank of 0.1 m3 arrives at 25 bar(a) and is filled to 200 bar(a). The gas is IBAFO's, specific gravity 0.62 at 30 C. All of it is invented for the course. The three banks are the same volumes, pressures and gas the bank module read.

## The rule

The engine states the rule on the result: "Each vehicle equalises with the lowest bank above it, then the next bank up, until it reaches its target. A bank delivers only while its pressure exceeds the vehicle tank. Isothermal: the heat of a fast fill is not modelled."

Three things are in that note. A vehicle draws from the lowest bank above its own pressure first. It moves up a bank when that one stops delivering. And a bank delivers only while its pressure exceeds the vehicle tank's.

The engine counts whole fills until the next vehicle cannot reach its target.

## The fills, bank by bank

The first fills and the last, with the banks each one drew on, lowest first:

| fill | banks used |
| --- | --- |
| 1 | Low |
| 2 | Low |
| 3 | Low, Mid |
| 37 | Low, Mid, High |
| 38 | Low, Mid, High |

Fills 1 and 2 draw on the Low bank alone. Fill 3 draws on Low and then Mid. Fills 37 and 38 draw on all three, Low, then Mid, then High.

Read that list against the rule. Every fill on the list starts at the Low bank, and every vehicle arrives at 25 bar(a). Under the rule, a fill moves up a bank until the vehicle reaches its target of 200 bar(a).

## What happens to each bank

| bank | startBar | endBar |
| --- | --- | --- |
| Low | 230.0000 | 58.9110 |
| Mid | 250.0000 | 118.3350 |
| High | 270.0000 | 202.6470 |

The Low bank starts at 230.0000 bar(a) and ends at 58.9110. The Mid bank starts at 250.0000 and ends at 118.3350. The High bank starts at 270.0000 and ends at 202.6470. Every pressure on this table is absolute, and the cascade result prints pressureBasis absolute (bar(a)) beside it.

## Isothermal

The note's last sentence is a limit. Both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. The next lesson reads that count.

## What the oracle checks

The validation oracle runs the cascade as a mass ledger with conservation asserted. Its checks are independent of the engine.

In practice, a station operator sets the order in which its dispensers switch banks, and the study types the banks in that order.

## In the explorer

Open IBAFO's cascade. Read the banks used on the first fills and the last, and each bank's start and end pressure. Change the High bank's pressure and read which fills reach it.

## Exercise

Read the banks-used list, fills 1, 2, 3, 37 and 38, and the bank table: Low 230.0000 to 58.9110, Mid 250.0000 to 118.3350, High 270.0000 to 202.6470. Using the engine's note, say which bank each vehicle draws on first and when it moves up, which fill is the first to use the Mid bank, and what the note says the engine does not model.
