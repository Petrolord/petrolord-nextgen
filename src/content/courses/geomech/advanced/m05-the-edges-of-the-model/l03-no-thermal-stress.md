# No thermal stress

Cooling the wall changes its stress, and the model does not know.

## The mechanism

Mud circulating from surface is cooler than the rock at depth. It cools the near-wall rock, which tries to contract, and the surrounding rock prevents it.

Prevented contraction is a tensile stress. So cooling the wall REDUCES the hoop stress.

## Which direction that pushes

**It helps against collapse.** A lower hoop stress means a smaller stress difference at the wall, so the rock is further from shear failure.

**It hurts against fracture.** The same lower hoop stress is closer to tension, so the wall splits at a lower mud weight.

So cooling narrows the window from the top and widens it from the bottom, and the net effect on the width depends on which bound is binding.

## The size of it

The thermally induced stress is the Young's modulus times the thermal expansion coefficient times the temperature change, over one minus the Poisson ratio.

With a modulus of 25000000000 Pa, a typical rock thermal expansion coefficient and a cooling of a few tens of degrees, it comes out to several megapascals. That is a meaningful fraction of the fracture initiation pressure.

## Where it matters most

**Deep hot wells**, where the temperature difference between the mud and the rock is largest.

**Long circulating times**, because the cooling penetrates further into the rock the longer it goes on.

**Injection wells**, where cold water injected for years cools a large volume and lowers the fracture gradient substantially. That is a well-documented effect and it is why injection fracture gradients fall over the life of a waterflood.

## Where it matters least

Shallow sections, short exposures, and anywhere the mud and the rock are close in temperature.

## What it does to a lost circulation problem

It makes it worse in the direction people usually do not expect: circulating for a long time in a hot hole lowers the effective fracture gradient, so losses can start after hours of trouble-free circulation with nothing else having changed.

## What the model would need

A thermal model of the wellbore and the near-wall rock, coupled to the stress calculation. That means a circulating temperature profile, a rock thermal conductivity and heat capacity, and a thermal expansion coefficient.

None of those is on a standard log suite, and the temperature profile needs the hydraulics model from the previous course.

## The honest position

This model is isothermal, its fracture gradient is therefore an upper estimate in a cooled hole, and the error grows with depth and with circulating time.

## Exercise

Estimate the thermal stress for a 30 degree cooling using the modulus above and a thermal expansion coefficient of 1e-5 per degree.

Then compare it against the fracture initiation pressure at 2500 m and say what fraction it represents.
