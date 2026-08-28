# Which fluid the deck must carry

The rule is simple to state and the interesting part is applying it when the study has already been going for a while.

## The rule

The deck carries the fluid description that the rest of the study used. Not the newest one, not the best one, the one that everything else was computed with.

That sounds like an argument for never improving a PVT description, and it is not. It is an argument for improving it in one place at a time and re-deriving everything downstream, rather than improving it in the deck alone.

## The failure this prevents

A study runs for months. The static model is built, the volumes are reconciled, the material balance is history matched, the flood is analysed. Then a new PVT report arrives with better numbers and somebody updates the deck.

Now the deck's oil in place differs from the booked volume by more than the reconciliation allowed. The history match no longer reproduces the pressures. The voidage ledger's factors are stale. None of that shows up as an error; the deck runs perfectly and returns different answers.

The tell, when it eventually surfaces, is a model that used to match and no longer does, with no change to the geology. Someone eventually finds the PVT commit.

## Doing it properly

Change the fluid everywhere or nowhere.

That means the tank model is re-matched, the ledger's frozen factors are recomputed, the mobility ratio is redone, the sweep numbers are refreshed, and the deck picks up the new tables. It is a substantial piece of work and it is the actual cost of a PVT update.

The decision is therefore a project decision rather than a deck edit, and framing it that way is most of the value of understanding it.

## What "matched against" means precisely

Any parameter that was TUNED to reproduce an observation carries the fluid inside it.

Ekene's oil in place was derived from a pressure history through a material balance that used Bo. So the oil in place is a function of Bo, and changing Bo without re-deriving it leaves an oil in place that belongs to the old fluid.

The same is true of any history-matched permeability multiplier, any aquifer strength, any relative permeability endpoint shift. They absorbed the old fluid's behaviour, and they will now compensate for the new fluid in ways nobody intended.

## The version to record

Every deck should be able to answer three questions about its PVT:

Where did the oil table come from, in one sentence.
Where did the gas table come from, in one sentence.
What else in the study was derived using them.

Ekene's answers: the oil is the field's designed material balance fluid, the gas is a standard correlation on the field's gas gravity, and the tank model, the flood ledger and the sweep analysis all used the oil.

Three sentences, in a comment, and the next person does not have to reconstruct it.

## When the deck is the first thing built

Occasionally the simulation model comes first and everything else is derived from it. Then the rule inverts: the deck's PVT is the reference and the other analyses must adopt it.

What is never acceptable is two authoritative sources. A study with a tank model on one fluid and a simulation model on another has two answers for the size of the field and no way to choose.

## The misconception to avoid

"The simulator will tell us if the PVT is wrong." It will not. A simulator runs any thermodynamically consistent table without complaint, and an inconsistent PVT usually produces plausible results that are wrong by a few percent everywhere. Consistency between the deck and the rest of the study is not something the software can check.

## Exercise

First, list the three questions a deck should be able to answer about its PVT, and answer all three for the Ekene deck.

Second, a colleague updates the deck's PVT from a new lab report and the model still runs. Name three quantities elsewhere in the study that are now stale, and say how you would detect the problem months later.
