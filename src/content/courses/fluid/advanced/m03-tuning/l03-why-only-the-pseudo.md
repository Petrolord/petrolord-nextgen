# Why only the pseudo

Every knob acts on one component out of eleven. The discipline behind that.

## The rule

Adjust what was constructed. Leave what was measured.

Nine of the eleven components are identifiable substances whose critical properties, acentric factors and volume shifts come from published measurements on pure compounds. Those are not uncertain in the way a pseudo-component is uncertain.

Carbon dioxide and nitrogen are the same. Their properties are known to several figures.

The pseudo-component is the only entry in the analysis whose properties were manufactured, and it is therefore the only honest place for an adjustment.

## What adjusting a library component would do

Suppose the regression were allowed to move methane's critical temperature.

It would. Methane at 0.3647 mole fraction has an enormous effect on the saturation pressure, so a small adjustment there is an efficient way to reduce the residual, and a least-squares solver takes efficient routes.

The resulting model would reproduce Good Oil's four numbers and would be wrong about methane. Every other fluid it was applied to would inherit the error, and any question involving methane that the tuning did not cover would be answered wrongly.

That is not a hypothetical failure mode. It is what happens whenever a regression is given a parameter it should not have.

## The same rule elsewhere in the series

The simulation course calibrated a structural model by adjusting the kriging regional mean, the one thing in the static model that no measurement constrained, and its lesson stated the rule explicitly: calibrate the unconstrained parameter against the constrained quantity, never the reverse.

Adjusting porosity to match a volume would have been the equivalent error there. Porosity is measured, it appears in the target, and moving it overrides a measurement with a preference.

Same principle, different domain, and it is worth recognising as a principle rather than as two separate pieces of advice.

## What this means for a tuned model's transferability

A model tuned on the pseudo-component only is still correct about its library components everywhere.

So it can be asked questions the tuning did not cover, within reason. A model that had absorbed its errors into methane could not.

That is the practical payoff of the discipline, and it is the reason to hold to it even when a wider regression would fit better.

## Where the rule gets uncomfortable

When the pseudo-component's four knobs cannot close the gap.

The temptation is then to widen the parameter set. The better responses are to question the characterization method, to consider splitting the plus fraction, or to question the target data, and all three are more work than adding a knob.

A fit that only closes when a measured parameter is allowed to move is telling you something, and what it is telling you is not that the parameter was wrong.

## The misconception to avoid

"The pseudo-component is one component out of eleven, so tuning it is a limited adjustment." It is a third of the moles, most of the mass, and the only component whose properties were invented. Four knobs on it is a substantial amount of freedom, which is why they are bounded and why the fit is checked against targets rather than declared successful.

## Exercise

First, state the rule in one sentence and give the analogous example from the simulation course.

Second, explain in two sentences what would go wrong if a regression were allowed to adjust methane's critical temperature to improve a fit.
