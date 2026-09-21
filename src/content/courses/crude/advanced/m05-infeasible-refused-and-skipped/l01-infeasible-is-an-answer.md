# Infeasible is an answer

A blending terminal is asked for cargoes it cannot always make. The engine then says so plainly. This course puts it in one line: an infeasible blend is a real answer, and the useful one, because the specifications cannot be met by the components available.

## Two infeasible Apapa cargoes

| asked | status | what the engine returned |
| --- | --- | --- |
| Apapa PMS pool to the 10 ppm gasoline template | infeasible | REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can. |
| Apapa PMS pool with a RON minimum of 99 | infeasible | REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can. |

The same four components, the same availabilities and the same 8000 bbl batch that give an optimal recipe on the 50 ppm template give none on either of these.

## Where the verdict comes from

Module one taught that phase one of the simplex looks for any point meeting every row, by driving artificial variables to zero. When it cannot, the rows contradict, and the status is infeasible. optimiseBlend carries that status through as its own refusal. So the verdict is a proof about the problem as posed: no set of volumes, inside the tank limits, meets every specification at once. It is not a failure to search hard enough.

The engine returns no recipe with an infeasible status. There is no closest recipe, no recipe that meets most of the limits, and no quietly relaxed specification.

## The 10 ppm template

The 10 ppm gasoline template reads RON at least 95, MON at least 85, Sulfur at most 10 ppm and RVP at most 8.5 psi, with the same density range. An infeasible status names no single culprit. The refusal is the same sentence for both Apapa cargoes, and it names no component and no limit: "No recipe from these components can meet every specification." The engine was asked both ways. First, each limit in turn moved back to its 50 ppm value, the rest kept at 10 ppm:

| limit moved back | 10 ppm value | 50 ppm value | status |
| --- | --- | --- | --- |
| RON minimum | 95 | 91 | infeasible |
| MON minimum | 85 | 81 | infeasible |
| Sulfur maximum | 10 | 50 | infeasible |
| RVP maximum | 8.5 | 9 | infeasible |

No single limit moved back rescues the pool. Then the 50 ppm template with ONE limit tightened to its 10 ppm value, the rest kept at 50 ppm:

| limit tightened | 50 ppm value | 10 ppm value | status |
| --- | --- | --- | --- |
| RON minimum | 91 | 95 | infeasible |
| MON minimum | 81 | 85 | optimal |
| Sulfur maximum | 50 | 10 | infeasible |
| RVP maximum | 9 | 8.5 | optimal |

Tightened one at a time, the RON minimum and the sulfur maximum are each infeasible. MON and RVP are not.

## The RON minimum of 99

The second case changes one number: the RON minimum rises from 91 to 99. Everything else is the 50 ppm template. RON blends on volume, so the blend's RON is a volume average of the component RONs. The exercise asks what the component table shows about that.

## What the engine's message asks for

The refusal names the two ways out: relax a limit, or bring in a component that can. The optimizer makes neither choice. It states the fact that forces one.

## Why this is the useful answer

An optimal status tells a planner what to do. An infeasible status tells a planner what cannot be done with the components and limits typed. The two tables above show it for the 10 ppm template, one limit at a time.

{{panel:crude-recipe-explorer}}

In the panel, load the Apapa pool and switch to the 10 ppm template. Relax its limits back toward the 50 ppm values and watch which combination returns a recipe.

## Exercise

Read the Apapa component table's RON column: Reformate 98.6, FCC gasoline 92.3, Isomerate 87.6 and Butane 93.8. Read the second infeasible case, a RON minimum of 99. RON blends on volume. Say what the relationship between the component RONs and the minimum of 99 shows about why the rows contradict, and say why the 10 ppm case gives no such single reading.
