# Surface position uncertainty

The term that is not in the survey model and dominates near surface.

## What it is

The uncertainty of the wellhead position itself, before any hole is drilled.

The survey error model starts at the tie-on and accumulates from there. It says nothing about where the tie-on is, so the clearance calculation adds a separate term.

## Its size

The standard clearance examples use 0.5 m at one sigma.

For a modern satellite-positioned wellhead on land, that is generous: a differential fix is good to centimetres. For a platform slot, the slot position relative to the platform reference is known to millimetres and the platform's own position to perhaps a metre. For an old well positioned by triangulation from a shoreline, metres to tens of metres.

## Why it dominates shallow

Because the survey uncertainty starts at zero and grows.

At 100 m below the mudline, a well's own survey uncertainty is a few centimetres. The surface position term is half a metre. So the combined uncertainty is essentially the surface term alone, and every clearance decision at that depth is a decision about wellhead positions rather than about surveys.

That is exactly where platform wells are closest to each other. The shallow section, where slots are metres apart and the wells are nudging away from each other, is where the anti-collision problem is hardest and where the survey model contributes almost nothing.

## The shared-position subtlety

Two wells from the SAME slot share their wellhead position entirely. Two wells from adjacent slots on the same platform share the platform's position and differ only by the slot offsets, which are known to millimetres.

So for platform wells the surface position uncertainty largely CANCELS in the relative position, and treating both wells as independently uncertain by half a metre each overstates the combined term by a large factor.

The standard handles this through the kickoff mechanism in the next lesson but one: below a shared kickoff, the common part of the uncertainty is removed.

For the surface term specifically, the honest treatment is to use the uncertainty of the RELATIVE position, which for two slots on one structure is very small, rather than the absolute one.

## When it is the whole answer

Two wells from adjacent slots, 3 m apart, at 150 m below the mudline. Hole radii of 0.25 m each, tool allowance 0.3 m, so about 0.8 m of the 3 m gap is geometry.

If both wells are treated as independently uncertain by 0.5 m at surface, the combined sigma is about 0.71 m, and at k = 3.5 that is 2.5 m of required clearance against 2.2 m available. A no-go.

If the relative wellhead position is known to 0.05 m, which it is on a fabricated template, the combined sigma is 0.07 m and the same pair is comfortably clear.

Same wells, same surveys, a factor of thirty in the answer, from one input that is not in the survey model at all.

## The misconception to avoid

"Surface position is known exactly." It is known well, and how well depends entirely on the situation, and for a shallow anti-collision problem it is usually the dominant term. Taking a default value from a standard example without asking what the actual wellhead survey was is one of the easiest ways to get a shallow scan badly wrong in either direction.

## Exercise

Two wells from adjacent slots are 4 m apart at the mudline, with 0.25 m hole radii each and a 0.3 m tool allowance.

Compute the separation factor at k = 3.5 for a relative surface position uncertainty of 0.5 m, and again for 0.05 m, assuming the survey contribution at that depth is negligible. State both, and say which assumption a fabricated drilling template supports.
