# Polarity and sign

The reflection coefficient computed in the previous lesson came out negative. That minus sign was not a nuisance to be tidied away. It is the half of the number that carries geology, and interpreters who ignore it end up mapping the right event with the wrong story attached.

## What the sign means

Return to the formula and look only at the numerator, $Z_2 - Z_1$, with layer 2 below layer 1. The denominator is a sum of two positive impedances, so it is always positive and can never flip the sign. The sign of $RC$ is therefore the sign of the impedance change as you cross the interface downward.

**A positive reflection coefficient means impedance increases downward.** The rock below is faster, denser, or both. Interpreters call this a **hard** event. Shale onto a tight carbonate is a textbook case: the carbonate's high velocity and density lift impedance sharply as you cross into it. Top of a cemented sand, top of an anhydrite and the top of most basement surfaces behave the same way.

**A negative reflection coefficient means impedance decreases downward.** The rock below is slower, less dense, or both. Interpreters call this a **soft** event. Shale onto a porous gas sand is the case everyone learns first, because gas in the pore space cuts both velocity and density, often producing a strongly negative coefficient at the top of the sand and a positive one at its base where the section stiffens back up.

One habit follows: expect a sign reversal at the base of any body that contrasts with its surroundings. If the top of a unit is soft, its base against similar overburden is hard, and the two coefficients are close to equal and opposite.

## The teaching well's strongest reflection is negative

On the teaching well the largest reflection coefficient in the series is $-0.017688$. Impedance falls from 7979.58 at 1580 m to 7702.20 at 1582 m, a drop of 277.38 units, so the section immediately below that interface is acoustically softer than the section immediately above it. In the vocabulary just introduced, the strongest event on this well is a soft event.

This is where learners most often trip, so it is worth stating plainly. The capstone grades the **magnitude** of that coefficient, 0.017688, not the signed value. "Strongest" always means largest in absolute value, regardless of sign. A coefficient of $-0.017688$ is a stronger reflection than one of $+0.0130$, because 0.017688 exceeds 0.0130. The wave that comes back from the negative interface carries more energy; it simply comes back inverted.

Keep the two ideas separate and neither will confuse you:

* **Magnitude** answers "how much energy came back", and it ranks events by brightness.
* **Sign** answers "did impedance go up or down", and it tells you which way the rocks change.

Sorting a reflectivity series by strength therefore means sorting by absolute value. If you sorted by signed value instead, the strongest event on this well would sit at the bottom of your list rather than the top, and you would report the wrong interface.

## The engine's convention

Inside the app the convention is fixed and documented: SEG normal polarity, meaning an impedance increase produces a positive amplitude. That falls straight out of how the reflectivity is formed. Each sample is differenced against the sample above it, so a downward increase gives a positive numerator and a positive coefficient, and the wavelet convolved onto it in module 5 preserves that sign. When you read the app's synthetic, a positive excursion corresponds to a hard interface and a negative excursion to a soft one.

## The professional caveat

Now the warning that separates a student answer from a working one. **Display polarity conventions differ between surveys, contractors, vintages and regions.** A positive reflection coefficient does not always paint as a peak.

Several independent choices stack up. Recording polarity conventions differ, and the two common ones are opposite. Processing can and does flip a volume's polarity, sometimes without a clear note in the report. The display itself is a further choice: whether positive amplitude is drawn to the right or to the left, and which colour is assigned to it, is set in the software, not in the earth.

The practical rules are short. Establish the polarity of the volume you are working on before you pick anything, ideally from a known event such as the seafloor or a well tied reflector whose sign you can predict from logs. Write the convention down in the project notes. State it explicitly in any tie report or handover, because a tie without a stated convention is not reproducible. And when someone tells you an event is "a trough", ask what convention they are using before you conclude anything about the rocks.

The sign of the reflection coefficient is a property of the earth and never changes. The colour and direction of the wiggle on the screen are properties of the display and change all the time. Keeping those two facts apart is most of what polarity discipline amounts to.

## Exercise

For each interface, state the sign of the reflection coefficient and whether it is a hard or a soft event, then rank the three by strength. Interface A: shale of impedance 7000 over a tight carbonate of impedance 11000. Interface B: shale of impedance 7000 over a gas sand of impedance 5000. Interface C: the teaching well's 1580 m to 1582 m pair. As a self-check: A gives $4000/18000 = +0.2222$, hard; B gives $-2000/12000 = -0.1667$, soft; C gives $-0.017688$, soft. Ranked by magnitude the order is A, then B, then C, so the positive one happens to be strongest here, but B outranks C purely on absolute value despite both being negative. Then write one sentence explaining why you cannot say whether A will appear as a peak or a trough on a given seismic section.
