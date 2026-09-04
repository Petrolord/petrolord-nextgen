# Which one moves the skin

The two damage numbers do not carry equal weight. One enters linearly and one enters through a logarithm, and the difference decides where your effort should go.

{{panel:st-acid-explorer}}

## The contrast is linear

Look at what each extra unit of contrast costs, at the published damaged radius of 0.9 m.

| Contrast k/ks | Skin | Change from the row above |
| --- | --- | --- |
| 1 | 0 | |
| 2 | 2.120263536200091 | 2.120263536200091 |
| 3 | 4.240527072400182 | 2.120263536200091 |
| 5 | 8.481054144800364 | two such steps |
| 20 | 40.28500718780173 | nineteen such steps |

Every unit added to the contrast adds exactly the same 2.120263536200091 to the skin. The relationship is a straight line, and it never flattens off. The hundredth unit of contrast costs exactly what the second one did.

## The radius is logarithmic

Now the same exercise on the radius, at the published contrast of 5.

Going from 0.2 m to 0.4 m, a step of 0.2 m of rock, moves the skin from 2.4647445576952682 to 5.23733327993505.

Going from 1.5 m to 3.0 m, a step of 1.5 m of rock, moves the skin from 10.524356639864328 to 13.296945362104108.

Those two rises are the same size. The second step covers far more rock than the first and buys exactly the same skin, because both are a doubling, and the logarithm counts only doublings.

## What this means when you design

Diagnosis effort belongs on the contrast. An error of one unit in k over ks moves the answer by a fixed and substantial amount, wherever you are on the scale. An error of a factor of two in the damaged radius moves it by much less, and by less and less the further out you go.

Treatment effort runs into the same asymmetry from the other side. Pushing the acid front deeper buys skin logarithmically, but the volume of a treated annulus grows with the square of the radius. Reaching 0.3 m in the published interval takes 6.6446946570134715 m3. Reaching 0.6 m takes 29.546905101683063 m3. Several times the acid, for one more doubling of the front.

Deep damage is not the enemy. Severe damage is.

## Exercise

Using the first table, predict the skin at a contrast of 4 before you compute it, and say why you can.

Explain why a step from 1.5 m to 3.0 m buys the same skin as a step from 0.2 m to 0.4 m.

Then say which of the two numbers you would spend a diagnostic budget on, and defend the choice with one of the tables.
