# What it refuses

The engine solves inflow and takes the outflow as an injected function. It does not own a black oil traverse, it does not forecast decline, and it does not book a reserve.

## The outflow is injected

The node solver is handed two functions and finds where they agree. It does not know what made either, which is why it can be checked without judgement: the published analyticResidualWide case has a parabolic residual with roots at 800.000000 and 1200.000000 stb/d and both stability signs available as exact algebra.

It also lets a consumer hand in a validated traverse of its own, marching Beggs and Brill, Hagedorn and Brown, Gray or Fancher and Brown through a real PVT model. Only dry gas outflow is built in, by Cullender and Smith, because that needs nothing but a z-factor: an 8000 ft static column at a wellhead pressure of 800 psia, 0.65 gas gravity, 2.441 in tubing and 100 degF against 200 degF converges to 952.982971 psia.

## The z-factor is injected too

The default route is Sutton, Wichert and Aziz, and Dranchuk and Abou-Kassem, and it is what the goldens are cut against: 0.90756402 at 800 psia and 120 degF, 0.88010263 at 2500 psia and 180 degF, both at a gas gravity of 0.65. A consumer whose PVT stack is built on another correlation must be able to stay on it.

## No time, therefore no reserve

An inflow curve describes one reservoir pressure. There is no material balance in it, no drive mechanism and no time axis. Shifting the published straight line case to 2000 psia gives a future open flow of 3600.000000 stb/d; nothing here says when 2000 psia arrives, and nothing integrates a rate into a volume.

The tempting number is the absolute open flow: 5760.000000 stb/d for that case, 4324.444444 stb/d for BONNY-7 against an operating rate of 1355.714057 stb/d. It is the rate at a sandface of zero psia. It is an index and a search bound, not a deliverability.

## No family choice, no units, no water split

Every family reproduces one test exactly, at 900.000000, 700.000000, 600.000000, 1500.000000 and 1100.000000 stb/d across the five published calibrations, so nothing in a single test can rank them and the engine has no opinion.

The inflow rate is total liquid. Water cut belongs to the traverse, and scaling the inflow for it as well is how a curve gets scaled twice.

Field units are never converted: psia not psig, stb/d, Mscf/d, ft, degF, in, stb/d/psi.

## What it returns instead of NaN

An empty curve, a null operating point, a status and a warnings list. A NaN open flow makes every downstream rate comparison false, so a caller sails past its own guards. The warnings are narrow: a test at or above the reservoir pressure, a non-positive index, a Fetkovich n outside 0.5 to 1.0, Jones coefficients missing their own test point by more than 2 percent of the reservoir pressure. There is none for the wrong family or the wrong bubble point.

## Exercise

State the refusal list in five lines: outflow, PVT, time, reserves, units.

Then write what the Fetkovich shift from 3500 psia to 2500 psia claims with its 49.625684 stb/d, and what somebody reading it as a forecast has assumed.
