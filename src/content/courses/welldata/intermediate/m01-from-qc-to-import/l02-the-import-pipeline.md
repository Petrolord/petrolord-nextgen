# The import pipeline

The pipeline is three stages and it runs in one direction. Text becomes curves, curves become logs, logs become registry rows. Each stage owns a narrow job, does that job completely, and hands the next stage something it can trust. This lesson names the stages, says what each one owns, and says what it refuses to do so that the next stage can.

## Stage one: parse

The parser takes the raw text of a LAS file and returns a structured object. It splits the file on its tilde lines, reads the version section, then the well section, then the curve contract, then the data block. It streams every numeric token after the data header into one flat list and reshapes that list by the curve count, which is why wrapped and unwrapped files come out identical. It replaces the declared null value with NaN as it tokenises.

What the parser hands on, per curve, is the mnemonic, the declared unit, the description, the samples as a numeric array with NaN where data is missing, the sample count and the null count. Alongside that it hands on the LAS version, the wrap flag, the null value and the well header entries.

What the parser refuses to do is more interesting. It does not convert anything. The depth column comes out of the parser in feet if the file was written in feet, and the sonic comes out in microseconds per foot if that is how it was recorded. This is deliberate and it is enforced. The parser's output is validated against published reference goldens, and those goldens pin raw parse fidelity. A parser that converted would no longer be checkable against them, and you would lose the one stage in the pipeline whose correctness can be demonstrated against an outside authority.

So the parser's contract is: exactly what the file says, structured, with nulls marked. Nothing added, nothing improved.

## Stage two: prepare

This is the stage that gives the tier its name, and the four decisions from the previous lesson all live here.

Prepare takes the parsed file and produces a list of logs. Working in order, it reads the depth curve's declared unit and looks up a metres-per-unit factor. If the lookup fails it throws, and the import stops with a message naming the unrecognised unit and pointing at the ~Curve section. If the lookup succeeds it converts the depth column, then takes the first and last converted values as the start and stop depths in metres, and runs the uniformity test on the converted column to get a step in metres or a null.

Then it walks every curve, and it makes two independent decisions about each one from two different inputs.

Conversion is decided by the unit string alone, looked up in a fixed table rather than worked out by dimensional analysis. A curve whose declared unit appears in the table is converted to the internal unit. A curve whose unit does not appear passes through unchanged with its converted flag left false, and that is true even of a unit that plainly carries a length, a caliper in inches being the obvious case. The importer converts what it recognises rather than everything it arguably should, which is a limitation worth being able to state out loud.

Kind is decided by the mnemonic alone, upper-cased and matched against fixed name lists, with the declared unit never consulted. The index curve is the exception, and it is stamped as the depth curve because it is first in the file rather than because its mnemonic was recognised.

The output per log is the mnemonic, the description, the unit it now carries, the unit it came from, a converted flag, a kind or null, the samples, the sample and null counts, the start and stop depths in metres, the step in metres or null, and a provenance record. For a converted curve the provenance carries the unit it was converted from, the unit it was converted to, and the factor used. For an unconverted curve it carries the file-level facts alone.

That provenance record is the point of the whole stage. A converted number with no record of the conversion is a number nobody can audit. A converted number carrying its source unit and its factor can be checked, reversed, and explained to whoever asks in two years.

## Stage three: register

The third stage writes what prepare produced into the registry: one row per log, plus the well header. The index curve is stored as a log row in its own right, because for a file with no uniform step that stored depth column is the only depth reference the other curves have. There is no arithmetic at this stage. There is validation, identity resolution, and writing.

The well header itself is a suggestion rather than a transcription. The importer proposes a name, a unique well identifier, a kelly bushing elevation and a total depth read from the header sections, converting the elevation and depth to metres where their declared units say feet, and passing them through with a note where the unit is unrecognised. Surface coordinates are not in most LAS files and stay manual. A person confirms all of it before it is written.

## The rule that runs through all three

Each stage adds exactly one kind of value and records what it added. The parser adds structure. Prepare adds units, vocabulary and a uniformity verdict. Register adds identity and persistence. Nothing is added in two places, and nothing is added invisibly.

That is why an import failure is nearly always diagnosable in a minute. If the numbers are wrong but structured, look at prepare. If the structure is wrong, look at the file and the parser error, which names a line. If the data is right and the well is a duplicate, look at register.

## Exercise

A LAS file arrives with its depth column in feet and its sonic in microseconds per foot. Write down what the depth column and the sonic curve each look like after stage one, after stage two, and after stage three, giving the unit at each point. Then say which stage would reject the file if its depth unit had been declared as something unrecognised, and what a person would be told.

Self-check: after stage one the depth column is still in feet and the sonic is still in microseconds per foot, because the parser converts nothing and its goldens pin that. After stage two the depth column is in metres and the sonic is in microseconds per metre, both flagged as converted, each carrying its source unit and factor in provenance. After stage three both are registry rows in those same converted units with that provenance attached. An unrecognised depth unit is rejected in stage two, at the factor lookup, before any conversion is attempted, and the message names the unrecognised unit and sends the reader to the ~Curve section.
