# Metadata as identity

Everything so far has treated the header as something to check. Once a file passes QC and you publish it to the shared well registry, the header stops being a claim about a file and becomes the well's identity across the whole platform. From that moment the metadata is no longer documentation. It is a key.

## The well name is the join

The registry does not store one big object per well. It stores curves from LAS imports, formation tops picked by geologists, checkshots and time-depth pairs, deviation surveys, zone definitions, and each of these arrives from a different app on a different day. What binds them into a single well is the identity you published, with the well name doing most of the work.

Follow one number to see how far that reaches. A petrophysics interpretation loads GR, RHOB and NPHI for a well and computes shale volume and porosity over the logged interval. It needs the tops for that well to know which interval is the reservoir, and those tops were typed in somewhere else entirely, joined only by name. A correlation panel puts several wells side by side and hangs them on a shared marker, so every curve it draws was fetched by name. Seismolord builds a synthetic seismogram from the sonic and density of a well and ties it to a seismic line using that well's checkshots, again joined by name. A map places the well at its surface location and posts a value from the interpretation next to the symbol. One header entry, `WELL`, is doing the joining in all four cases.

That is why the previous lesson called identity errors quiet. A wrong `NULL` produces a mean of -3503 and someone notices. A wrong well name produces a perfectly reasonable interpretation of the wrong borehole.

## Three ways identity goes wrong

**Duplicates under name variants.** Publish one file as `KETA G1-1` and a later one as `Keta G1_1`, and the registry now holds two wells. Each looks complete and neither is. The tops sit on one, the sonic sits on the other, the correlation panel shows two wells 3 metres apart, and no error is ever raised because two different strings are simply two different wells. Case, hyphens against underscores, single against double spaces, and a trailing space you cannot see are all it takes.

**Curves on the wrong well.** The mirror image, and worse. A name that matches an existing registry entry attaches the new curves to that well immediately. If the header was wrong, or if you resolved a partial name to the closest-looking match, the borehole now carries logs it never produced, and every downstream product built on it is wrong while looking entirely healthy.

**Provenance lost.** Six months later someone asks why the net pay in this zone changed. If nobody recorded which file each curve came from, the question has no answer, and the only honest response is to re-import everything and hope the source files still exist. The import already writes a provenance record for each curve, carrying the LAS version, the wrap mode, the declared null value and the source file name, so keeping that filled in costs nothing and repays itself the first time anyone asks.

## The beginner discipline

Three rules cover almost all of it.

Resolve the well name against the registry **before** publishing, not after. Look up what is already there, decide deliberately whether this file belongs to an existing well or creates a new one, and make that decision once while you still have the file in front of you. Splitting a wrongly merged well later is far harder than never merging it.

Keep the source file name in provenance, along with the null value and version the import recorded. It is the thread back from any published number to the bytes it came from.

Never silently edit header values. If the header is wrong, fix it at source and re-export, or publish with a recorded correction that says what was changed and why. A quietly retyped well name looks exactly like a correct one to everybody who reads it afterwards, including you.

## The teaching set is not one well

The six files are laid out to make this concrete, because they do not all belong together:

* `basic_20`, `feet_20`, `irregular_20` and `nullheavy_20` all give the well name KETA G1-1. In basic_20 the line reads `WELL.   KETA G1-1 : WELL`.
* `wrapped_12` gives KETA G1-2. It is a LAS 1.2 file, so its line reads `WELL.   WELL : KETA G1-2`, with the value after the colon rather than before it.
* `quirks_20` gives `KETA G1-3: THE "QUIRKY" ONE`.

Three distinct wells in the same field, in one folder, with similar names and near-identical depth ranges around 1500 m. Anyone who assumes that one folder means one well, and resolves all six imports to the well they happened to publish first, ends up with KETA G1-2 and KETA G1-3 filed as extra runs of KETA G1-1. The merged result looks plausible: five sets of curves over roughly the same interval, nothing overlapping badly enough to raise a flag.

There is a second trap in the same set. The `UWI` entries are all different, `KETA-G1-BASIC`, `KETA-G1-FEET`, `KETA-G1-IRREG` and `KETA-G1-NULLS`, even across the four files that share the well name KETA G1-1. In this set the UWI identifies the file, not the borehole, so treating it as the identity key would split one well into four. A real UWI is a proper unique identifier and outranks the name, which is exactly why you check what a given file is actually putting in that field rather than assuming.

## Exercise

You have imported basic_20 as `KETA G1-1` and are about to import feet_20. Write down the two possible decisions and the consequence of each. Self-check: publishing it as the same well merges two logging runs of one borehole, which is correct here because feet_20 carries the same well name, KETA G1-1, and it requires that its feet depths were converted to metres first; publishing under a new name because the UWI differs creates a second well that will silently split this borehole's data in every downstream app.

Then name the two teaching files you must not merge into KETA G1-1, and state in one sentence which single header entry told you so.
