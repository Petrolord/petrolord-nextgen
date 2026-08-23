# Why Archie fails in shaly sand

The Archie equation earned its place at the beginner tier because it is simple, physical and honest about what it needs: a clean rock whose only conductive path is the brine sitting in connected pores. The professional tier begins by asking what happens when that assumption breaks, because in most clastic sections it does. Shale is not an occasional contaminant; it is the default state of the rock, and it conducts electricity on its own.

## Two conductive paths, one equation

In a clean water-bearing sand, current flows through the brine and nothing else. Archie built his equation on that single path: resistivity rises as porosity falls and as hydrocarbon displaces brine, and the exponents $m$ and $n$ describe how the pore network and the saturation geometry restrict the current.

Clay minerals break the picture. A clay platelet carries a negative surface charge, and a film of cations clings to it as bound water that never drains. This film conducts. Disperse a few percent of clay through the pore system and you add a second conductive path in parallel with the pore brine, a path that exists whether the pores hold water or oil.

The measured resistivity of a shaly sand is therefore lower than the resistivity of the same sand without clay. Archie has no term for the extra path, so it interprets the extra conductivity the only way it can: as more water. The result is systematic. In shaly rock, Archie reads water saturation too high, and the error grows with clay volume. A sand that is actually half full of oil can grade as wet, and pay disappears from the books for no geological reason.

## Seeing the failure on the typewell

The typewell makes the failure visible with numbers you can reproduce. Take the shale point at 2000 m, where the linear transform reads $V_{sh} = 1.0$. The neutron-density porosity is 0.1803 and the deep resistivity is 2 ohm.m. Feed these to the three saturation models this module covers, with the standard parameters $R_w = 0.05$, $a = 1$, $m = 2$, $n = 2$ and $R_{sh} = 2.0$:

* Archie: $S_w = 0.8769$
* Simandoux: $S_w = 0.5730$
* Indonesia: $S_w = 0.4672$

The three answers span more than 40 saturation points on the same sample. Archie, blind to the clay path, calls the interval nearly wet. The two shaly-sand models subtract the clay contribution first and return much lower water saturations. In a pure shale none of these numbers matters commercially, but the same physics operates in every shaly sand you will ever evaluate, where the difference decides whether pay is booked.

Now move to the clean point at 2020 m, in the heart of SAND_A. There $V_{sh} = 0$, porosity is 0.1700 and resistivity is 9.2554 ohm.m. Run the same three models:

* Archie: $S_w = 0.4324$
* Simandoux: $S_w = 0.4324$
* Indonesia: $S_w = 0.4324$

All three agree to four decimals. This is not a coincidence; both shaly-sand equations are built to collapse exactly onto Archie when $V_{sh} = 0$. The clay term switches off and the clean physics comes back.

Those two observations are the whole module in miniature. Shaly-sand models are not rivals to Archie; they are extensions of it, adding one term for the clay path and retiring that term in clean rock.

## What the correction needs

Extending Archie costs two new inputs, and both come from work you have already done in this course:

1. A shale volume, $V_{sh}$, at every sample. This tier uses the linear transform deliberately, because a conservative upper bound on clay keeps the shale term honest.
2. A shale resistivity, $R_{sh}$, read from a thick, clean shale nearby. On the typewell the thick shale reads a flat 2 ohm.m, so $R_{sh} = 2.0$.

Get either input badly wrong and the correction misfires: overstate $V_{sh}$ or understate $R_{sh}$ and the model subtracts too much conductivity, pushing $S_w$ optimistically low. The professional discipline is to treat the shaly-sand result and the Archie baseline as a pair, so the size of the correction is always visible.

## Worked example

Confirm the direction of the Archie error at the shale point, step by step:

1. Archie with $n = 2$: $S_w = \sqrt{a R_w / (\phi^m R_t)}$.
2. Denominator: $\phi^2 R_t = 0.1803^2 \times 2 = 0.032508 \times 2 = 0.065016$.
3. Ratio: $0.05 / 0.065016 = 0.76904$.
4. Square root: $S_w = \sqrt{0.76904} = 0.8769$.

Archie assigns 88 percent water. Simandoux, which routes part of the measured conductivity through the clay, needs only 57 percent water to explain the same 2 ohm.m. The 31-point gap is entirely the conductivity of the shale itself, misread by Archie as brine.

## Exercise

Repeat the four-step Archie calculation at the clean point: $\phi = 0.1700$, $R_t = 9.2554$ ohm.m, $R_w = 0.05$, $a = 1$, $m = n = 2$. Self-check: $\phi^2 R_t = 0.0289 \times 9.2554 = 0.26748$, the ratio is $0.05 / 0.26748 = 0.18693$, and $S_w = \sqrt{0.18693} = 0.4324$. Then state in one sentence why Simandoux and Indonesia return exactly the same 0.4324 at this depth, and in a second sentence why all three disagree at 2000 m.
