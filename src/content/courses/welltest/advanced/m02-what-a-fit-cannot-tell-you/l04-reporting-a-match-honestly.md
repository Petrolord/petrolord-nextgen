# Reporting a match honestly

What has to be in a report for somebody else to check it.

## Why this needs a lesson

A fitted model produces a table of parameters and a plot on which the model lies on the data. Both look conclusive. Neither, on its own, lets a reader tell the difference between the homogeneous fit and the phantom fault fit from two lessons ago, which produce visually identical plots and equally confident-looking parameter tables.

So the report has to carry the things that distinguish them.

## The eight items

**The model, by name, and why it was chosen.** The diagnosis that justified it: the regime sequence, the intervals, the levels. If the derivative showed only a plateau, say so, and say that no boundary model was tried.

**Every fixed input.** Porosity, viscosity, total compressibility, net pay, wellbore radius, formation volume factor, rate, and where each came from. These are not the fit's outputs and they are half of the answer.

**The rate history.** Including the producing time used and whether it was an equivalent producing time.

**The data window and any preparation.** Decimation, despiking, points removed and why.

**The fitting settings.** Derivative weight, smoothing window L, and the starting values if they were not the defaults. The next module has a case where the starting value alone decides the answer.

**The parameters, with their bounds.** Flag any parameter at or near a bound explicitly. A reader cannot see this from the value alone unless they know the bounds.

**The residual and the convergence flag.** With enough context to be interpretable: what the residual is a sum of, and in what space.

**A perturbation check.** Refit with slightly perturbed data or a slightly different window and report which parameters moved. This is two minutes of work and it is the single most informative thing in the report.

## The plot to include

Log-log, pressure change and derivative, data and model together. Not semilog and not linear.

The log-log derivative plot is where model error shows up. A model that is wrong in a way the pressure plot hides is visible in the derivative, and that is the plot a reviewer can actually use.

## What to say about uncertainty

Two numbers, clearly distinguished.

The fit's own confidence interval, labelled as what it is: the precision of the fit given the model and the residual scatter.

A separate range from the input uncertainties, propagated. Rate and net pay are usually the two that dominate, and both are straightforward to propagate because permeability is linear in one and inverse in the other.

If the second is not available, say the uncertainty was not quantified. That is better than presenting the first as though it were the answer.

## The alternatives that were considered

The most useful and least common section in a well test report.

If a second model fits nearly as well, say so and say what it would imply. If the data could be a fault at 800 ft or a permeability decreasing outward, both belong in the report, because the two lead to different development decisions and the reader is the one making them.

Reporting a single answer where the data support two is not confidence, it is a suppressed result.

## The template

    Model: homogeneous, chosen because the derivative shows storage,
      a transition, and a flat plateau from X to Y hours, with no
      boundary behaviour to the end of the test at Z hours.
    Inputs: [table, with sources]
    Preparation: [decimation, despiking, window]
    Settings: derivative weight 1, L = 0.1, catalog defaults as start.
    Parameters: [table, with bounds and intervals]
    Residual: [value], converged: yes.
    Perturbation: refit on a window starting one decade later moved k
      by A percent and C by B percent. No parameter moved more than that.
    Alternatives: a sealing-fault model also converges; its fault
      distance is not constrained by these data and is not reported.

## The misconception to avoid

"The report should give the answer." The report should give the answer AND enough for a competent reader to disagree with it. A well test interpretation is a model choice plus a fit, and a report that hides the model choice has hidden the part that was actually decided.

## Exercise

Take the phantom fault fit and write the eight-item report for it, honestly.

Then read what you have written and say which item makes it obvious that the fault should not be reported.
