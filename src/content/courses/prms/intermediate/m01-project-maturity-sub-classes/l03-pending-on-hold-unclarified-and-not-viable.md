# Pending, on hold, unclarified and not viable

{{panel:prms-reserves-calculator}}

A discovered project that fails any commerciality criterion is Contingent Resources, and PRMS 2.1.3.5.6 with Table 1 gives it four project maturity sub-classes. Unlike the Reserves sub-classes, these are stated. The engine cannot see why a development is waiting (a partner who has not agreed, a gas market still to be found, a technology still being tried), so it takes the sub-class you state and checks only that it is one of the four.

## The four sub-classes in the course's words

Development pending: the project is being worked actively toward a decision, and the open questions are expected to be settled in a reasonable time.

Development on hold: the project is judged to have a chance of going ahead, and something outside the project's control has stopped the work for now.

Development unclarified: the project is at an early stage, or what it needs has not been worked out well enough to say whether it will go ahead.

Development not viable: nobody plans to develop it on present facts, though a change in conditions could reopen it.

## The Ekene Contingent projects

Three of the eight Ekene projects are Contingent Resources. Each states its sub-class and its economic status, and the engine names the criteria that hold each back:

| id | project (fixture) | sub-class (stated, checked) | economic status (stated) | blockers (engine) | Pc = Pd, percent (engine) |
| --- | --- | --- | --- | --- | --- |
| EKN-3 | Ekene East gas (synthetic) | development-on-hold | undetermined | financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention | 50.000000 |
| EKN-4 | Ekene North appraisal (synthetic) | development-pending | viable | developmentPlan, financialAppropriations, approvals, firmIntention | 65.000000 |
| EKN-5 | Ekene West tight sand (synthetic) | development-unclarified | not-viable | technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention | 20.000000 |

Read the blockers beside the sub-class. EKN-4 has positive economics and lacks a plan, money, approvals and the commitment: a project someone is working on. EKN-3 lacks a market and facilities for its gas: a project waiting on the outside world. EKN-5 rests on technology under development: too early to call.

## The chance of development alone

A discovered project has already met its geology, so its chance of commerciality is the chance of development alone (PRMS 2.1.3.3). The engine's decision line on EKN-4, verbatim:

> Pc = Pd = 65%

Two refusals keep the chances in their place. A chance of geologic discovery belongs to an undiscovered accumulation, and a Contingent project must state its chance of development:

> chances.geologicDiscoveryPct must be left out for a discovered accumulation (the chance of geologic discovery applies to Prospective Resources, PRMS 2.1.3.2); got 50

> chances must be an object { developmentPct } for Contingent Resources (PRMS 2.1.3.3: Pc = Pd); got nothing

## What the check can and cannot do

Because the sub-class is stated, the engine accepts any of the four on any Contingent project. A report that calls EKN-4 not viable would pass the check. The reasons print the stated sub-class beside the blockers, so a reader can see whether the two tell the same story; that judgement stays with the person who signs the report.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "EKN-3 development on hold". Read the blockers and the chance of commerciality.
2. Set "Sub-class (stated)" to development-not-viable. Read the class and the sub-class decision, and note that the engine accepts it.
3. Set "Chance of geologic discovery, percent (stated)" to 50 and read the refusal. Then set that control to not stated.
4. Start from "EKN-5 development unclarified" and "EKN-4 development pending" in turn. For each, write one sentence on whether the stated sub-class fits the blockers the engine names.
