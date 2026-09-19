# What the oracles check

A figure from an engine is a claim. This course's figures are checked by two independent oracles, one for each engine module, and this lesson reads what those oracles check, how, and what they leave unchecked. Knowing the edge of the checking is part of knowing the figures.

## Two oracles, two golden files

Each golden file is written by an independent standard-library Python oracle, and the engine's figures are compared against it.

| golden file | oracle | method | published source |
| --- | --- | --- | --- |
| terminaldepot_cases.json | tools/validation/downstream/oracle_terminaldepot.py | strapping from tank geometry; Erlang C by the exact factorial form and Little's law; a day ledger | none: no coefficient table is shipped; tanks are geometric or the Suite sample |
| fuelpricing_cases.json | tools/validation/downstream/oracle_fuelpricing.py | a cargo invoice over outturn litres; insurance on CIF by fixed-point iteration; closed-form FX breakeven; integer fleet search; exact Erlang C | none: every rate is synthetic; the engine ships none and neither does this file |

The terminal file carries 4 dips, 4 refusals, 4 queues, 3 reconciled days and 1 tank farm. The pricing file carries 3 landed cost cases (floor, full and insurance on CIF), 1 truck lane, 1 fleet, 1 pump build-up with its breakeven exchange rate, and 1 station.

## Two methods agreeing

The value of an oracle is that it reaches the same figure by a different road. A golden figure beside an engine figure is two methods agreeing.

In this tier there are two clear pairs. For insurance quoted on CIF, the engine uses a closed form and the oracle iterates the fixed point: guess a CIF, charge the premium on it, repeat. For the exchange rate breakeven, the pairing runs the other way: the engine bisects and the oracle solves in closed form. In each pair, a mistake in one method would have to be reproduced by a quite different method to go unnoticed.

The terminal oracle works the same way. It builds a strapping table from tank geometry where the engine interpolates, computes Erlang C by the exact factorial form in rational arithmetic where the engine recurses, and searches for the fleet one truck at a time where the engine takes a ceiling.

## What the oracles do not check

The oracles check figures and verdicts. They never check the wording of a refusal. So every refusal sentence this course quotes is the engine's own, quoted and never checked, and that is why the course quotes each one verbatim and never rewords one inside quotation marks.

The published source column reads none on both rows. No rate is checked against a published figure, because every rate is synthetic. The volume correction form is pinned by the engine's tests and not validated against a published table, because no table is shipped. Those tests assert the form itself and two invariants that need no coefficient: a VCF of exactly 1 at 15 C, and below 1 above it. On the course's synthetic row, the VCF at 15 C is 1.000000, exactly one.

So the checking has an honest shape. Arithmetic, algebra and queueing are checked by independent methods. Rates and coefficients, which are data, are not checked at all, and the course says so every time it uses one.

## Exercise

Record how many dips, refusals, queues, reconciled days and tank farms the terminal golden file carries, and how many landed cost cases the pricing file carries. Name the method the engine uses and the method the oracle uses for insurance on CIF and for the exchange rate breakeven. Then say what the published source column, read against those methods, shows about which parts of this course's figures are validated and which are only consistent.
