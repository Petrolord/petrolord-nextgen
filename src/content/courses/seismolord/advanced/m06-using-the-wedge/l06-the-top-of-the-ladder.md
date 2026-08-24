# The top of the ladder

This is the last lesson of the Seismolord ladder. There is no tier above the Expert tier, so it closes the app rather than pointing at the next rung. What follows is what three tiers have given you, what a wedge model can and cannot guarantee, and where these skills feed.

## What three tiers have given you

**From the Associate tier, you can build a synthetic and defend every step of it.** You can turn a sonic log into velocity, pair it with density to get acoustic impedance, form a reflection coefficient series from the impedance contrasts, choose a wavelet, and convolve the two into a trace. You know that reflectivity belongs to the rock while the trace belongs to the pairing of rock and wavelet, and you have seen that a cluster of moderate coefficients can outproduce a single larger one, so the strongest event on a trace need not be the strongest interface in the earth.

**From the Professional tier, you can align that synthetic against real data and say by how much.** You can run a correlation scan across a range of lags rather than dragging a trace by eye, read the peak and quote the correlation that justifies it, and recognise that a respectable correlation at zero lag is not evidence that the tie is right. You know that changing the wavelet moves both the amplitude and the time of a peak, that the reflectivity underneath does not move, and that a pick therefore carries its bandwidth with it wherever it is quoted.

**From this tier, you can say what the seismic can and cannot resolve, with a number.** On the capstone wedge that means a tuning thickness of 16 ms at 25 Hz and 10 ms at 40 Hz, a tuning amplitude of 0.1155947595834732 at both, an isolated reflector amplitude of 0.07999999821186066, and a theoretical value of 15.593936024673521 ms that the model was checked against. Behind those six numbers sit the results that transfer: the tuning thickness belongs to the wavelet and the tuning amplitude to the rock, the whole curve is a function of frequency times thickness so one curve serves every frequency, an amplitude in the ambiguous band supports two thicknesses, a peak to trough measurement has a floor at $1.0493/(\pi f)$, and a peak pick on a thin bed is systematically early.

That is a complete skill set for a well tie and its consequences. There is no fourth move.

## What a wedge model can guarantee

It can guarantee a resolution limit for a stated wavelet, in two way time, checked against an independent theoretical value and reported with its grid residual.

It can guarantee a ceiling on amplitude. For a known reflection pair, no thickness produces more than $R_{top}\left(1 + 2e^{-3/2}\right)$, and a mapped amplitude above that is evidence of an error in the assumptions rather than a matter of opinion.

It can guarantee the direction of the tuning effect, given the signs of the pair. Opposite signed pairs peak, same signed pairs notch, and the sign question is settled by the logs rather than by the seismic.

And it can guarantee that a thickness read from an amplitude in the ambiguous band has two answers, so that a single reported thickness there is a suppressed result rather than a measurement.

## What it cannot guarantee

It cannot guarantee that the frequency you gave it is the frequency at the target. Everything scales with that input and the model has no way to check it.

It cannot guarantee that the reflection pair from a type well applies where the map is bright. Facies change, and a wedge built on one well is being extrapolated the moment it leaves that well.

It cannot describe interference from anything except the bed's own base. Real sections have neighbours, and a coefficient 20 ms above the target contributes to the same sum. The teaching well showed exactly that, which is why the wedge was built separately from it rather than out of it.

It cannot handle angle. Every coefficient in this course is the normal incidence case, and the previous lesson showed that a bed's top and base stop being opposite as soon as the angle is not zero.

And it cannot substitute for a penetration. One well inside a mapped area settles questions that no amount of modelling will.

## Where these skills feed

**Into mapping and volumetrics**, which consume tied horizons without rechecking them. A surface picked on a peak over a thin bed is early, systematically, and by an amount that follows the isopach. The map that gets gridded and the volume that gets booked both inherit it.

**Into prospect ranking**, where the ceiling and the ambiguous band are the two arguments that most often change a decision. A bright spot that cannot be tuned, and a thickness that has two answers, are both statements a wedge lets you make with numbers attached.

**Into acquisition and processing decisions**, where the tuning thickness in metres at the target velocity is the quantity that says whether a proposed bandwidth answers the question being asked.

**Into the Rock Physics ladder**, where fluid substitution and angle dependent reflectivity are the subject rather than a closing demonstration, and where the chain from a pore fluid to a seismic response is developed with its own rigour.

## The three habits worth keeping

Quote the conditions with the number. A tuning thickness without its frequency, a thickness in metres without its velocity, and an amplitude without its reflection pair are all unusable by the next person.

Check a measurement against something the measurement had no part in producing. The theoretical tuning thickness is on this capstone for that reason and for no other.

Say when a method has stopped working. An apparent thickness at its floor and an amplitude in the ambiguous band both look like ordinary readings, and the only thing that separates a professional result from a confident wrong one is being willing to report that the instrument has run out.

## Exercise

Write the resolution statement you would put in a prospect summary for a target sand expected to be 14 m thick at an interval velocity of 3100 m/s, in a survey delivering 26 Hz at that level. Include everything the habits above require.

As a self-check: the tuning thickness is $389.8484/26 = 15.0$ ms, which at 3100 m/s is $15.0 \times 10^{-3} \times 3100/2 = 23.2$ m of bed, and the apparent thickness floor is $1.0493/(\pi \times 26) = 12.8$ ms, or 19.9 m. A 14 m sand is well below both, so a statement such as the following covers it: at 26 Hz and 3100 m/s the tuning thickness is 23 m and the peak to trough floor is 20 m, so a 14 m sand cannot have its top and base separated and its apparent thickness will read about 20 m wherever it is picked; its amplitude sits on the rising limb where brightness tracks thickness, so relative amplitude can be used to map thickness variation across the prospect provided the reflection pair from the type well applies, and no absolute thickness should be quoted from the seismic alone.
