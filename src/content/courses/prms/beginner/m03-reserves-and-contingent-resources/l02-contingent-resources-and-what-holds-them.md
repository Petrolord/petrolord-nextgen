# Contingent Resources and what holds them back

{{panel:prms-classification-calculator}}

A discovered accumulation with a recovery project that falls short of the commerciality checklist is Contingent Resources. The quantities are found and a way to recover them exists, but something still stands in the way: a plan, money, a market, an approval or a decision. The engine names every criterion that is not met, so a Contingent class always comes with its list of blockers.

## The three Ekene Contingent projects

| id | project | economic status (stated) | blockers (engine) | Pc = Pd, percent (engine) |
| --- | --- | --- | --- | --- |
| EKN-3 | Ekene East gas | undetermined | financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention | 50.000000 |
| EKN-4 | Ekene North appraisal | viable | developmentPlan, financialAppropriations, approvals, firmIntention | 65.000000 |
| EKN-5 | Ekene West tight sand | not-viable | technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention | 20.000000 |

## Reading the blockers

**Ekene East gas** has a plan and its approvals, but no gas market, no facilities to carry the gas, no money committed, a start date six years out and economics not yet shown. Six blockers. It is the kind of gas find a Nigerian licensee may declare a significant gas discovery, which the last module of this tier takes up.

**Ekene North appraisal** has viable economics, a market and facilities within reach, but the appraisal has not yet produced a mature plan, and the money, the approvals and the commitment wait on it. Four blockers.

**Ekene West tight sand** needs a recovery technology still under development, and its economics are stated not viable. The engine's class decision reads:

> Contingent Resources: not commercial (technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention)

## The chance of development

A discovered project carries one chance, the chance of development, and it is the chance of commerciality: Pc = Pd (PRMS 2.1.3.3). It is a stated input, and for Contingent Resources it is required. Clearing the chance of development in the panel is refused by name:

> chances.developmentPct must be a number from 0 to 100; got nothing

Leaving out the whole chances object is refused too:

> chances must be an object { developmentPct } for Contingent Resources (PRMS 2.1.3.3: Pc = Pd); got nothing

Notice that the chances do not follow the count of blockers. EKN-5 has five blockers and a chance of 20.000000 percent; EKN-3 has six and a chance of 50.000000 percent. Each chance is a judgement the project team states, and the engine only reports it beside the class.

## Sub-classes are stated too

Each Contingent project carries a stated sub-class that says where development stands: EKN-4 development-pending, EKN-3 development-on-hold, EKN-5 development-unclarified (PRMS 2.1.3.5.6, Table 1). The engine checks the sub-class is one of the four Contingent ones and cannot see why a project is pending or on hold. The Professional tier reads the sub-classes in full.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-3 Ekene East gas". Read the line that begins "held back by" and match each name to a row of the criteria table. Set the control "Chance of development, percent (stated)" to "not stated" and read the refusal; restore 50. Then do the same reading for "EKN-4 Ekene North appraisal" and "EKN-5 Ekene West tight sand", and write down, for each project, the one blocker you would expect to be hardest to clear, with your reason.
