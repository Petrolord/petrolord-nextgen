# Wellbore storage

For the first part of every test, the well is producing itself.

## What is happening

Close the valve at surface and the reservoir does not know about it for a while. Fluid keeps flowing from the formation into the wellbore, because the wellbore is a compressible container at a lower pressure than the rock around it, and it keeps filling until the pressures equalise.

The same thing happens in reverse at the start of a drawdown: the first oil out of the well comes from the wellbore's own volume, not from the reservoir.

The storage coefficient C is the volume the wellbore accepts per psi of pressure change, in bbl/psi. For a wellbore full of liquid it is the volume times the fluid compressibility. For a well with a rising liquid level it is much larger, the volume per unit length divided by the fluid density gradient.

The well in this course has C = 0.015 bbl/psi.

## What it does to the data

While storage dominates completely, the rate at the sandface is essentially zero and all the production is coming from the wellbore. The pressure change is then proportional to time:

    dp = q B t / (24 C)

On a log-log plot of pressure change against time, that is a straight line of slope 1, the famous unit slope, and both the pressure and its derivative lie on it together. It is the single most recognisable feature in well test analysis.

On a semilog plot it is not a straight line at all, but it is a gently curving one, and a least-squares line through it looks respectable.

## Why it is steep

The key point for this module: storage-affected data are STEEPER on a semilog plot than radial flow is.

During pure storage the pressure changes linearly with time, and a linear function plotted against log time rises ever more steeply per cycle. Radial flow rises at a constant rate per cycle. So the early data have a larger apparent semilog slope than the late data, and any window that includes them is tilted.

A steeper slope is a LOWER permeability, from the slope equation. This is the mechanism behind everything in this module: including storage data in a semilog fit reports a worse reservoir than the one you have.

## How long it lasts

The rule of thumb is that the semilog straight line does not begin until roughly one and a half log cycles after the end of the unit slope. There are dimensionless criteria that formalise this and they all say the same thing: storage lasts a lot longer than people expect, and the transition out of it is slow.

On this buildup, storage and its transition occupy well over a decade of shut-in time. The radial line is confined to the last stretch of the test, and there are thirteen points on it out of forty.

That ratio is normal, and it is why a test that is stopped early can fail to contain any usable data at all despite having thousands of pressure readings.

## Reducing it

Storage is a nuisance and there are ways to reduce it.

**Shut in downhole.** A downhole shut-in tool closes the well near the sandface, which cuts the stored volume to the few feet between the tool and the perforations. This is the single most effective measure and it can shorten the storage period by more than a decade of time.

**Keep the well full.** A wellbore with a liquid level in it has a far larger storage coefficient than a full one.

**Test for longer.** Always available, always expensive.

## Changing storage

The storage coefficient is not always constant. A well that is shut in while flowing gas and liquid, or a well whose liquid level is rising past a change of tubing size, has a storage coefficient that changes during the test.

That shows up as a derivative that does not settle, and it breaks the superposition on which the buildup analysis rests. It is worth recognising because the usual response, fitting a constant-storage model, will converge on something and report it confidently.

## The misconception to avoid

"Wellbore storage affects only the first few minutes." On a well with a liquid level and a surface shut-in it routinely affects the first several hours, and the TRANSITION out of it affects considerably longer than that. Most of the interpretation errors in this module come from believing the storage period ended earlier than it did.

## Exercise

For a wellbore storage coefficient of 0.015 bbl/psi and a rate of 450 stb/d with a formation volume factor of 1.25 rb/stb, compute the pressure change after 0.01, 0.1 and 1 hours of pure storage.

Compare the first of those against the fixture's first recorded pressure change of 14.961915359246083 psi at 0.01 hours of shut-in, and say what the comparison tells you about how completely storage dominates at that time.
