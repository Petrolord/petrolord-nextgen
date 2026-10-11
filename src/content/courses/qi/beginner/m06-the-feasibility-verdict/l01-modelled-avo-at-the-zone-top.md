# Modelled AVO at the zone top

The last step at the well asks what the seismic should show at the top of the Ekene Sand, with oil and with brine. The model is two half-spaces, the mean cap rock over the mean oil leg, and the same cap rock over the oil leg taken to brine.

{{video:qi-b7}}

## What the engines return

- `zoeppritzRpp` gives the exact plane-wave P-wave reflection coefficient at each angle, in the form of Dvorkin and others (2014).
- `shuey` gives Shuey's (1985) intercept A, gradient B and curvature C.
- `avoClass` names the class from A and B after Rutherford and Williams (1989), with class IV: A above 0.02 is class I; A within 0.02 of zero is class II; otherwise class III when B is at or below zero and class IV when B is above it.
- The near, mid and far means are the mean exact coefficient over each angle range at every whole degree, ends included, the way the kit built its angle stacks.

The Rock Physics course derives exact Zoeppritz, Shuey's terms and the classes in full.

## Exact coefficients by angle

| angle degrees | exact R in situ | exact R brine |
| --- | --- | --- |
| 0 | 0.171249 | 0.206058 |
| 5 | 0.167750 | 0.202983 |
| 10 | 0.157426 | 0.194011 |
| 15 | 0.140846 | 0.179978 |
| 20 | 0.119130 | 0.162628 |
| 25 | 0.094393 | 0.145543 |
| 30 | 0.070998 | 0.137212 |
| 35 | 0.060228 | 0.166006 |

Both curves start positive, because the sand is harder than the shale above it, and both fall with angle at first. The in situ curve falls faster. By 35 degrees the brine curve has turned up again while the in situ curve is still falling.

## Shuey's terms, the class and the stacks

| quantity | in situ (oil) | brine |
| --- | --- | --- |
| A | 0.170742 | 0.205564 |
| B | -0.563558 | -0.475316 |
| C | 0.186597 | 0.216617 |
| class | I | I |
| near mean, 5 to 15 degrees | 0.156172 | 0.192995 |
| mid mean, 15 to 25 degrees | 0.118516 | 0.162661 |
| far mean, 25 to 35 degrees | 0.073416 | 0.144237 |

Shuey's A and the exact coefficient at normal incidence come from different engine calls and are quoted as separate figures. The in situ gradient is the more negative of the two.

## What the model says

The oil dims the top of the Ekene Sand at every angle: the in situ coefficient sits below the brine one throughout, by 0.034809 at normal incidence and by 0.066214 at 30 degrees. The gap widens with angle, so the far stack separates oil from brine by a wider margin than the near stack.

Both rows are class I. Both A values sit well above 0.02, so the class alone does not separate oil from brine at this interface. A class is never graded.

## What the model rests on

Every figure above rests on the cut-off, the cap rock thickness and the conditions that built the two layers. The model is two half-spaces with no wavelet and no thickness: it says what the interface should do at each angle, and the data quality figures say whether the seismic can resolve it.

> Upper halfspace has vs >= vp.

That refusal comes from `zoeppritzRpp` given an upper layer with Vs above Vp.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Modelled AVO" and Data to "Ekene pack: Ekene-1". Check the angle table and the A, B, C and stack rows against this lesson, and find the angle on the chart where the two curves are furthest apart. Change "Cap rock thickness above the top, ft (stated)" from 65 and record how A and the class move. Restore 65, then switch Data to Ekene-3 and say whether its top is also class I with oil and with brine.
