# Rate buys time, not oil

Increase the injection rate and the flood happens sooner. It does not produce much more oil. This lesson quantifies that on the Ekene element and then draws out why it is the single most important structural property of a waterflood forecast.

## The three runs

Same element, same everything, three injection rates:

| $i_w$ (rb/d) | breakthrough (days) | cumulative oil (stb) | elapsed (days) |
|---|---|---|---|
| 1000 | 1278.375 | 1708898.2842386041 | 4413.4375 |
| 2000 | 639.1875 | 1709784.4164781766 | 2221.9375 |
| 4000 | 334.8125 | 1711522.0925126772 | 1126.1875 |

Quadrupling the rate moves breakthrough from 1278 days to 335, a factor of 3.8, and moves the ultimate oil from 1708898 to 1711522 stb, a factor of 1.0015.

Time scales inversely with rate. Oil barely moves at all.

## Why

Because everything in the forecast that determines recovery is a function of the CUMULATIVE injection, not of time.

The areal sweep depends on $W_i / W_{i,bt}$. The displacement efficiency depends on the pore volumes injected. The stop condition is a water oil ratio, which depends on the displacement state, which depends on the pore volumes injected. Rate appears only in the conversion from cumulative volume to elapsed time.

So doubling the rate halves every time and leaves every volume alone. The small residual differences in the ultimate oil come entirely from the time step: the run stops at the first step past the limit, and at different rates that step lands at a slightly different cumulative injection.

That is worth naming explicitly. The 0.15 percent oil difference across a factor of four in rate is not a physical effect. It is quantisation.

## What this means

**Injection rate is a schedule decision, not a recovery decision.** Choosing between 1000 and 4000 rb/d is choosing whether to produce the same oil over twelve years or three. That is a real and consequential choice, because money now is worth more than money later, but it is an economics question and not a reservoir one.

**Screening on recovery will not distinguish rates.** If you are ranking development options on ultimate recovery, every injection rate scores the same. The differentiator is the discounted value, which needs the economics tooling and not this forecast.

**Accelerating a flood accelerates its costs too.** Four times the rate means four times the water handling, four times the pumping, and the produced water arrives sooner. Whether acceleration is worth it depends on the discount rate and the water cost, both of which are outside this course.

{{panel:wf-design-explorer}}

Move the injection rate slider from 500 to 4000 and watch the breakthrough marker slide left while the cumulative oil tile barely moves. The chart's time axis rescales, which makes the effect easy to miss; watch the tiles.

## Where the rule breaks

This is a property of THIS forecast, and the assumptions that produce it are worth naming because two of them are the ones real fields violate.

**Constant injectivity.** The engine assumes the well takes whatever rate you specify. Real injectors have an injectivity index and a fracture pressure, and above some rate the pressure required exceeds what the formation will take without parting. The Professional tier's Hall analysis is precisely the measurement of that ceiling.

**No rate-dependent physics.** Higher rates mean higher velocities, which in a real reservoir can change the balance between viscous and gravity forces, alter the amount of fingering, and mobilise fines. The SCAL course's gravity number is the screening tool for the first of those, and it says that higher rates make gravity segregation LESS important, which generally helps.

**No time-dependent economics.** The forecast produces volumes against days, and everything about whether acceleration is worth it lives in the conversion of those to money.

## The corollary for the previous tier

This is why the Professional tier's injection recommendations were framed as pressure decisions rather than recovery decisions. Scaling the South element's injection by 1.644053193714856 will change its pressure support and its schedule. On this forecast's logic it will not change what the element ultimately recovers.

That is a real and slightly deflating conclusion, and it is honest. Rebalancing a flood buys pressure and timing. Changing what a flood ultimately recovers requires changing an efficiency, which means changing the fluids, the pattern, or the completion.

## The misconception to avoid

"Injecting harder recovers more oil." Injecting harder recovers the same oil sooner, on any model in which recovery is a function of pore volumes injected. That covers essentially every analytical waterflood method. The exceptions come from rate-dependent physics that these methods do not contain, and if you want to claim one you should name it.

## Exercise

First, confirm from the table that breakthrough time is inversely proportional to rate, and explain the small departure from exact proportionality at 4000 rb/d.

Second, a flood is offered a doubling of injection capacity. Write the three questions you would ask, and state which of them this forecast can answer.
