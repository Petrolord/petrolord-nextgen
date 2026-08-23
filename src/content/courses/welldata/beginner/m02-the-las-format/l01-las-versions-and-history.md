# LAS versions and history

Almost every well log you will ever import arrives as a LAS file, so before touching the parser it is worth knowing what the format is and why it looks the way it does. LAS stands for Log ASCII Standard. It was published by the Canadian Well Logging Society in the late 1980s to solve a very practical problem: log data lived on proprietary tape formats that needed vendor software to read, and geoscientists wanted to move logs between offices on floppy disks. The answer was plain, human-readable ASCII text. You can open any LAS file in a text editor, and that single design decision is why the format has outlived the floppy disk by four decades.

## The versions you will meet

Three versions matter, and only two of them matter often.

* LAS 1.2 is the original standard. It was written when line length was a real constraint, so files commonly use wrapped mode, where one depth step of data spans several physical lines. You will study a real 1.2 file later in this module.
* LAS 2.0, released in 1992, is the industry workhorse. It tidied up the header rules and made one line per depth step the normal layout. The overwhelming majority of files in circulation today, and five of this course's six teaching files, are LAS 2.0.
* LAS 3.0 exists and is richer, with support for multiple data sections and more structured metadata. In practice it is rare; many parsers, including the one behind this app, deliberately refuse it rather than half-read it. If a LAS 3.0 file ever reaches you, the practical answer is to export it as 2.0 and re-import.

## Where the version is declared

The version is not implied; it is declared in the first section of the file, the version section, which starts with a line beginning `~V`. Two entries live there: `VERS`, the standard version, and `WRAP`, which says whether the data lines are wrapped. Here are the real declarations from the reference teaching file, `basic_20.las`:

```
VERS.   2.0 : CWLS LOG ASCII STANDARD - VERSION 2.0
WRAP.   NO  : ONE LINE PER DEPTH STEP
```

And from the one 1.2 file in the teaching set, `wrapped_12.las`:

```
VERS.   1.2 : CWLS LOG ASCII STANDARD - VERSION 1.2
WRAP.   YES : MULTIPLE LINES PER DEPTH STEP
```

Read `VERS` and `WRAP` together and you know how to read everything that follows. A parser must check them first, and so should you. The importer in this app rejects `VERS` values of 3.0 or higher with a clear message instead of guessing, which is the behaviour you want from any tool that claims to manage data: refuse loudly rather than corrupt quietly.

## Why version still matters

It is tempting to treat the version line as ceremony, but two real differences hang off it.

First, wrapped data. `WRAP. YES` files place the values for one depth step across several lines. A reader that assumes one line per sample will miscount samples by a factor of two or three and silently produce garbage. The version section is the only warning you get.

Second, header conventions differ between 1.2 and 2.0 in one subtle way you will meet in the header grammar lesson: some 1.2 well-section entries place their value after the colon rather than before it. A 2.0-only reader shows you the literal word `WELL` as a well name instead of the actual well name. The teaching file `wrapped_12.las` demonstrates exactly this, and the app's parser handles it because it mirrors the same rules the industry-standard lasio library uses.

## The teaching set at a glance

The six teaching files split cleanly on the version line: `wrapped_12.las` declares 1.2 with `WRAP YES`, and the other five (`basic_20`, `feet_20`, `irregular_20`, `nullheavy_20`, `quirks_20`) declare 2.0 with `WRAP NO`. Every file in the set carries the same five curves, so any difference you find between them is a difference of format and quality, never of content. That is deliberate: this module is about reading the container, and the container is the only thing that changes.

## Exercise

Open the version sections above and answer for yourself: which teaching file must be read in wrapped mode, and what would go wrong if you read it one line per sample? Self-check: `wrapped_12.las` is the wrapped file; a line-per-sample reader would see each depth step's several physical lines as separate samples and grossly overcount them. Then state the app's policy on LAS 3.0 in one sentence. Self-check: it refuses the file with a clear message and asks for a LAS 2.0 export, rather than half-parsing a version it does not support.
