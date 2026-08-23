# Why resistivity

Every measurement you have met so far in this course tells you about the rock: how shaly it is, how much pore space it holds. None of them tells you what fills that pore space. Resistivity is the measurement that does. It is the reason we can look at a wireline log and say "this sand is wet" or "this sand holds hydrocarbons", and it is the input that drives the water saturation calculation in the next lessons.

## What conducts and what does not

An electric current needs mobile charge carriers. In a sedimentary rock at logging frequencies, the only abundant carriers are the dissolved ions in the formation brine: sodium, chloride, calcium and the rest. Consider each component of the rock in turn:

- The mineral grains themselves (quartz, calcite, feldspar) are insulators for practical purposes.
- Oil and gas are insulators too. Hydrocarbon molecules carry no free charge.
- Formation brine conducts, and it conducts better the saltier and hotter it is.

So the resistivity of a clean rock is controlled by one thing: how much conductive brine it contains and how that brine is connected. Two effects follow directly.

First, porosity. Lower the porosity and you remove brine volume, so resistivity rises. A tight limestone can read hundreds of ohm.m even when fully water bearing, simply because there is very little water in it.

Second, saturation. Keep the porosity fixed but displace part of the brine with hydrocarbons and resistivity rises again, because you have replaced a conductor with an insulator. This is the effect we are after. If we can correct for the porosity part, whatever increase remains must be a fluid effect. That separation of the two effects is exactly what the Archie equation does, two lessons from now.

There is one important spoiler: clay minerals conduct through the ions bound to their surfaces, so shale is a conductor even without free brine. That is why resistivity interpretation starts from the clean sands, and why the shale volume work you did in module 2 matters here. We return to this in the lesson on the limits of Archie.

## Deep and shallow: Rt and Rxo

Recall the invasion picture from module 1. Mud filtrate pushes into a permeable formation and displaces the original fluids near the wellbore. That means the rock close to the hole no longer contains the fluids you care about. Resistivity tools are therefore built in families with different depths of investigation:

- A deep reading aims past the invaded zone at the undisturbed formation. Its target is the true formation resistivity, written $R_t$.
- A shallow reading deliberately measures the flushed zone, where filtrate has replaced most of the original fluid. That value is called $R_{xo}$.

Comparing the two is itself diagnostic: a separation between deep and shallow curves in a permeable sand is evidence that invasion happened, which is evidence of permeability. For saturation work, though, the number we carry forward is $R_t$. The typewell dataset provides a deep resistivity curve, RT, and that is the curve used everywhere in this course.

Two tool families provide these readings. Induction tools energise the formation with coils and work best in fresh or oil-based muds and moderate resistivity. Laterolog tools force a focused current through the formation and work best in salty, conductive muds and high resistivity contrast. Which family a well was logged with matters to specialists doing environmental corrections; at this tier you simply need to know that both exist and both aim to deliver $R_t$.

## Reading the curve

Resistivity spans several orders of magnitude in ordinary rocks, so it is displayed on a logarithmic scale, typically 0.2 to 2000 ohm.m across the track. Get used to thinking in ratios rather than differences: a jump from 1 to 10 ohm.m means the same thing visually as a jump from 10 to 100.

On the typewell the shales read about 2 ohm.m. In the pay section of SAND_A the deep resistivity reads around 9 ohm.m, more than four times the shale value, while the porosity is high. High porosity with high resistivity is the classic hydrocarbon signature. In the water leg near the base of SAND_B the same sand drops to low resistivity because the pores are full of brine again. You will quantify all of this shortly; for now the skill to practise is spotting those contrasts by eye.

## Worked example

A clean sand and a shale both read on the log. The shale reads 2 ohm.m. The sand reads 9 ohm.m with good porosity. Which effect explains the sand reading, porosity or fluid? Porosity in the sand is higher than in the shale, and higher porosity on its own would push resistivity below the shale value, toward 1 ohm.m or less with this brine. Instead the sand reads over four times higher. The porosity effect works the wrong way to explain that, so the increase must come from the fluid: part of the brine has been displaced by an insulator. That qualitative argument is the whole logic of saturation interpretation; Archie just puts numbers on it.

## Exercise

On the typewell, the interval 2075 to 2078 m is a known water leg in clean sand with porosity similar to the pay above it. Before computing anything, predict how its deep resistivity should compare with the 9 ohm.m read in SAND_A pay, and explain your reasoning in one sentence. Check yourself: it should read much lower, near the fully water bearing value, because the porosity is similar but the insulating hydrocarbon has gone; only the fluid term differs.
