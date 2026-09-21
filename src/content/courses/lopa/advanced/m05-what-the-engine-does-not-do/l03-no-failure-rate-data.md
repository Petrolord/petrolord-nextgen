# No failure rate data, and no licensed tables

The most consequential number in a verification is a failure rate, and this engine has none. Every lambda it uses arrives as an input. There is no built in library, no default for a valve or a transmitter, and no table that fills a blank when the analyst leaves one. The same is true of the layer of protection analysis half: the initiating event frequency, every enabling condition, every conditional modifier, every IPL PFD and the tolerable mitigated event likelihood are all typed by a person. Nothing is invented.

## The limits, in the engine's own terms

| not in the engine | why, from the engine header | what the analyst does instead |
| --- | --- | --- |
| failure-rate data | users supply every lambda; the golden rates are labelled illustrative or cited | takes rates from a justified source and records it |
| the choice of TMEL, IEF or IPL PFD | every one is an input | justifies each against the organisation's criteria |

## What the rates in this course are

The teaching channels you have worked with carry stated rates: the EKULAMA channel at an undetected rate of 1.2e-6 per hour with a detected rate of 2.8e-6 per hour, the OBAGI shutdown valve at 9e-7 per hour, the IDU valves at 2.6e-6 per hour. Every one of those is a teaching input chosen to make a calculation legible. None is a recommendation about any real device. The published example's rates are the paper's own, cited there to SINTEF PDS and to vendor certificates, and they are offered here as that paper's example values.

## Why no licensed table is copied

IEC 61508, IEC 61511 and the ISA technical reports carry normative tables, and so do the occupational and process safety references the wider industry uses. Those tables are licensed material. This course cites them and never reproduces them. A table copied here would also be a table nobody could check against a public source, which is the same reason the architectural constraint check is absent. The consistent rule is that a figure a learner reads either comes from the engine on stated inputs or is cited to where it lives.

## What this asks of the analyst

It asks for a source and a record. A rate taken from a reliability data handbook, a vendor's certificate, a site's own failure history or an expert judgement is defensible in different degrees, and the verification note has to say which it was. It also asks for consistency of coverage: a rate for dangerous undetected failures depends on what the diagnostics are assumed to find, so a rate and a diagnostic coverage travel together. The engine will accept any pair of numbers typed into those two fields and will compute faithfully from them. The judgement of whether the pair describes the device on the plant is the analyst's alone.

No capstone grades a choice of failure rate, a tolerable mitigated event likelihood, an initiating event frequency or an IPL PFD. Every capstone STATES them. What is graded is what the engine does with numbers once they are given.

## Exercise

Take the EKULAMA undetected rate of 1.2e-6 per hour and its detected rate of 2.8e-6 per hour. Work out what fraction of the dangerous failures the diagnostics are being credited with finding. Then write the two lines a verification note would carry for that channel, one naming the source of the pair and one naming the evidence for the diagnostic claim.
