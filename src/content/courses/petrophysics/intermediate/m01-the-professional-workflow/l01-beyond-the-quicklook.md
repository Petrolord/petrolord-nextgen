# Beyond the quicklook

The Associate course left you with a complete, working interpretation of the typewell: shale volume from the gamma ray, porosity from the density log, water saturation from Archie, and net pay from three cutoffs. That workflow is honest and it is auditable, and for a first pass on a clean sand it is often all you need. It is also built on a set of assumptions that were quietly chosen for you. The Professional tier begins by naming those assumptions, because every one of them is a place where a real well can disagree with the quicklook.

## What the beginner workflow assumed

Look back at what the Associate interpretation actually did. Porosity came from one source, the density log, converted with fixed matrix and fluid densities of 2.65 and 1.0 g/cc. Saturation came from the clean-sand Archie equation, with $R_w = 0.05$ ohm.m, $a = 1$, $m = 2$ and $n = 2$ taken as given constants. Shale volume used the Larionov tertiary transform, again as a given. Nothing in the workflow checked any of these numbers against the well itself.

Each assumption has a failure mode:

* A single porosity source has no redundancy. If the density log is wrong in an interval, perhaps from rough hole or a barite-loaded mud, nothing in the workflow will notice. A second and third porosity method gives you cross-checks and a way to detect gas.
* Archie assumes the only conductive material in the rock is the brine in the pores. Clay minerals conduct too. In a shaly sand, Archie blames all the conductivity on water and therefore reads water saturation too high, which understates hydrocarbons exactly where the reservoir quality is already marginal.
* The Archie parameters were handed to you. In a real study, $R_w$ might come from a water sample of doubtful provenance, and $m$ from a global default. Booking reserves on unvalidated parameters is a professional risk. The well often contains the evidence needed to check them, if you know where to look.

## What the Professional tier adds

This course upgrades the workflow in three directions, and each later module owns one of them.

First, porosity from multiple methods. You will compute sonic porosity with the Wyllie time average and with Raymer-Hunt-Gardner, bring in the neutron log, and combine neutron and density into the standard $\phi_{ND}$ average. You will see where the methods agree, where they diverge, and what the divergence is telling you about lithology and fluids.

Second, parameter validation from the data itself. The typewell carries a short water leg at the base of SAND_B. On a Pickett plot, the points from that leg fall on a straight line whose slope and position encode $m$ and the product $a R_w$. Fitting that line turns two handed-down constants into measured quantities with evidence behind them.

Third, shaly-sand saturation. You will work with two of the classic conductive-shale models, Simandoux and Indonesia, driven by a deliberately conservative linear shale volume. Both models degenerate exactly to Archie in clean rock, so they never cost you anything where Archie was already right, and they correct the saturation where clay conductivity was misleading it.

The thread running through all three is the same professional habit: do not accept a parameter you can test, and do not report a number without knowing how it moves when the method changes.

## The capstone, previewed

The graded practical at the end of this course asks for six numbers, all evaluated on the SAND_A zone between 2010 and 2030 m or on the water leg. They are: the SAND_A mean neutron-density porosity, the SAND_A mean Wyllie sonic porosity, the fitted Pickett $a R_w$, the fitted Pickett cementation exponent $m$, the SAND_A mean Simandoux water saturation, and the SAND_A mean Indonesia water saturation. Every one of them is produced by the workflow you are about to learn, run inside the Petrophysics app on the same typewell dataset you already know. There is nothing hidden in the grading: if your methods and parameters are right, your numbers are right.

## Worked example

To see the cost of one beginner assumption, take the shale point at 2000 m, where GR reads 120 API and the deep resistivity flattens at 2 ohm.m. The Associate workflow, applied blindly with Archie, treats that conductivity as water in pore space. The Professional workflow recognises most of it as clay conduction. When you meet this sample again in module five, you will compute Archie water saturation of roughly 0.88 against a Simandoux value of roughly 0.57 at the same depth. That gap of more than thirty saturation units is entirely an artefact of the clean-rock assumption, in a sample that is not clean.

Now take the clean point at 2020 m, in the middle of SAND_A, where GR reads 20 API. There the linear shale volume is 0, and all three saturation models return exactly the same value, 0.4324. Same equations, same parameters; the difference is only the clay term. This pair of samples is the whole argument for shaly-sand methods in two numbers.

## Exercise

Write down, from memory, the three given parameter groups the Associate workflow trusted without testing: the porosity pair, the Archie set, and the Vsh anchors. Then, for each group, note which upcoming module tests or replaces it. As a self-check: the porosity pair (2.65, 1.0 g/cc) gains two independent companions in modules two and three; the Archie set (0.05, 1, 2, 2) is validated by the Pickett fit in module four, which should return $a R_w = 0.0500$ ohm.m and $m = 2.000$ on this well; and the saturation treatment of shale is replaced by Simandoux and Indonesia in module five. If your mapping matches, you already understand the shape of this course.
