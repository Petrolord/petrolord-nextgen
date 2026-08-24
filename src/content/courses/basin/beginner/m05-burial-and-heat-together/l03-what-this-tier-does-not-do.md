# What this tier does not do

## Stating the boundary before someone crosses it

A course that only says what it does teaches a learner to overreach. You now have a compaction curve, a decompaction routine and a steady heat column, and those three tools produce numbers for anything you point them at. Some of the numbers they will produce are not answers to the questions people will ask you.

So this lesson draws the line. Four things this tier does not do, what each omission costs, and why the boundary sits where it sits.

## It does not run the clock

Everything in this tier is computed on a fixture in one state. The shale at 1000 m is at 1000 m. The heat column is the column. There is no time axis anywhere in the pipeline, no sequence of events, and no dates.

Decompaction is the one place where the absence is easy to miss, because restoring a layer feels like going back in time. It is not. Restoring 100 m of shale from 1000 m to the surface gives 159.79553483785466 m, and that is a geometric statement about the same grain at a different depth. It carries no information about when the layer was at the surface, how long it took to reach 1000 m, or whether it went down steadily.

Running the clock would change the output from a set of depths into a track of depths against time, with a burial rate attached to each interval. That track is what a maturity calculation integrates along. Without it you have the depths but not the schedule.

## It does not compute maturity

No vitrinite reflectance is produced here, no transformation ratio, and no kinetic scheme of any kind is evaluated. The panel in this course reads compaction, thicknesses and the steady heat column, and nothing in it will hand you a maturity, so do not go looking for one.

Adding maturity would take the temperature history from the previous section and integrate a reaction along it, returning a reflectance and a fraction of the kerogen converted. That single addition is what turns a burial and heat model into a statement about whether a source rock has generated. It is the whole of the Professional tier for this course.

## It does not generate or expel anything

Even a maturity is not a charge. Knowing what fraction of the kerogen has reacted says nothing about how many kilograms of hydrocarbon that is, and knowing the mass generated says nothing about how much of it left the source rock.

Generation needs the source rock's organic richness and its hydrogen content, so that a converted fraction becomes a mass per unit area. Expulsion needs a rule for when the source rock stops holding what it has made and starts releasing it. Neither quantity exists in this tier, and neither can be inferred from a porosity, a thickness or a temperature.

Adding them would give you the number a prospect actually needs, which is how much hydrocarbon left the kitchen and was available to fill a trap. That is the Expert tier.

## Its heat column is steady state, not a transient history

This is the omission that gets overlooked, because the column looks like a real answer. It is a real answer to a narrower question than it appears to answer.

Steady state means the column has settled. Heat entering the base equals heat leaving the top at every depth, nothing is being stored or released, and the temperature is exactly $T = T_s + Qz/k$ layer by layer with no internal heat production. That is why 41.66666666666673 degC at 950 m is hand arithmetic rather than the output of a solver you have to trust.

A real basin is not usually settled. Heat flow changes, and the rock takes time to respond. Burial adds cold sediment on top and the column lags behind the answer it is heading for. Erosion strips insulating cover away and the column has to readjust downward. In each case the temperature at a depth at a given moment is not the steady value for that moment's heat flow, and the gap between the two is largest exactly when the basin is doing something interesting.

Adding transient heat would replace one column with a sequence of columns, each one solved with the previous one as its starting point and with the burial of that step applied. The Expert tier does this over 150 Ma of history with a heat flow that cools from 80 to 60 mW/m2 and a 600 m erosion event at 10 Ma, and neither of those two features means anything to a steady solver.

## Why the boundary sits here

The omissions are not gaps in the teaching. They are the reason the teaching works.

Burial and heat are the two inputs every higher calculation consumes, and both of them can be checked by hand at this tier. You can verify a porosity against $\phi_0 e^{-cz}$, verify that a restoration conserved grain, and verify a temperature against $T_s + Qz/k$. Once a kinetic integrator is in the chain, a wrong answer no longer announces which stage produced it, and a learner who cannot check the geometry and the heat has no way to find out.

So the honest description of what you have built is this. It is a correct snapshot of burial and heat on a fixture, checkable by hand at every step, and it is the input to a maturity model rather than a maturity model.

## Exercise

Write the four omissions of this tier as four lines, and beside each one write what adding it back would let you say that you cannot say now. Then answer in one sentence: why is the steady state assumption most misleading during rapid burial or an erosion event?

As a self check: the tier does not run a clock, so it gives depths without a schedule and no burial rates; it does not compute maturity, so a temperature history never becomes a reflectance or a converted fraction; it does not generate or expel, so nothing here becomes a mass of hydrocarbon made or released; and its heat column is steady state, so it describes a settled column rather than a history. Steady state is most misleading during rapid burial or erosion because those are the moments when the rock is furthest from settled, with the column still lagging the heat flow it is responding to, so the steady value for that instant is not the temperature the rock actually had.
