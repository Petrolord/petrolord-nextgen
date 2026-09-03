# The crushed zone

The ring of damaged rock around a tunnel, and the one skin term that can be removed by an operation.

{{panel:ps-shot-explorer}}

## What it is

The jet that made the tunnel also destroyed the rock immediately around it. Grains are fractured, pore throats are collapsed, and fines are driven into what pore space remains.

The result is a roughly cylindrical shell around the tunnel whose permeability is a fraction of the rock outside it. Its thickness is typically a few millimetres to a centimetre, and the damage is worst at the tunnel wall and fades outward.

## How the model handles it

As a single shell of uniform reduced permeability, described by two numbers: the outer radius of the shell, and the ratio of the undamaged permeability to the damaged one.

The skin contribution is the spacing divided by the tunnel length, times the logarithm of the radius ratio, times one less than the permeability ratio.

Three things follow from that form. It is zero when the permeabilities are equal, exactly, which is the right behaviour for an undamaged tunnel. It is linear in the permeability ratio less one, so twice the damage is twice the skin. And it depends on the shell radius only through a logarithm, so the thickness of the shell matters much less than how bad the damage is.

## Why it matters more than people expect

On the small through-tubing gun in this course, the crushed zone contributes more skin than any other single component. Its tunnel is short, so the spacing over length ratio is large, and that ratio multiplies the whole term.

Short tunnels and low shot densities make the crushed zone dominant. Long tunnels and high densities make it almost disappear.

## The one term an operation can remove

Every other component is fixed once the gun has fired. The crushed zone is not: it is a permeability, and permeability can be restored.

Perforating underbalanced draws fluid in through the tunnel as it forms, and the surge carries the crushed debris back into the wellbore. An acid wash dissolves it in a carbonate. A surge tool does the same job mechanically after the fact.

That is why underbalance is part of this course at all. It is the design lever against the one skin term that is not geometry.

## Exercise

Write down the crushed-zone skin expression and say what each of its three factors does.

Explain why the crushed zone dominates on a short-tunnel low-density gun and almost vanishes on a long-tunnel high-density one.

Then name three ways of removing it and say which of them has to be planned before the gun fires.
