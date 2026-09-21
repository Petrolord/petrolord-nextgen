# Where the index has no answer

The Refutas index takes a double logarithm, and a logarithm has a domain. ln(ln(nu + 0.8)) is undefined where ln(nu + 0.8) is zero or less. The engine returns no index there, and it does not invent a number to fill the gap.

{{panel:crude-assay-explorer}}

## The edge of the domain

The inner logarithm ln(nu + 0.8) is zero when nu + 0.8 is 1. The engine reports where that edge sits by asking its own inverse about a very negative index.

| constant | how the engine gives it | value |
| --- | --- | --- |
| the offset inside the double log | 1 minus viscosityFromBlendIndex of a very negative index | 0.8000 |
| the lowest viscosity the index reaches | viscosityFromBlendIndex of a very negative index | 0.2000 |

So the lowest viscosity the index reaches is 0.2000 cSt, and the offset that sets it is 0.8000.

## Probing the edge

| viscosity cSt | viscosityBlendIndex returns |
| --- | --- |
| 0.1 | no index (outside the domain) |
| 0.2 | no index (outside the domain) |
| 0.2001 | -122.8888 |
| 1 | 3.2518 |

At 0.1 and at 0.2 the engine returns no index. Just inside the edge, at 0.2001, it returns -122.8888. At 1 cSt it returns 3.2518. Every crude in this library sits inside the domain. The thinnest of them is Ubie Condensate at 1.1 cSt, and its index is 4.5307. A stream typed at or below 0.2000 cSt has no index at all, and the probe at 0.2 shows that the edge itself is outside the domain.

## What a blend does with a viscosity outside the domain

This course runs the case. The Obigbo export blend is formed with Egbema Medium's viscosity typed as 0.15 cSt, which is outside the domain. The blend's viscosity is not blended, and the engine names its basis "not blended: a component viscosity is missing or outside the index domain". This is the same sentence it gives when a viscosity is blank. The engine returns no index for that crude, so there is no index for it to blend.

Only the viscosity is left out. The other properties of that blend are formed as usual: API 32.8173 and sulfur 0.2642 wt%, the same figures the export blend carries with both viscosities in range. This is the blank rule of module two applied to viscosity. A missing value is absent, and a value outside the domain is absent too. In neither case does the engine put a zero, a floor or a clamp in the gap.

## Reading the result

In the assay explorer, blank a viscosity on one crude of a blend. The viscosity row reads not blended and carries the basis sentence above. The other properties of the blend still blend, as module two showed for a blank sulfur: each property has its own rule and its own check.

## Exercise

Read the four probe rows. Quote what the engine returns at 0.2, at 0.2001 and at 1. Say what these figures show about where the Refutas index stops giving an answer, and connect that to the lowest viscosity the index reaches, 0.2000. Then quote the API and sulfur this lesson prints for the blend with a viscosity of 0.15 cSt, and say what they show about which property the engine leaves unblended.
