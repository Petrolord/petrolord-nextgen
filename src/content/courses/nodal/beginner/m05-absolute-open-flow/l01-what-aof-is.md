# What AOF is

The forward reading at 0 psia. Not a separate calculation, not a separate model.

{{panel:pd-ipr-explorer}}

## The two columns are the same column

| Case | Rate at 0 psia | Open flow |
| --- | --- | --- |
| straight line, 1.8 stb/d/psi at 3200 psia | 5760.000000 | 5760.000000 stb/d |
| Vogel, 2400 psia | 1500.000000 | 1500.000000 stb/d |
| composite, 1.2 stb/d/psi at 3000 psia | 2533.333333 | 2533.333333 stb/d |
| Fetkovich, C 0.000085 n 0.87 at 3500 psia | 124.766308 | 124.766308 stb/d |
| Jones, a 0.9 b 0.0015 at 2800 psia | 1098.809017 | 1098.809017 stb/d |
| Rawlins and Schellhardt, 4000 psia | 13289.296319 | 13289.296319 Mscf/d |
| Houpeurt, 4000 psia | 5596.679697 | 5596.679697 Mscf/d |
| turbulent Rawlins and Schellhardt, 3200 psia | 88.806747 | 88.806747 Mscf/d |

Oil in stb/d, gas in Mscf/d. MMscf/d appears only where a gas column is computed, and confusing the two is the commonest unit error here.

## What it is made of

On a straight line it is the index times the reservoir pressure. On a Vogel curve it IS the parameter, so calibrating Vogel from a test amounts to solving for it.

On a composite it is two blocks summed. BONNY-7, 2.00000000 stb/d/psi at 2740 psia with a bubble point of 1300 psia: undersaturated block 2880.000000 stb/d, saturated Vogel block 1444.444444 stb/d, open flow 4324.444444 stb/d, saturated share 0.33401850. FORCADOS-3 splits 1996.364220 and 2139.585450 into 4135.949669 stb/d and a saturated share of 0.51731419.

## From a test alone

| Case | Test | Open flow, stb/d |
| --- | --- | --- |
| straight line, 3200 psia | 900 stb/d at 2700 psia | 5760.000000 |
| Vogel, 2400 psia | 700 stb/d at 1500 psia | 1244.444444 |
| composite, test above the bubble point | 600 stb/d at 2500 psia | 2533.333333 |
| composite, test below the bubble point | 1500 stb/d at 1400 psia | 2083.333333 |
| Fetkovich, 3500 psia | 1100 stb/d at 2900 psia | 3017.886603 |

That Fetkovich calibration backs out a C of 0.0020560066733860726, against 124.766308 stb/d for the same family at the same reservoir pressure with a C of 0.000085. Only the coefficient moved.

## It is also the top of the search

An inverse reading is bracketed between 0 psia and the reservoir pressure, and what guarantees a root inside is that the relation reads zero at one end and the open flow at the other. Any rate at or above it falls outside the bracket and gets a boundary reply of zero pressure.

## What it refuses

It refuses to travel without its reservoir pressure: the published straight line reads 5760.000000 stb/d at 3200 psia and 3600.000000 at 2000 psia. It refuses to identify the family: BONNY-7's one test gives 5480.000000, 3233.247201 and 4324.444444 stb/d. And it sits where the curve is steepest, at -1.57442483 psi per stb/d on BONNY-7 at 4195 stb/d against -0.50000000 through the straight section, so it is the most sensitive number the relation produces.

## Exercise

Record BONNY-7's open flow, rate at the bubble point and saturated share, then the same three for FORCADOS-3, and say what the two saturated shares tell you about how differently the curves are built.
