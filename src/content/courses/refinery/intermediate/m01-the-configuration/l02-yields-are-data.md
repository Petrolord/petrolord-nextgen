# Yields are data

A plan is only as good as the numbers it is given, and the numbers that shape a refinery plan most are the yields. This lesson reads ABUA's yields as what they are: data typed into the configuration, which the plan uses exactly as typed.

{{panel:refinery-plan-explorer}}

## Crude yields

Each crude's yields are volume fractions. A yield of 0.2300 of naphtha means that each barrel of that crude run makes that fraction of a barrel of naphtha. ABUA's three crudes:

| crude | naphtha | kero | gasoil | residue | offgas |
| --- | --- | --- | --- | --- | --- |
| Bonny Light (illustrative) | 0.2300 | 0.1500 | 0.3100 | 0.2800 | 0.0300 |
| Forcados (illustrative) | 0.1600 | 0.1300 | 0.3400 | 0.3500 | 0.0200 |
| Brass River (illustrative) | 0.2600 | 0.1600 | 0.2900 | 0.2600 | 0.0300 |

No crude yields reformate or ulsd. Those two streams exist only because a unit makes them. The configuration marks those cells with a dash, which is a yield of nothing.

The grade names are labels. These yields are invented. Where a real crude's yields come from, an assay cut into streams, is taught in the `crude` course, and nothing here claims that any real cargo yields what this table prints.

## Unit yields

A unit's yields are volume fractions of its feed. The digest states the rule plainly: a unit's throughput consumes one barrel of its feed stream for each barrel it runs. So the Naphtha reformer, running one barrel, consumes one barrel of naphtha and makes reformate 0.8500 and offgas 0.1000. The Diesel hydrotreater consumes one barrel of gasoil for each barrel it runs and makes ulsd 0.9700 and offgas 0.0200.

The crude unit is different. It has no feed stream, and its yields are the crude yields. Whatever crude runs through it yields in that crude's own proportions.

## What "data" means here

The plan does not question a yield. It takes each one as typed and finds the best month it can with them. Change a yield and you have a different configuration, with a different plan and a different margin. That is the whole sense in which yields are data: they are inputs the planner owns, and the plan is an answer to them.

It also means the plan carries no quality. A stream is a volume with a name. Two barrels of kero from two different crudes are the same kero to the plan. Whether a blend meets a specification is the `crude` course's question, answered by its blending tools, and it is not asked here.

Read the offgas column. Every crude makes some, and both units make some too. Hold that in mind: Module 4 finds out what the plan thinks a barrel of it is worth.

## Exercise

Read the naphtha yields of the three crudes, 0.2300, 0.1600 and 0.2600, and their costs, 81.3000, 77.6000 and 80.4000 dollars a barrel. Say what the two columns together suggest about why a planner cannot choose a crude on its cost alone. Then read the reformer's yields, reformate 0.8500 and offgas 0.1000, and say which stream the reformer consumes to make them, and at what rate.
