# Not only the depth column

Ask most people what it means to convert a LAS file from feet to metres and they will describe a job done to one column. Take the depth curve, multiply it by 0.3048, write it back, done. That description is where the Associate tier left you, and it is where a surprising number of working data managers stop as well. It is incomplete, and the gap is the reason this module exists.

The full statement is this. An import converts every curve whose unit carries a length. The depth column is one such curve. It is not always the only one.

## What the Associate tier settled

In the beginner tier you converted feet_20 by hand. You read STRT 4900, STOP 5200 and STEP 2 out of the well section, saw the unit F, and applied the exact factor 0.3048. You also met the fact that the sonic curve in that file arrives as US/F and leaves as US/M, and you did the arithmetic for a single reading.

What you did not do was ask how the software knows. You were given the answer for one file and one curve. At this tier you are responsible for the rule, because you will meet files whose curve list is nothing like the teaching set, and a rule generalises where a memorised example does not.

## The rule the importer applies

The import layer holds a small table of curve unit conversions. Every entry maps a unit string it recognises to the internal unit it produces and the factor that gets there. When the importer walks the curves of a parsed file, it takes each curve's unit, trims the whitespace, upper-cases it, and looks it up in that table.

A hit means the curve is converted. The samples are multiplied by the factor, the curve's unit is rewritten to the internal one, and the curve is flagged as converted. The original unit is kept alongside the data as the source unit, and the factor is written into the curve's provenance, so that months later somebody can see that this particular sonic started life in US/F and was multiplied by a known number.

A miss means the curve passes through untouched. The unit stays exactly as the file wrote it, and the converted flag stays false.

That is the whole mechanism. It has no clever inference in it, and the absence of cleverness is deliberate. The unit table is a list of things the platform is confident about. Anything outside the list is handed to a human rather than guessed at, which is the same policy you met in the beginner tier when the parser refused a depth unit it did not recognise.

## A length can sit in the denominator

The idea that catches people out is that a length in a unit does not have to be the whole unit. It can be a part of it, and it can be underneath the line.

A sonic log does not report a distance. It reports how long a sound wave takes to travel a fixed distance of rock, and the fixed distance is baked into the unit. US/F means microseconds per foot. US/M means microseconds per metre. The quantity is a time divided by a length, and the length in the denominator is every bit as much a length as the one in the depth column.

So a file logged in feet carries a sonic referenced to feet, and importing that file into a metric project means the sonic has to move as well. Leave it alone and the project holds a curve labelled as a slowness whose reference length is a foot while every consumer of it assumes a metre.

There is a second consequence, and it is the one that produces genuinely wrong numbers rather than merely inconsistent labels. Because the length is in the denominator, the conversion runs the opposite way from the depth conversion. Depths in feet are multiplied by 0.3048 to become metres. A slowness per foot is divided by 0.3048 to become a slowness per metre, because a metre is the longer distance and the wave takes longer to cross it. Reaching for the depth factor out of habit and multiplying is a real failure mode, and it fails quietly, because the result is still a number that looks like a transit time.

## The unit string decides, and the mnemonic does not

Here is the part worth committing to memory, because it governs everything in the rest of this module.

The conversion decision is keyed on the unit string. It is not keyed on the mnemonic, not on the curve description, and not on the position of the curve in the file. The importer never reasons that DT is a sonic and sonics sometimes need converting. It reads US/F, finds US/F in its table, and converts. A curve called SLOWNESS with a unit of US/F would convert identically. A curve called DT with a unit of US/M would not convert at all, because US/M is already the internal unit and there is nothing to do.

The mnemonic is doing a different job entirely, one you will meet in the next module. The mnemonic decides the curve's kind, which is the importer's opinion about what sort of measurement the curve holds. Two separate questions, two separate inputs, two separate answers, computed independently on the same curve. Keeping them apart in your head is most of the work of this course.

## Why the pipeline is the right place for this

Conversions live in the import layer, never in the parser. The parser's contract is fidelity: it gives you exactly what the file said, so that its output can be checked against an independent reader. The import layer is where the file stops being a foreign document and becomes a project asset, and turning foreign units into internal ones is precisely what that transition means.

The practical upshot is that the moment to catch a unit problem is the import screen. After import, a curve wears its internal unit and looks like every other curve in the project.

## Exercise

Without looking at the file, list the questions you would ask of a curve to decide whether an import will convert it. Then say which of the following curve units you would expect an importer with the table described above to convert when reading a file logged in feet: GAPI, US/F, V/V, FT.

Self-check: the only question that decides the outcome is what the unit string is, because the conversion table is keyed on the unit alone; the mnemonic, the description and the column order are all irrelevant to it. Of the four units, US/F converts because it carries a length in its denominator, and FT converts because it is a length outright. GAPI and V/V do not, because neither contains a length in any position. Notice that you answered the whole question without knowing a single mnemonic.
