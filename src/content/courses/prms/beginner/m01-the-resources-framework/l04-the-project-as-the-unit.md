# The project as the unit of classification

{{panel:prms-classification-calculator}}

A field is not classified; a project is. The framework attaches a class to the quantities one defined project would recover, and a field with several projects carries several classes at once. This lesson shows why, using the Ekene Main accumulation, which appears in three different Ekene projects.

## One call, one project

Every call of the engine's `classify` function classifies one project. It takes one set of stated facts and returns one class and one sub-class. The Ekene field has eight projects, so it carries eight classifications, and nothing in the engine adds them into a single field class.

| id | project | class (engine) | sub-class (engine) |
| --- | --- | --- | --- |
| EKN-1 | Ekene Main waterflood | Reserves | on-production |
| EKN-2 | Ekene infill wells | Reserves | approved-for-development |
| EKN-8 | Ekene Main residual oil | Discovered Unrecoverable | none |

The waterflood already produces, the infill wells have their investment decision, and the oil that neither can reach has no recovery project at all. Three projects, three sets of facts, three results. The same accumulation can hold Reserves in one project and Contingent Resources in another, and the engine lets it, because it reads each project's own facts.

## The order of the decisions

The engine reads the facts of a project in a fixed order and prints each step in its reasons with the PRMS section it applies.

1. **Discovery.** A known accumulation is discovered; a potential one is undiscovered (PRMS 2.1.1.1).
2. **A recovery project.** Established technology, technology under development, or none. With none, the quantities are Discovered Unrecoverable or Undiscovered Unrecoverable, and the engine reads nothing further (PRMS 2.1.0.1, 2.1.1.2).
3. **Undiscovered with a project.** Prospective Resources, with a stated sub-class and stated chances (PRMS 2.1.0.1, Table 1).
4. **Discovered with a project.** The commerciality test: every criterion met with established technology gives Reserves, and anything else gives Contingent Resources with each blocker named (PRMS 2.1.2.1, Table 1).

The order matters. A project with no recovery project never reaches the commerciality test, and an undiscovered one never faces it either.

## Why the project and not the field

A project has a plan, a budget, a decision and a date. Those are the facts the class depends on. A field holds oil that one project will produce this year, oil a second project may produce if it is approved, and oil no project can reach. A single field class would hide all three. By classifying projects, the report shows which quantities are committed and which still wait on something. The Expert tier takes up how project figures are added together, and why the classes are never mixed in one total.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality". Start from "EKN-1 Ekene Main waterflood" and read the reasons from the top: write down each step of the decision list above as the engine prints it, with its section. Then start from "EKN-8 Ekene Main residual oil" and read its reasons the same way. Mark the step at which the second project stops, and say which of its stated facts stops it.
