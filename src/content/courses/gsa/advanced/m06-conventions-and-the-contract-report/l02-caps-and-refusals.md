# Caps and refusals

{{panel:gsa-contract-calculator}}

An engine that refuses bad input by name is easier to trust than one that computes something from it. This engine refuses in two ways: it caps the size of a single call, and it refuses any input that is missing, unknown or impossible, with the field it names and the exact condition that failed.

## The size caps

| cap | value | the engine's message when a call exceeds it, verbatim |
| --- | --- | --- |
| `MAX_YEARS` | 100 | years must have at most 100 entries; got 101 |
| `MAX_DAYS` | 400 | days must have at most 400 entries; got 401 |
| `MAX_MONTHS` | 1200 | months must have at most 1200 entries; got 1201 |
| `MAX_INDICES` | 10 | formula.weights must have at most 10 indices; got 11 |

The cap on contract years is the one a whole-contract call can meet, and the message names the count it was given. The engine's validation record states, verbatim: "At every cap a call stays well under 100 ms". A panel stays well inside every cap.

## The refusals of a whole-contract call

The course tables 90 refusals across the engine's 9 functions. A whole-contract call meets the ledger's refusals with the path prefixed by contract, and its own. Three that this tier teaches:

> royalty must be an object { terrain, inCountrySharePct } (no default terrain); got nothing

> discountRate must be a finite number above -1; got -1

> contract.makeUp.order must be one of "after-adjusted-acq", "after-top-quantity", "first"; got "lifo"

Each message starts with the field it refuses and states the condition in full. A figure inside a message is the shortest round-trip decimal of the value it was given. A refusal is course content: read it as the engine's own words, and quote it whole in any report that meets one.

## Four rules the refusals follow

1. A contract term with no default is refused when it is missing: the make-up terms, the recovery order, the royalty terrain, the take-or-pay price, a shortfall price when a seller shortfall is stated, and the domestic base price.
2. A key a function does not read is refused at whatever level it sits, with its path and the full list of accepted keys.
3. A quantity that cannot be true is refused before anything is computed: gas taken above the gas made available, force majeure and maintenance above the DCQ, reductions above the ACQ, years or months out of sequence.
4. A result returned with a reason is no refusal. A deficiency with no make-up right, a price held at its floor and an excused quantity are results.

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed (synthetic). Delete the royalty block and read the refusal; restore it and set discountRate to -1; restore that and set the recovery order to lifo. Then change the year of 2031 to 2032 and read what the engine says about contract years. For each refusal, name the rule above it follows.
