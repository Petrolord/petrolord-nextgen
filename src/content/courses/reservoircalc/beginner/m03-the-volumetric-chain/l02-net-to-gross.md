# Net to gross

Gross rock volume counted every cubic metre of rock above the contact and inside the mapped area. That count made no distinction between rock that could ever produce and rock that could not. The mapped interval between TOP_SAND and BASE_SAND is not a clean block of sand. It is a sand body with shale streaks, cemented stringers, silty intervals and thin beds that no wireline tool would call reservoir. Net to gross is the fraction that removes them.

## What the fraction means physically

Net to gross, written NTG, is the proportion of the gross interval that is reservoir quality rock. It is a ratio of thickness to thickness, or equivalently of volume to volume, and it carries no units.

$$\mathrm{NTG} = \frac{\text{net reservoir thickness}}{\text{gross interval thickness}}$$

If a well penetrates 32 m of gross sand and the petrophysicist flags 25.6 m of it as reservoir, NTG for that well is 0.8. The other 6.4 m is there in the rock and it is there in the GRV, but it will never contribute a barrel, so it has to come out before anything else is multiplied.

The word "net" is doing specific work. A net interval is one that passed a set of cutoffs, typically on shale volume, porosity and sometimes permeability. Rock that fails any of them is non net. It may still be sandstone, and it may still be visible in core, but for booking purposes it is treated as though it were not there.

At this tier the value is handed to you as a constant, the way a laboratory or a petrophysics team would hand it out for a first pass:

$$\mathrm{NTG} = 0.8$$

## Why it is below one

NTG is almost never 1.0, and when someone reports 1.0 the right response is suspicion rather than congratulation. Real depositional systems interleave. A channel sand carries mud drapes. A shoreface coarsens up through a silty base that never reaches reservoir quality. Diagenesis cements bands of an otherwise clean sand into something with no effective porosity. Below a certain bed thickness the logging tools cannot resolve individual beds at all, so a metre of interbedded sand and shale reads as one averaged, mediocre metre.

NTG is also not a constant of nature. It depends on the cutoffs chosen, and cutoffs are a judgement. Tighten the porosity cutoff and NTG falls. Loosen it and NTG rises, and so does the booked volume, which is exactly why cutoff choices get argued about and documented.

An NTG of 0.8 describes a good, fairly clean reservoir. Four fifths of the interval is producible rock. Values around 0.5 are common in more heterogeneous settings, and values below 0.3 turn a large gross interval into a modest reservoir.

## The step

Applying the fraction to the gross rock volume gives the net rock volume:

$$\text{net} = \mathrm{GRV} \times \mathrm{NTG}$$

$$22.269036 \times 0.8 = 17.815229 \text{ million m}^3$$

So of the 22.26903564453125 million cubic metres of rock above the contact, 17.815229 million cubic metres are reservoir quality. The remaining fifth is shale, silt and cement, still physically present in the trap and permanently absent from the booking.

Notice what did not change. The area is still 1.69 square kilometres and the cell count is still 169. NTG does not remove cells from the accumulation. It thins every cell by the same proportion, as though the 13.176944 m mean column were replaced by a mean net column four fifths as tall. Because the same fraction is applied at every cell at this tier, the operation is a single multiplication on the total rather than a per cell decision.

## The classic double count

Here is the error that costs real money, and it is worth being blunt about it because it is easy to commit and nearly invisible afterwards.

Net to gross is applied once. If you have taken 0.8 off the gross rock volume here, then the porosity you use in the next step must be the porosity of the net rock. It must not be a "net porosity" that has already had NTG folded into it, and you must not multiply by NTG a second time later because it feels safer.

The error usually arrives through vocabulary. A petrophysical summary may quote average porosity over the net interval, which is what you want, or it may quote a thickness weighted "net porosity" or a "net pore thickness" that already contains the NTG factor. If you take a number of the second kind and then also apply NTG yourself, you have multiplied by 0.8 twice. The booking comes out at 0.64 of the correct value rather than 0.8 of it, an understatement of 20 percent, and nothing in the arithmetic looks wrong. Every step is a plausible multiplication of a plausible fraction.

The reverse error exists too. Someone hands you a gross average porosity computed over the whole interval, including the shales, and you apply it to a volume that has already been reduced by NTG. Now the shale porosity has been counted at reduced volume and the sand porosity has been diluted, and the answer is wrong in a way that is hard to unpick.

The defence is a habit, not a formula. For every fraction in the chain, write down what it is a fraction of, and confirm that the volume you are multiplying is exactly that thing. Here, 0.8 is the fraction of the gross rock that is reservoir, and GRV is gross rock, so the multiplication is valid. In the next lesson, porosity will be the fraction of the net rock that is pore space, and the volume it multiplies will be the net rock volume.

## Exercise

A colleague hands you a summary sheet that reports NTG 0.8 and a quantity called "net average porosity" of 0.16 for the same interval, alongside a note saying the gross average porosity is 0.20. Work out what 0.16 most likely represents, and state what would happen to the booked volume if you applied NTG to GRV and then used 0.16 as your porosity.

Self check: 0.16 is 0.20 multiplied by 0.8, so the sheet has already folded NTG into that figure. Applying NTG to GRV and then using 0.16 would apply the 0.8 factor twice, giving 0.64 of the intended pore volume instead of 0.8 of it, an understatement of 20 percent that no later step would reveal. The correct pairing is net volume of 17.815229 million cubic metres with the porosity of the net rock, which is 0.20.
