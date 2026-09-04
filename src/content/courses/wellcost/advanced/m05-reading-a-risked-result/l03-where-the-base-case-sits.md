# Where the base case sits

The useful question about a deterministic estimate is not whether it looks reasonable. It is which percentile it turns out to occupy.

{{panel:wc-risk-explorer}}

## A base case has a position, whether you look or not

Build the golden estimate and you get a base of 5,380,000 USD, a contingency of 538,000 and a total of 5,918,000. Every one of those is a single point. None of them carries any statement about likelihood.

Run the same case with its uncertainties and the sampled distribution appears underneath. Your deterministic figure now has a location in it. It always had one. Before the run you simply could not see it.

That location is the honest description of the estimate. Saying that a number is realistic is an opinion. Saying that it sits at the fortieth percentile of its own risked distribution is a fact you can act on.

## Why the position is usually low

Two forces push a deterministic estimate below the middle of its own distribution, and both were established in the previous module.

Input skew moves it. On the linear fixture the run at the modes gives 1,500,000 USD while the analytic mean is 1,530,000, a gap of 30,000 USD, or a fraction of 0.02. Notice that this gap is smaller than the fixture's standard deviation of 63868.354187866 USD, so the base is below the mean by well under one standard deviation there.

Convexity moves it further, and only when the uncertainties are rates. The fixture has none, so it shows the first effect cleanly and none of the second. The golden case has two rate of penetration uncertainties, on the intermediate hole and on the production hole, and both of them feed times that go as one over rate.

Put those together and the deterministic base is not a middle. It is a somewhat optimistic point whose exact rank you have to measure rather than assume.

## Measuring it

The procedure is three steps and there is no shortcut.

Run the deterministic case and keep the total. Run the sampled case with a recorded seed. Then count what fraction of the realisations came in at or below that total.

That fraction is your answer, stated in the cost convention, and it is the sentence worth putting in front of an approver. Not this estimate is reasonable, but this estimate covers roughly this share of the outcomes we modelled.

If the fraction comes back well below a half, the estimate is not wrong. It is simply a low case that has been presented as a plan, and everybody in the room should know that before they vote.

## Exercise

In the panel, record the deterministic total, then run the risked case and locate that total within the sampled distribution.

Write the result as one sentence in the cost convention, naming the convention explicitly, and state whether you would present that number as a plan.
