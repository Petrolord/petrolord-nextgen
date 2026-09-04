# What the dose assumes

The rate that comes back holds a concentration in the produced water, if a short list of things is true. The module states most of them itself.

{{panel:pd-hydrate-explorer}}

## Every pound reaches the water

The balance puts the whole injected stream into the aqueous phase. Nothing is lost to the gas and nothing partitions into the condensate. The catalogue note on methanol says otherwise: it is "lost to the gas and the condensate, which is what makes recovery hard and is usually the reason a project chooses glycol instead."

None of that loss is modelled. A methanol design stopping at this rate is short by whatever the vapour and the condensate take, and the shortfall is a fluid property, not a factor.

## The water is fresh

Salt inhibits hydrates too, so saline produced water needs less chemical than this balance asks for. The header says why it is left out: the depression from salinity depends on the ions present and is a flash calculation, not a constant. Ignoring it over-injects, and the module says it is left out rather than approximating it.

## The water rate is one number

`waterRateBpd` is a single figure. On TEACHING LINE AKASO SPUR, a construct this course designed for itself and not a published case, it is 420.0 bbl/d, and it carries the 307.7753251096 bbl/d methanol rate on its own. A real line makes different water at different times, and the rate that governs is the one at the cold point, not an average and not a design maximum.

## The boundary and the subcooling came from elsewhere

Neither engine computes where hydrates form, so the subcooling handed in is a laboratory number minus an engine number. On the teaching line the boundary is a teaching input at 71.00 degF flowing and 78.00 degF once the line packs up, and the shut-in subcooling to kill is 36.00 degF with a 5.00 degF margin on top, sizing 36.0035520084 weight percent methanol.

## The constants are movable

`HAMMERSCHMIDT_RELIABLE_WT_PCT` at 25.0 weight percent and `MAX_PRACTICAL_WT_PCT` at 70.0 weight percent are exported constants, and the ceiling is an argument with a default a user can move. They are conventions rather than physics, and a design quoting one is quoting the module's default, not a limit of nature.

## The mistake

Reading the returned rate as a delivered result. It holds a concentration if the inhibitor all arrives, the water is fresh, the rate is right and the boundary is right. What the module reports is the concentration it sized for.

## Exercise

List the assumptions that would change the answer on a line making saline water and losing methanol to the gas, and say which direction each moves the rate.

Then say which of them the module tells you about in its return, and which you would have to know to ask.
