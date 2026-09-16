# A vendor number beats a table

Give the engine a K and it uses it, with no derating and no floor, and it labels the result so a reader knows where the number came from: {"k":0.28,"derated":false,"floored":false,"nearFloor":false,"source":"typed","warning":null}.

{{panel:fc-separator-explorer}}

## The override wins outright

An override is not blended with the table and it is not derated afterwards. It replaces the whole lookup. The five fields returned beside the value say exactly that: nothing was derated, nothing was floored, nothing sits near the floor, the source is typed rather than the published table, and no warning is raised.

The source field is the part worth keeping. A K of 0.280000 could have come from a table row, a derating, a floor or a supplier, and the vessel built on it looks the same in all four cases.

## Why an override is the honest input under pressure

The pressure derating is recorded as a customary rule of thumb whose published form has not been checked against a source, and at high pressure it produces values a floor has to catch. The engine's own floored warning says a vendor K is the only honest input there.

So the override is not a convenience for advanced users. It is the intended route wherever the derating bites, and the table is the fallback for when no supplier figure exists yet.

## What it will not do for you

An override of zero is refused, with the alternative named: "kOverride must be a positive K in ft/s when it is given (got 0); leave it out to use the published table". A K of zero would give a settling velocity of zero and an infinite required area.

Leaving the override out entirely is different from giving it a value that means nothing. Out means use the table. Zero means a number was supplied and it is not usable.

## What nothing checks

The engine accepts the override and never compares it with the table value at that pressure. A vendor K of 0.9 would be taken silently, sized with, and reported as typed with no warning attached.

The base rows run from 0.180000 to 0.550000, so a typed figure far outside that span is either unusual hardware or a transcription error, and nothing in the output tells the two apart. The reconciliation is the reviewer's job.

## The mistake

Typing a supplier's number for one arrangement against another's service. A vane pack figure quoted at a clean gas duty, entered for a drum in fouling service, arrives as a perfectly formed typed K with no warning, and sizes a vessel much smaller than the bare-drum row would.

## Exercise

Write the six fields an override returns and say what each tells a reviewer. Then give the message for an override of zero, say how it differs from leaving the override out, and name the check the engine does not perform on a typed K.
