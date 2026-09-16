# Marched against one shot

The traverse spends 25.660631 psi over 26400.000000 ft. A single call over the same length spends 25.660631 psi. The difference is 0.000000 psi.

{{panel:fc-liquid-explorer}}

## The comparison

| call | length ft | spend psi |
| --- | --- | --- |
| traverse, three segments | 26400.000000 | 25.660631 |
| a single call | 26400.000000 | 25.660631 |

A liquid is incompressible, so marching it buys the station list and nothing else. The density does not change along the pipe, the velocity does not change, the Reynolds number does not change and the friction factor does not change, so three segments of 8800.000000 ft spend exactly what one length of 26400.000000 ft spends. Splitting the pipe changes nothing the arithmetic depends on.

## Which makes the reason for marching clearer rather than weaker

It is tempting to read that zero as evidence the traverse is redundant. It is the opposite. Because the two totals agree exactly, the station list is the entire value of the call, and there is no accuracy argument mixed into the decision. A reader choosing between the two calls is choosing between a number and a profile, and never between a rougher answer and a better one.

The previous lesson showed what the profile is worth: two cases with identical totals and a crest 158.958333 psi apart. Neither of those cases is better represented by its total than the other, and only one of them is safe.

## The same result read as a check

An exact agreement between two differently assembled paths is also a test, and it is one the digest performs rather than asserts. The traverse builds its answer from three segment calculations and the single call builds it from one, and both arrive at 25.660631 psi. Had the segment loop mishandled its accumulation, or dropped or double counted a boundary between segments, the two totals would differ. On this case they do not.

## What would have to be true for the totals to differ

They would differ if something in the segment calculation depended on where the segment sat. A changing density would do it, which is what makes a compressible fluid a different problem. A changing bore would do it, and so would a changing duty, as at an offtake. Each of those makes a segment's answer depend on which segment it is. None of them is present here, so the agreement is exact rather than close, and the digest prints the difference as 0.000000 psi rather than as a small number.

An exact zero is worth more than a small residual. A small residual would need explaining, and the explanation would be either a segmentation effect or an arithmetic one, with no way to tell them apart from the total alone.

## The mistake

The mistake is marching a line in the belief that more segments give a more accurate total. On an incompressible liquid they give the same total, and the time is better spent on the profile.

The second mistake is the reverse, assuming that because the totals agree the two calls are interchangeable. They return different things, and the next lesson shows the traverse leaving something out.

## Exercise

Give the traverse spend, the single-call spend and the difference between them. Explain why splitting an incompressible line into segments cannot change the total. Then name three things that, if present, would make the marched total differ from the single call.
