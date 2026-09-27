# The firm intention to proceed

{{panel:prms-reserves-calculator}}

Seven criteria describe a project that could be developed. The last test asks whether the company will develop it. PRMS 2.1.2.1 with 2.1.2.3 treats the entity's firm intention to proceed as part of commerciality, and the engine carries it as an eighth stated fact, `firmIntention`, beside the seven. A project that meets everything else and lacks the commitment is Contingent Resources.

## The criterion line

The engine prints the commitment with its section, like any criterion. On the golden input class-no-firm-intention, every criterion is met and the commitment is not. The line, verbatim:

> commitment: the entity's firm intention to proceed with development: not met (PRMS 2.1.2.1, 2.1.2.3)

The class is Contingent Resources with one blocker, firmIntention. Nothing about the reservoir, the plan or the economics has changed; the company has not committed, and without a commitment the quantities are not Reserves.

## Why a commitment belongs in the test

Reserves are the quantities a company expects to produce and sell. A project that is sound on paper and that nobody intends to build will not produce them. The commitment usually shows in the record: an approved plan, a budget, a board minute, contracts let. The engine reads none of these. It reads the stated fact, and the reasons print it where a reviewer can ask for the evidence.

## The commitment across the Ekene projects

Every Ekene Contingent project names firmIntention among its blockers:

| id | project (fixture) | blockers (engine) |
| --- | --- | --- |
| EKN-3 | Ekene East gas (synthetic) | financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention |
| EKN-4 | Ekene North appraisal (synthetic) | developmentPlan, financialAppropriations, approvals, firmIntention |
| EKN-5 | Ekene West tight sand (synthetic) | technology under development, developmentPlan, financialAppropriations, economicStatus, firmIntention |

That is no coincidence. A company rarely commits to a project whose money or plan is missing, so the commitment is often the last criterion to be met.

## A declaration and the commitment

The Petroleum Industry Act 2021 defines a commercial discovery by the licensee's own judgement after weighing the relevant economic factors:

> "“commercial discovery” means a discovery of crude oil, natural gas or condensates within a petroleum prospecting licence or petroleum mining lease which can be economically developed in the opinion of the licensee or lessee after consideration of all relevant economic factors" (PIA s.318, "commercial discovery")

The engine keeps the Nigerian declaration as a note, and it refuses a note that contradicts a commercial project. A project that meets every criterion and states a significant discovery is refused, verbatim:

> nigeria.declaration must be "commercial-discovery" for a project that meets every commerciality criterion: a significant discovery cannot be declared commercial (PIA 2021 s.318) and a discovery of no interest is not being developed (s.78(8)(c)); got "significant-gas-discovery"

The declaration is the licensee's statement to the Commission; the commitment is a fact the classification reads. The engine keeps them consistent and lets neither change the class.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "No firm intention to proceed". Read the class, the blocker and the commitment line.
2. Set "the firm intention to proceed (stated)" to true. Read what the engine asks for next, and name the facts a Reserves project states that a Contingent one leaves out.
3. Start from "A commercial discovery two years on" and read the Nigerian note. Set "Nigerian declaration (optional)" to a significant gas discovery and read the refusal.
4. Write two sentences on why the commitment is usually the last criterion an Ekene Contingent project would meet.
