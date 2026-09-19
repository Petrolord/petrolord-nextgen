# Saturates against aromatics and resins

Two crudes that are each stable in their own tanks can drop asphaltenes when they are mixed. The sludge settles in tanks, fouls heat exchangers and plugs lines. The studio screens for it before commingling, and the screen starts from the SARA analysis.

{{panel:crude-assay-explorer}}

## What SARA measures

A SARA analysis splits a crude into four families by weight percent: saturates, aromatics, resins and asphaltenes. Asphaltenes are the heaviest, most polar molecules in a crude. They stay dispersed only while enough aromatics and resins surround them. Saturates do the opposite: a paraffinic, saturate-rich oil is a poor solvent for asphaltenes and pushes them out of solution.

So the question of stability is a balance, and it is a balance of weight fractions measured on the crude as it arrives. On one side, saturates precipitate asphaltenes. On the other, aromatics and resins hold them.

## The colloidal instability index

The engine turns that balance into one number, the colloidal instability index:

CII = (saturates + asphaltenes) / (aromatics + resins)

The top of the fraction is what destabilises: the saturates that push asphaltenes out, and the asphaltenes themselves. The bottom is what stabilises. A high CII means the destabilising load is large against what holds it. A low CII means the reverse.

## Each crude alone

The library's four SARA analyses, and the index colloidalInstabilityIndex gives each crude on its own:

| crude | saturates | aromatics | resins | asphaltenes |
| --- | --- | --- | --- | --- |
| Obigbo Light | 52 | 33.5 | 12.8 | 1.7 |
| Egbema Medium | 34.1 | 42.6 | 19.8 | 3.5 |
| Asarama Heavy | 31.5 | 37.2 | 19.4 | 11.9 |
| Ubie Condensate | 89.1 | 9.2 | 1.5 | 0.2 |

| crude alone | CII (colloidalInstabilityIndex) |
| --- | --- |
| Obigbo Light | 1.1598 |
| Egbema Medium | 0.6026 |
| Asarama Heavy | 0.7668 |
| Ubie Condensate | 8.3458 |

Read Ubie Condensate. It carries 89.1 wt% saturates and 0.2 wt% asphaltenes, and its CII is 8.3458. A condensate has almost no asphaltenes of its own to lose. Its danger is as a blend component: all those saturates, poured into a crude that carries asphaltenes, are exactly what pushes them out.

Read Asarama Heavy. It carries 11.9 wt% asphaltenes and 31.5 wt% saturates, against 37.2 wt% aromatics and 19.4 wt% resins. Its CII is 0.7668.

Read Egbema Medium. It is rich in aromatics and resins, at 42.6 and 19.8 wt%, and its CII is 0.6026.

## Why a crude's own index is only half the story

The index of each crude alone describes that crude's composition. It does not describe a mixture, and a terminal that stores crudes separately and blends them on loading needs the mixture's answer. The question a blender needs answered is what happens to the balance when two compositions mix, and that is the blend's CII, which the next two lessons build.

## A screening index

The CII is a screen. It compresses a complicated colloidal system into one ratio of four weight fractions, and it is useful because SARA is routine to measure and the ratio is quick to compute. It is not a thermodynamic model of asphaltene precipitation, and the engine never presents it as one. The next lesson sets out the bands the engine reads it against.

## Exercise

Read the SARA rows and the CII of Ubie Condensate and Egbema Medium. Quote each crude's saturates, aromatics, resins, asphaltenes and CII. Say what the four fractions show about why the two indices sit where they do, using the formula CII = (saturates + asphaltenes) / (aromatics + resins).
