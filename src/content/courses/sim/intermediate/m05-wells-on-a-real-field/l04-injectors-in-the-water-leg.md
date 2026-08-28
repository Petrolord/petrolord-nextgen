# Injectors in the water leg

Ekene's two injectors were not chosen for their geometry. They were chosen because they were wet, and that fact propagates into the deck in ways worth tracing.

## The wells

| well | top of sand (m) | contact (m) |
|---|---|---|
| Ekene-2 | 1565 | 1560 |
| Ekene-4 | 1590 | 1560 |

Both found the top of the sand BELOW the oil-water contact. They were drilled as producers, they came in wet, and converting them to injection cost a pump and a line rather than a well.

That is how flood patterns are usually chosen, and the waterflood course made a lesson of it. Here the consequence is what it does to the deck.

## What it means in the model

Their cells are in the water leg. Every layer of Ekene-2's column and Ekene-4's column initialises at a water saturation of one, and there is no oil in them at time zero.

So the injectors are putting water into water. The oil is elsewhere, up-structure, and the injection supports it by pressure and by displacing water toward it rather than by contacting it directly.

## Why that is the point

A flood does two jobs, and the waterflood course separated them: holding pressure up and pushing oil along. An injector completed in the water leg does the first job well and the second job only indirectly.

The deck expresses this without being told. Nothing in the schedule says "these wells support pressure"; it falls out of where the wells are relative to the contact, which falls out of the structure, which came from the six mapped tops.

That is a good property of a well-built deck: the interesting behaviour is a consequence of the inputs rather than a separate assertion.

## The completion question

Both injectors are completed through all five layers, the same as the producers.

For a water-leg injector that is defensible: the whole column is water-bearing, so every layer is a valid injection target and spreading the injection across them keeps the injection pressure down.

The alternative would be to complete only the upper layers, closer to the contact, on the theory that water injected higher up displaces oil sooner. That is a real design argument and the model can test it, which is one of the things a simulation model is for.

## What to watch in the results

Two things a reader should check on any deck with water-leg injectors.

**Injectivity.** Injecting into the water leg at high rate raises pressure locally, and the bottom-hole pressure limit is what stops it. Ekene's injectors carry a ceiling of 4500 psia.

**Where the water goes.** Water injected below a contact can move down-dip into the aquifer rather than up-dip toward the oil. The waterflood course booked twelve percent of Ekene's injection as out of zone on exactly this reasoning, and a simulation model can say whether that number is plausible.

## The misconception to avoid

"An injector below the contact is a mistake." It is a common and often correct design, because pressure support does not require contact with oil and a wet well is cheap to convert. What would be a mistake is expecting displacement efficiency from it, or booking its water as though every barrel swept oil.

## Exercise

First, both injectors are below the contact. State which of the flood's two jobs they do directly and which they do indirectly, and name the observable that would tell you the second was failing.

Second, describe the alternative completion strategy for a water-leg injector and say what the model would have to show for it to be worth the intervention.
