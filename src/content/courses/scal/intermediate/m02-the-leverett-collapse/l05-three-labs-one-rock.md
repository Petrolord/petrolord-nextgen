# Three labs, one rock

The Ekene plugs were deliberately sent to three different measurement systems: air-brine, mercury injection, and oil-brine. This lesson looks at what the fluid pair does to the raw tables, why the factor-of-six disagreement between two of them is exactly predictable, and why two of the three tables agreeing almost perfectly is the most misleading thing on the page.

## The fluid pair is a pure amplifier

In the psi-per-J factor of a plug,

$$\text{psi per J} = \frac{\sigma \cos\theta}{0.21645 \, \sqrt{k/\phi}}$$

the fluid pair contributes only the numerator. The three systems used on the Ekene plugs span nearly an order of magnitude in $\sigma \cos\theta$:

| plug | system | $\sigma$ dyn/cm | $\theta$ deg | $\sigma \cos\theta$ | psi per J |
|---|---|---|---|---|---|
| EK1-P | air-brine | 72 | 0 | 72 | 7.784203465197102 |
| EK3-P | mercury-air | 480 | 40 | 367.7013326971094 | 48.048806800916026 |
| EK5-P | oil-brine | 48 | 30 | 41.569219381653056 | 7.8815651094764885 |

Mercury is the outlier by design: its interfacial tension of 480 dyn/cm is why mercury injection can drive a non-wetting phase into pores that air-brine equipment cannot reach at practical pressures, and it is why EK3-P's raw table towers over the others.

## The factor of six, predicted to fifteen digits

Because both plugs sit on the same designed J curve, the ratio of their raw pressures at ANY saturation is just the ratio of their psi-per-J factors:

$$\frac{P_c^{EK3}}{P_c^{EK1}} = \frac{48.048806800916026}{7.784203465197102} = 6.172604174048192$$

Check it against the tables at the 0.30 row: 180.18302550343515 divided by 29.190762994489138 is 6.172604174048192. The same ratio holds at the 0.55 row, at the 1.00 row, at every row, because a ratio of two constants has no saturation in it. The six is not measurement disagreement; it is two amplifier settings on one signal.

Notice the ratio is NOT simply 367.7 over 72. The rocks differ too, k of 250 versus 420 md and porosity 0.20 versus 0.23, and $\sqrt{k/\phi}$ carries its share: 35.35533905932738 for EK3-P against 42.73273869671518 for EK1-P. Fluids amplify by about 5.1, rock geometry by about 1.21, and the product is the observed 6.17.

## The trap: two tables that agree for no good reason

Now the quiet one. Plugs EK1-P and EK5-P have almost nothing in common: 420 md against 95, porosity 0.23 against 0.16, air-brine against oil-brine. Yet their raw tables nearly coincide; the ratio of their pressures at every row is 1.0125075924228712, barely one percent apart.

That is an accident of cancellation. EK5-P's tighter rock pushes its pressures up by exactly the factor its weaker fluid pair pulls them down, and the two effects almost null. An interpreter comparing raw curves would call these two plugs "the same rock" and mercury plug EK3-P "something else entirely", and would have it precisely backwards on both counts: all three are the same rock family, and the two look-alikes are the least alike in properties.

This is the strongest argument for never comparing capillary curves in psi. Raw agreement is not evidence of similarity, and raw disagreement is not evidence of difference, until the scaling has been divided out. The J axis is where comparisons mean something.

## When to distrust the contact angle

Of the four scaling inputs, $\theta$ is the one measured worst. Interfacial tension can be measured to a few percent; permeability and porosity come off routine core analysis; the contact angle on a real rock surface is contaminated by roughness, mineral heterogeneity and wettability alteration, and lab conventions differ on what angle to book for mercury systems at all. The engine follows the printed convention of carrying the pair $(\sigma, \theta)$ and using their product.

Practical guidance: treat a booked $\theta$ of exactly 0 or a suspiciously round 40 as a convention rather than a measurement, and remember that an error in $\theta$ propagates through $\cos\theta$, so it is most dangerous at high angles. At 40 degrees a 5 degree error moves $\sigma \cos\theta$ by about 6 percent; at 0 degrees the same 5 degree error moves it by less than half a percent. If a plug rides off the cloud and its system has a large booked contact angle, check $\theta$ before you check the rock.

## The misconception to avoid

"Mercury data is not representative because the fluids are wrong." The fluids ARE wrong for the reservoir, and it does not matter, because the J-function was built to strip the fluid pair out. What mercury buys is range and speed; what it costs is a conversion step that must be done consciously, with a defensible $\sigma \cos\theta$ for the mercury system AND for the reservoir system you convert into. Mercury data mishandled is dangerous; mercury data scaled properly is just data, and on this fixture it lands on the same curve as everything else to machine precision.

## Exercise

First, compute the ratio of EK5-P's psi-per-J factor to EK1-P's from the table above and confirm it equals the 1.0125075924228712 agreement between their raw tables. Then predict what happens to that agreement if both tables are converted to one common fluid system, the reservoir's oil-brine pair say: with the fluid amplifier now identical, only the rock factors remain, and their ratio is $42.73273869671518 / 24.36698586202241$. Compute it, and say what the two "matching" curves look like after the conversion.

Second, a fourth plug arrives measured air-brine at $\sigma$ of 72 with $\theta$ booked as 30 degrees rather than 0. Its J curve rides parallel below the Ekene cloud. Compute the ride factor that the $\theta$ booking alone would explain, and say whether it puts the plug above or below.
