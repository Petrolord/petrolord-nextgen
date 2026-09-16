# Roughness is not the fluid

Roughness is a property of the pipe wall. It enters the friction factor through the relative roughness, which is the absolute roughness divided by the bore.

{{panel:fc-liquid-explorer}}

## Four walls, one duty

| catalogue id | roughness in | relative roughness | f | friction loss psi |
| --- | --- | --- | --- | --- |
| commercialSteel | 0.001800 | 0.0002255356 | 0.0218149625 | 25.660631 |
| steelUsed | 0.006000 | 0.0007517855 | 0.0234342460 | 27.565372 |
| internallyCoated | 0.000200 | 0.0000250595 | 0.0211296555 | 24.854515 |
| hdpe | 0.000060 | 0.0000075179 | 0.0210675199 | 24.781425 |

Same crude, same rate, same bore, same length. The only thing that changed is what the inside of the pipe is made of and how it has aged.

## Absolute and relative

The catalogue stores an absolute roughness, a height in inches. The friction factor wants it as a fraction of the bore, so 0.001800 in in a 7.981000 in bore becomes a relative roughness of 0.0002255356.

That division is why the same steel is hydraulically rougher in a small pipe than in a large one. The bumps are the same height and the pipe they are sitting in is narrower, so they take up more of it.

## Why the pressure barely moves here

The four rows span a wide range of wall condition, from new plastic at 0.000060 in to used steel at 0.006000 in, and they land between 24.781425 psi and 27.565372 psi. On this line, at this Reynolds number, the wall is a modest influence on the answer.

That is a fact about this row rather than a general one. The friction factor's sensitivity to roughness depends on where the line is sitting, and a reader who takes the small spread here as a licence to guess a roughness has generalised from a single case.

## Which inputs are the fluid

The crude reaches the friction factor through the Reynolds number, carrying the density and the viscosity. The pipe reaches it through the relative roughness, carrying the wall and the bore. Both arrive at the same place, and confusing them means answering a question about a fluid by changing the pipe.

## The catalogue is a list of walls

The four ids are catalogue entries rather than measurements of this pipe. commercialSteel at 0.001800 in is new line pipe, steelUsed at 0.006000 in is steel after service, and internallyCoated and hdpe at 0.000200 in and 0.000060 in are smooth linings.

Choosing among them is a statement about the pipe's condition over its life. A line specified and costed on new steel drifts towards the used row as it ages, and 25.660631 psi becomes 27.565372 psi with nothing having been done to it.

## The mistake

Choosing a roughness to match an observed pressure drop. The catalogue entry describes a wall, and tuning it turns a measured discrepancy into an assertion about pipe condition that nobody inspected.

## Exercise

Give the relative roughness of the OGBIA line and say which two numbers it came from. Then give the friction loss on new coated pipe and on used steel, and name the two fluid properties that reach the friction factor by a different route.
