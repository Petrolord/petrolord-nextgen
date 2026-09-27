# What the engine leaves out

{{panel:prms-aggregation-calculator}}

Every figure in this course is a return value of one engine on stated inputs. That makes the engine precise, and it also makes it narrow. It classifies, categorises, cuts at an economic limit, adds up and reconciles. It builds none of the inputs it works on, and this lesson names each one it takes as given, with the course of the academy that owns it.

## Taken as stated

| not computed here | what the engine takes instead | the course that owns it |
| --- | --- | --- |
| a production forecast from rates | three stated technical forecasts, year by year | the decline curve analysis course |
| in-place volumes from pressure and production | stated estimates or distributions | the material balance course |
| volumes from maps and rock properties | stated estimates or distributions | the reservoir volumetrics course |
| the cash flow ledger, discounting and NPV | the canonical computeCashFlow and applyJV, imported | the cash flow course |
| the Nigerian fiscal terms | a stated royalty rate and form and a stated tax rate | the Petroleum Industry Act course |
| distributions, correlation and Monte Carlo as a subject | the canonical seeded sampler of lib/stats | the uncertainty course |
| a price deck | stated prices year by year | none: always a stated input |
| an audit of the facts, or a regulator's decision | stated facts, each printed in the reasons | none: the reserves report names them |
| a Nigerian booking or reporting rule | none | none: no gazetted rule was found |

The engine also holds no facts of a project. Every discovery status, criterion, chance, estimate, forecast, price, cost, rate, basis, distribution, correlation, seed and movement is an input with no default, and a call without one is refused by name. The only figures it holds are five rule figures, each cited to its text, and its size caps.

## What it says it does not decide

The category labels of the economic limit and of aggregation are outcome labels only: the engine does not say a stated deterministic scenario has a 90 percent chance. BOE is supplementary. The movement headings of a reconciliation are its stated convention.

## The caps

Each function has a size cap, and a call over it is refused, verbatim:

> forecasts.low must have at most 100 entries; got 101

> projects must have at most 50 entries; got 51

> iterations must be an integer from 100 to 200000; got 200001

> movements must have at most 50 entries; got 51

The Monte Carlo has one more cap: draws times projects may not exceed 500000, because the correlated draw grows with the square of the project count. A panel stays well inside every cap.

## Unknown keys

The engine reads no key it does not know. A misspelt optional key is refused, and nothing is dropped silently: the message gives the path to the key and the full list of accepted keys, verbatim:

> correlation.matrix is not an accepted key; the accepted keys of correlation are type, rho, pairs

A box that carries an unknown key and lacks a required input is refused on the unknown key first.

## Why this matters for a report

A figure from this engine is as good as its inputs. A reserves report that quotes one names the inputs and where each came from: which course or which estimator made the forecast, the distributions, the price deck. The engine's reasons print each input it used, so the report can.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". For each input in the box, name the course or the person that would supply it in a real study. Set the Draws (stated) control to 200001 and read the refusal. Then rename the key correlation to correlations in the box and read that refusal.
