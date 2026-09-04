# No tip effects

Neither model contains a single line about what happens at the fracture tip, and the field knows it.

## What is missing

There is no rock strength anywhere in this calculation. Both models compute width from elasticity and viscous flow, then net pressure from that width through a compliance. Toughness never appears, so the engine has no input for it and will not accept one. Three pieces of tip physics are absent.

Toughness. Advancing a crack costs energy at the tip. Linear elastic fracture mechanics measures that cost as a stress intensity the fluid must supply, and it acts as a floor on net pressure that these models simply do not have.

Dilatancy. The rock near the tip is damaged rather than cleanly parted. It shears, it opens on existing planes and it takes fluid without conducting it, all of which stiffens the response.

The unwetted tip. Fluid does not reach the crack front. A lag region ahead of the fluid front sits at very low pressure, so the loading is not the uniform pressure the closed forms assume.

## The consequence you will meet

Field net pressures routinely exceed what these models predict, often by a large factor. That is not an arithmetic error and not a bad rock property. It is missing physics showing up where the physics was left out. Compare the two published net pressures against the same closure of 38131950.890444934 Pa.

| Model | Net pressure, Pa | Bottomhole treating pressure, Pa |
| --- | --- | --- |
| PKN | 2889735.9944400033 | 41021686.88488494 |
| KGD | 602343.9608409083 | 38734294.851285845 |

A measured treating pressure well above either figure is the normal outcome, not a contradiction.

## The clearest symptom

Look at what KGD does as the fracture gets longer. Its net pressure falls from 1166434.0645127255 Pa at a half-length of 40 m to 425921.49931737053 Pa at 300 m, and the trend keeps going down.

Taken literally that says a long enough fracture propagates on vanishing net pressure. No rock behaves that way, because a real tip demands a finite pressure to keep moving. The falling curve is the model telling you, plainly, that the only thing setting its pressure is compliance.

In practice this is handled by calibration rather than theory. A minifrac or step rate test is pumped, the observed net pressure is compared with the model, and the design is carried forward with an apparent property or a net pressure multiplier that absorbs the difference. The multiplier is a confession, and an honest one.

## Exercise

Write down the three tip effects above and, for each, say whether it would raise or lower the net pressure required to propagate.

Then take the PKN and KGD net pressures in the table and state what you would conclude on site if the measured net pressure were several times the larger of them.
