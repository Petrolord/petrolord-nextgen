# Loadings and what a component means

{{panel:ef-cluster-explorer}}

A component is a direction through the logs, written as one weight per log. The weights of a component are a unit vector: their squares add to 1. A weight says how much of each standardised log goes into the direction, and its sign says whether the log pulls the same way as the others or against them. A loading rescales the weight so it can be read on its own.

| log | PC1 weight | PC2 weight | PC1 loading | PC2 loading |
| --- | --- | --- | --- | --- |
| GR | 0.423323 | 0.655151 | 0.699368 | 0.687603 |
| RHOB | -0.489083 | 0.532756 | -0.808009 | 0.559145 |
| NPHI | 0.541336 | 0.361377 | 0.894337 | 0.379277 |
| PEF | -0.537169 | 0.395416 | -0.887452 | 0.415002 |

## From weight to loading

A loading is the weight times the square root of the component's eigenvalue. In the correlation form it is the correlation between the log and the component score, so it reads on the familiar scale from minus one to one. The basis reads:

> component x sqrt(eigenvalue); in the correlation form, the correlation of the feature with the score

PC1's eigenvalue is 2.729404, so each PC1 weight is multiplied by its square root: NPHI's weight of 0.541336 becomes a loading of 0.894337. A weight and a loading are different numbers for the same log and component. When you quote one, name which it is.

## Reading PC1

GR and NPHI load positive on PC1, at 0.699368 and 0.894337. RHOB and PEF load negative, at -0.808009 and -0.887452. A row high on PC1 reads a high gamma ray and a high neutron porosity with a low density and a low photoelectric factor. A row low on PC1 reads the reverse. PC1 is the direction along which those four readings move together, and it carries 0.682351 of the variance.

## Reading PC2

All four logs load positive on PC2: 0.687603, 0.559145, 0.379277 and 0.415002. A row high on PC2 reads higher on every log at once. PC2 carries 0.275380 of the variance, the largest share of what PC1 left over.

## A direction is no rock type

It is tempting to say that high PC1 is shale and low PC1 is limestone. The component was found from the logs alone, with no core in the calculation. A component is a direction in the logs; the rock types it separates are read by matching against core, which is the Professional tier's work, and never assumed from the signs.

## The sign is a convention

Multiply a component by minus one and it describes the same direction. Every weight, loading and score flips sign together, and nothing about the rows has changed. The engine fixes the sign by a stated rule, so that the same data always give the same signs: in each component, the largest absolute weight is made positive. On PC1 the largest absolute weight is NPHI's, 0.541336, and it is positive. Another tool may return the same component with every sign flipped. Before you compare loadings between tools, check the sign convention of each.

## Exercise

Open the cluster explorer on the view "Principal components". Keep the cored rows and the four logs, and read the PC1 and PC2 loadings. For PC1, write down which logs load positive and which negative, and describe in one sentence the kind of row that scores high. Then remove GR from the logs and read the loadings again. Write down which log now has the largest absolute loading on PC1 and whether its sign is positive, as the engine's rule says it must be for the largest weight.
