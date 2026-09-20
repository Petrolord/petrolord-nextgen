# What a layer of protection analysis answers

{{panel:lp-worksheet}}

A layer of protection analysis takes one hazardous scenario and asks one arithmetic question. How often is this consequence expected once every protective layer already in place has been given its credit, and how far is that frequency from the frequency the organisation is prepared to tolerate? The distance between those two numbers is the risk reduction still missing. A safety instrumented function is one way of supplying it. Every lesson in this tier builds one step of that single chain.

## The determination half, and the half this tier leaves alone

The engine has two halves and one vocabulary. The determination half is the layer of protection analysis: a scenario frequency, the risk reduction still missing against a tolerable frequency, and the SIL band that missing reduction falls in. The verification half computes the PFDavg a safety instrumented function achieves, by the IEC 61508-6 Annex B low demand equations.

Associate works entirely in the first half. Where a proposed SIF appears in these lessons it arrives as a PFDavg someone has already stated, and the lesson uses that figure as a given number. How a SIF reaches its PFDavg from failure rates and a proof test interval is the next tier's work.

## One call carries the whole row

| the call | what it needs | what it returns |
| --- | --- | --- |
| `lopaScenario` | `initiatingEventFrequencyPerYr`, `enablingConditions`, `conditionalModifiers`, `ipls`, `tmelPerYr`, `sifPfdAvg` | the unmitigated and mitigated frequencies, the credited and uncredited IPLs, the required RRF, the outcome state and the required PFDavg |

Every call returns either a result object carrying a `basis` block or an object with `error` and `field`, where `field` names the offending input. There is no third answer, and there is no silent default.

The worked scenario this tier follows is the ORONI separator overfill row. Its level control valve fails open at 0.45 per year. By the time the row is finished the engine reports a required risk reduction factor of 13.500000 and a required SIF PFDavg of 0.074074074074, and the outcome state SIL1.

## The engine invents no number

This is a declared choice and it is worth naming on the first page. The initiating event frequency, every enabling condition and conditional modifier probability, every IPL PFD, every failure rate and the tolerable frequency are inputs. The engine carries no failure rate data of its own, and the rates used for teaching here are illustrative teaching inputs. No licensed table is reproduced. The alternative would have been a built in library of generic frequencies, which would let a worksheet run with nothing typed and no analyst accountable for the figures. The engine does not take that route: a number on the row is a number somebody wrote down and can defend.

Two constants it does own are worth carrying with you. `HOURS_PER_YEAR` is 8760, and `DECADE_SNAP` is 1e-9, which module five explains.

## Exercise

ORONI's required risk reduction factor is 13.500000 and its required SIF PFDavg is 0.074074074074. Multiply those two figures together and say what the product tells you about how the second was obtained from the first. Then write, in one sentence, what would have to change on the row for the required PFDavg to become a smaller number, given that the engine chooses none of its inputs.
