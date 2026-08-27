# Front saturation and breakthrough

The tangent construction hands us three numbers at once, and this lesson is about reading each of them as a physical statement about the Ekene flood. Two describe the front itself. The third tells us when the front arrives.

## The front saturation

On the Ekene sand the tangent touches the curve at

$$S_{wf} = 0.6372$$

That is the water saturation carried by the shock face as it crosses the reservoir. Behind the face, saturation grades smoothly upward from 0.6372 toward the injector. Ahead of it, the rock still sits at connate water, 0.35. The jump at the face is therefore from 0.35 to 0.6372, a leap of 0.2872 in saturation, and no value in between ever exists as a traveling wave. Those intermediate saturations are exactly the ones the overtaking argument of lesson 1 eliminated.

It is worth pausing on how high 0.6372 is. The mobile saturation window on this rock runs from 0.35 to 0.75. The front arrives already 72 percent of the way through that window. This is what a favorable displacement looks like: with a mobility ratio of 1.2, water does not finger ahead thinly, it builds a thick, efficient bank before it moves.

## The fractional flow at the front

Reading across from the touch point:

$$f_{wf} = 0.8682763300877854$$

The moment the front reaches a producer, the producing stream jumps from essentially no injection water to a water fraction of about 0.87 at reservoir conditions. Breakthrough on a favorable flood is not a trickle that grows. The well goes from dry oil to mostly water in one step, precisely because the front carries a high saturation with a high fractional flow. The day before breakthrough the well cuts no flood water at all; the day after, water is seven barrels in every eight of gross rate. Operators who expect a gentle onset are reading the piston picture, not the curve.

## Breakthrough time in pore volumes

The third number comes from the slope itself. Buckley Leverett theory says the front travels at a speed proportional to $f'_{wF}$, and integrating that motion across the reservoir gives a clean result: breakthrough occurs when the cumulative water injected, counted in pore volumes, equals the reciprocal of the tangent slope:

$$Q_{iBt} = \frac{1}{f'_{wF}} = \frac{1}{3.023246274678918} = 0.33077027444818546 \ \text{PV}$$

One third of a pore volume. Inject water equal to 33 percent of the pore space between the wells and the front completes the trip. The steeper the tangent, the faster the front and the earlier the breakthrough, which is why unfavorable floods with steep early curves water out so soon.

Notice what this number is not. It is not a date and it is not a rate. Pore volumes injected is the natural clock of displacement theory, and it converts to days only when you supply an injection rate and the actual pore volume, which is the business of the next module. Everything in this lesson is rate free.

## See it in the panel

{{panel:sc-displacement-explorer}}

With the Ekene defaults, read the three tiles Swf, fwf and QiBt and match them to the values above. Then push oil viscosity up to 5 cp and watch all three respond together: the front saturation falls, the fractional flow at the front falls, and breakthrough comes earlier. One curve moved, and the whole story moved with it. Bring the slider back and confirm the Ekene numbers return exactly.

## The misconception to avoid

Do not read $Q_{iBt} = 0.33077027444818546$ as the recovery at breakthrough. It is the water injected by breakthrough, measured in pore volumes. The oil recovered by that moment is a different number, computed from the average saturation behind the front, and it is the subject of the next lesson. Injection and recovery agree only in the piston fantasy. On the real curve, part of the injected water is building the saturation ramp behind the front rather than displacing oil ahead of it.

## Exercise

First, using only numbers from this lesson, state the size of the saturation jump at the front and what fraction of the mobile window from 0.35 to 0.75 the front saturation has already covered. Show the arithmetic.

Second, a colleague claims their simulation of a similar sand shows water cut rising slowly over two years after first water arrival, and concludes Buckley Leverett must be wrong. Offer two reasons, in a sentence each, why a real field or a simulator can show a gradual rise while the one dimensional theory still holds at the front itself.
