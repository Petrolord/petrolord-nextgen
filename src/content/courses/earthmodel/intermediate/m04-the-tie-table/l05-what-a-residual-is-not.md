# What a residual is not

The tie table is now fully derived, and before the course moves to the cost of assumptions, this lesson clears away the standard misreadings. Each one is a real habit seen in real shops, and each one quietly destroys the value of the table.

## Not an error bar

A residual is a disagreement at a point, not an uncertainty. The 45.03 at W2 BaseB does not mean "BaseB is known to within about 45 m". Away from wells the surface could be better or worse than that; at the well, after reconciliation, the model can be made exact. Uncertainty is a statement about what you do not know everywhere; a residual is a statement about what you do know at twelve points. The Expert tiers of the mapping ladder build actual uncertainty machinery, jackknives and cross validation; the tie table is not it and does not try to be.

## Not a correction to apply blindly

It is tempting to subtract each residual from its surface locally, nail every well, and declare victory. Doing that without asking WHY the residuals are what they are bakes the BaseB contradiction into the model: the surfaces would be warped 30 plus metres downward at two wells to honour a zone the clamp will then re-erase, or worse, the clamp is turned off and the model becomes geometrically invalid, BaseB above TopB, the exact invalidity the Associate tier's module three exists to prevent. The ledger said the disagreement is structural; a local warp treats it as cosmetic. Reconciliation is a mapping decision, made where the surfaces are made, with the tie table as evidence.

## Not a verdict on the well

A tie table is symmetric evidence, and yet in practice it is almost always read as grading the MODEL, never the picks. The eastern BaseB story could, in principle, be two miscorrelated picks: if W3's and W4's "BaseB" were actually a deeper marker, the wells would be wrong and the model right. The table cannot exclude it. What weighs against it here is coherence: two independent wells logging the same 30 m, agreeing with a third well's zone where the model also has the zone. Coherent picks across wells beat a surface extrapolated into a data gap. But that is an argument, not an output of the table, and a Professional should be able to say which argument they are making.

## Not comparable across columns without context

Is W2's TopA at minus 35.76 "as bad as" W3's BaseB at plus 37? As numbers, nearly. As problems, they are different species: one is trajectory-borne displacement of the measurement point at a top that exists everywhere; the other is a missing zone at a vertical well. Ranking by magnitude is where attention STARTS, and the columns' patterns are what the attention is FOR. A tie table summarised to a single RMS hides exactly the structure that modules like this one extract; the RMS of this table, dominated by three structural rows, would describe none of its twelve rows well.

## Not permanent

Every number in the table is conditional on the current surfaces, current picks, current surveys. Re-grid a surface, re-steer a pick, re-run a survey with better tools, and the table changes. That is its virtue: it is cheap to recompute and it localises change. A model whose tie table is stored, versioned and re-run on every edit has an audit trail of exactly when each disagreement appeared. This is the same "recompute, never patch" doctrine the whole engine family follows, applied to QC itself.

## Worked example

A colleague proposes: "mean residual is plus 9.17, so shift all three surfaces down by 9 m and the model improves". Test the proposal against the table. The TopA column's residuals are minus 2, minus 35.76, plus 1, plus 0.5: a 9 m downward shift makes three of the four TopA ties WORSE. The improvement would be concentrated entirely in the BaseB column, where the true issue is a missing zone, not a depth shift. The global mean conflated three different mechanisms; the proposal fails all of them at once. Averages across mechanisms are how tie tables get misused.

## Exercise

Write down, for each of the three column patterns established in this module, the single cheapest piece of ADDITIONAL evidence, not in the tie table, you would ask for before acting: one for the TopB uniform bias, one for the eastern BaseB contradiction, one for W2's TopA. One sentence each.
