# True measured depth

The structural section is the plainest display in the whole correlation workflow. It draws every well at its own true measured depth, exactly as the picks were recorded, with nothing moved and nothing adjusted. What you see on the panel is where the rock actually is relative to the reference datum. That sounds so obvious it barely needs saying, until you meet the flattened section in the next module and discover how easy it is to forget which of the two you are looking at.

## What measured depth means

Measured depth is distance along the borehole, counted from a surface reference point and increasing as the bit goes down. It is the number the logging tool reports, because a wireline tool knows only how much cable has been spooled out, not where in three-dimensional space the cable has gone.

The reference point matters and should always be stated. Depths are commonly referenced to the kelly bushing, the rotary table or the drill floor, and occasionally to mean sea level. Two wells quoted against different references are not comparable until one is converted. Every Ekene well uses the same datum, so the depths in this course compare as they stand.

## The simplification this course makes

Measured depth is distance along the hole. True vertical depth is distance straight down. In a perfectly vertical well those two numbers are identical. In a deviated well they diverge, and the divergence grows with inclination: a hole at 60 degrees from vertical gains two metres of measured depth for every metre of vertical depth.

Converting one to the other requires a directional survey, a table of inclination and azimuth readings taken at intervals down the hole, and a computation method such as minimum curvature to integrate the path. That machinery belongs to a later tier. For this course all four Ekene wells are treated as vertical, so measured depth stands in for true vertical depth and the two terms can be used interchangeably without introducing error.

Keep the distinction filed away rather than discarded. The moment you correlate a real deviated well, structural depths must come from the survey, not from the log header, and a section built on raw measured depth will show structure that does not exist.

## Zero shift, said in the engine's terms

Every correlation display in the app is built the same way. Each well is assigned a shift, and the depth drawn on the panel is the true depth plus that well's shift. Flattening, which the next module covers in detail, is nothing more than choosing a non-zero shift for each well so that a chosen surface lines up.

The structural mode is the special case where the shift is zero for every well. No exceptions, no partial adjustments. Displayed depth equals true depth, for all four wells, at every point on the panel. That single sentence is the whole definition of the structural view, and it is worth remembering in exactly that form, because it makes the contrast with flattening trivial to state later.

## The Ekene section in structural view

Four wells, four surfaces, and one shared depth axis. The panel has to accommodate every pick in the dataset, so its vertical extent is set by the two most extreme values.

The shallowest pick anywhere in the field is TOP_A in Ekene-3 at 1495 m. The deepest is TOP_B in Ekene-2 at 1662 m. The displayed span is therefore 1662 minus 1495, which is 167 m. Everything the section has to say about the Ekene structure happens inside that 167 m window.

It is worth noticing which wells supply those two extremes. The shallowest pick comes from Ekene-3 and the deepest from Ekene-2, and neither well is the one that ends up looking most distinctive when you rank the surfaces. Ekene-3 is genuinely the structurally highest well, so its TOP_A being shallowest is no surprise. Ekene-2 supplies the deepest pick only because it happens to carry TOP_B, the deepest surface in the section, and Ekene-4 does not. The extremes of a panel are set by which wells have which surfaces, not by structure alone.

## Why start here

The structural section is the honest one. It makes no assumptions, hides nothing behind a datum choice, and answers one question completely: where is each surface, in real depth, in each well. Every structural conclusion in the field, the direction of dip, the position of the crest, the depth to target for the next well, comes off this display and not off a flattened one.

Its weakness is the subject of the fourth lesson in this module. Because the panel is scaled to 167 m of depth range, differences of a few metres in interval thickness are drawn as differences of a few pixels, and the thickness story becomes almost impossible to read. That is the trade you accept in exchange for true depth, and the next module is about deliberately taking the other side of it.

## Exercise

Without looking back at the numbers above, write down the definition of the structural view in one sentence using the word shift. Then confirm the panel span from the ground truth picks: identify the shallowest pick in the whole Ekene dataset and the deepest, and subtract. As a self-check, the shallowest is TOP_A in Ekene-3 at 1495 m, the deepest is TOP_B in Ekene-2 at 1662 m, and the span is 167 m. Finally, state in one sentence why this course can treat measured depth and true vertical depth as the same number, and what would have to change for that to stop being true.
