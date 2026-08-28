# Piston layers, no crossflow

Both layered sweep methods rest on the same physical picture. This lesson states it precisely, because every number in the next four lessons is only as good as this picture, and the picture is wrong in three specific ways that push the answer in known directions.

## The picture

A reservoir is a stack of layers. Each layer is a horizontal slab of uniform permeability, uniform porosity, and uniform saturation change. Water enters every layer at the injector and leaves at the producer. Layers do not exchange fluid with each other anywhere along the path.

Within a layer, water displaces oil as a sharp front. Behind the front the layer is at residual oil saturation; ahead of it, at connate water. There is no transition zone, no fractional flow, no capillary smearing. That is piston displacement.

The front in each layer advances at a velocity set by its permeability and the pressure drop across the layer, which is the same for all layers because they share an injector and a producer.

Layers flood out one at a time, fastest first. The analysis proceeds stage by stage: at each stage, one more layer has broken through, and the quantities of interest are the coverage and the producing water oil ratio or water cut at that moment.

## Assumption one: piston displacement

Inside a layer, no oil is left behind the front except residual oil, and no water arrives ahead of it.

Real displacement is not piston-like. The SCAL course constructs the actual profile: a shock front followed by a rarefaction, with water saturation varying continuously behind the front, and the producing water cut rising continuously after breakthrough rather than jumping.

Direction of the error: piston displacement overstates the oil recovered per layer at breakthrough, because it assumes the whole layer behind the front is at residual oil, when in reality the saturation behind a real front is between the front saturation and residual.

The combined treatment, real displacement within layers AND layered sweep, is what a simulator does. These methods deliberately keep the two separate so that each can be understood.

## Assumption two: no crossflow

Layers are hydraulically isolated over the whole distance between wells.

That requires continuous impermeable barriers, and real shale breaks are laterally discontinuous. Where a barrier is absent, water in a fast layer at high pressure crossflows into the adjacent slow layer.

Direction of the error, and this one is counter-intuitive: crossflow generally IMPROVES sweep relative to the no-crossflow prediction, because water leaving the fast layer slows its advance and speeds the slow layer's. So a no-crossflow model is pessimistic.

That makes these methods conservative for vertical conformance, which is a reasonable place for a screening tool to sit.

## Assumption three: equal porosity and saturation change

Every layer has the same porosity and the same movable oil per unit thickness, so thickness alone weights the coverage.

Real permeability and porosity correlate, so a high permeability layer usually has higher porosity and holds more oil. That means the fast layer, which floods first, also holds more of the oil than its thickness suggests.

Direction of the error: with a positive permeability-porosity correlation, the true coverage weighted by PORE volume is better than the thickness-weighted coverage the method reports, because the layer that swept first held more than its share.

## What the engine says about all this

It returns a warnings array, and the layered analysis always includes:

> Piston displacement, no crossflow, equal porosity and saturation change per layer (Dykstra-Parsons assumptions).

and for Stiles:

> Stiles kinematics assume unit-mobility frontal velocities (fronts advance proportional to k).

Those strings travel with the result. A report that quotes a coverage without them has stripped the caveats from the number, and the caveats are the difference between a screening estimate and a claim.

## The net direction

Two of the three errors are pessimistic, one is optimistic, and their relative sizes depend on the reservoir. That is an honest summary and it is less satisfying than "the method is conservative".

What you can say confidently: these methods capture the mechanism of vertical conformance loss, they give a number for it, and the number is uncertain by tens of percent rather than by a factor. That is enough for screening, ranking and design comparison, and not enough for a reserves booking.

## The misconception to avoid

"The assumptions are approximations, so the answer is approximately right." Some assumptions are approximations and some are structural omissions. No-crossflow is not an approximation to crossflow; it is a different physical system. When crossflow is significant, the answer is not slightly off, it is answering a different question, and the way to find out is to ask whether the barriers are continuous.

## Exercise

First, list the three assumptions and, for each, state the direction of the error and one piece of field evidence that would tell you how large it is.

Second, a reservoir has continuous, laterally extensive shale breaks confirmed by correlation across six wells. State which of the three assumptions is now well founded and which two still are not.
