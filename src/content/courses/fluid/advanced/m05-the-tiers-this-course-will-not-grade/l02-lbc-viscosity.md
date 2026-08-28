# LBC viscosity

Every viscosity the compositional model reports, and why none of them is graded.

## What it is

The Lohrenz-Bray-Clark correlation, from 1964. It predicts the viscosity of a hydrocarbon mixture at reservoir conditions from its composition and its density.

It is the standard compositional viscosity model. Essentially every commercial simulator uses it, which makes it worth understanding regardless of what one thinks of it.

## How it works

A dilute-gas viscosity for each component, mixed by a standard rule. Then a correction for density, as a fourth-order polynomial in the reduced density:

$$\left[(\mu - \mu^*)\xi + 10^{-4}\right]^{1/4} = a_0 + a_1\rho_r + a_2\rho_r^2 + a_3\rho_r^3 + a_4\rho_r^4$$

The fourth power on the left is the striking feature. Small errors in the bracket become large errors in the viscosity, because the relationship is being inverted through a fourth root.

## Why it is a screening quantity

Because of the reduced density, which needs a critical volume for every component.

For library components those are measured. For the C7+ pseudo-component the critical volume is characterized by correlation, and it is the least reliable output of the characterization chain.

That uncertain critical volume enters the reduced density, which enters a fourth-order polynomial, which is then raised to the fourth power. The error amplification is severe and it is worst for liquids, where the reduced density is highest.

The engine's own tier note gives the numbers: order ten percent on gas, up to a factor of two on oil.

## What is gated and what is not

The engine's harness checks the LBC implementation against its published form by transcription, and checks the dilute-gas component viscosities against NIST anchors.

So the ARITHMETIC is verified. What is not verified is the ANSWER, because verifying it would need measured viscosities on this fluid and the study does not report any on a compositional basis.

That distinction is the whole of the tier system in one example: an implementation can be provably correct and still produce a number nobody should book.

## What it would take to improve it

Tuning the critical volumes to measured viscosities. That is standard practice in commercial work and the engine does not do it: the ET tuning programme's four knobs are aimed at phase behaviour and density, and viscosity tuning is on its out-of-scope register.

So every viscosity this model reports is untuned by design, and the tier label says so.

## Reading a compositional viscosity in a report

Ask whether it was tuned. If it was not, treat it as an order of magnitude. If it was, ask what it was tuned to and at what conditions, because a viscosity tuned at reservoir conditions says nothing about the same fluid at separator conditions.

## The black-oil comparison

The Associate tier's viscosity chain, Beal then Beggs-Robinson then Vasquez-Beggs, is `published_method` rather than `screening`, and it is a fairer bet on an ordinary black oil than an untuned LBC.

That is worth stating plainly. For viscosity on a black oil, the older and simpler correlation set is the better tool, and the compositional model's advantage lies elsewhere.

## The misconception to avoid

"The compositional model is more rigorous, so its viscosity is better than a correlation's." Its phase behaviour is more rigorous. Its viscosity is a correlation too, resting on a characterized critical volume, amplified through a fourth power. Rigour in one part of a model does not transfer to another part that happens to be in the same file.

## Exercise

First, trace the chain from the C7+ characterization to a reported oil viscosity, naming the amplification step.

Second, explain in two sentences how the LBC implementation can be verified while the LBC answer is not.
