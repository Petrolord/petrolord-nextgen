# The section structure

A LAS file is a sequence of named sections, and every section announces itself with a line whose first non-blank character is a tilde. Learn the section map and you can navigate any LAS file by eye, which is a genuinely useful field skill: when an import fails, the first diagnostic step is always to open the file and look at its tilde lines.

## The section map

The letter after the tilde identifies the section; the rest of the title line is free text that writers often pad with dashes.

* `~V` is the version section: `VERS` and `WRAP`, as covered in the previous lesson.
* `~W` is the well information section: start and stop depths, the step, the NULL value, and the well's identity (name, company, field, location, service company, date, unique well identifier).
* `~C` is the curve section: one line per data column, in column order. This is the contract that tells a reader how many columns the data block has and what each one means.
* `~P` is the parameter section, optional: job parameters such as the kelly bushing elevation, mud properties, or anything else the logging engineer recorded.
* `~O` is the other section, optional: free text with no defined grammar.
* `~A` is the ASCII data section: the numbers themselves. It must come last, because everything after the `~A` title line is data.

Here is the real skeleton of `basic_20.las`, exactly as the tilde lines appear in the file:

```
~Version ---------------------------------------------------
~Well ------------------------------------------------------
~Curve Information -----------------------------------------
~Params ----------------------------------------------------
~Other -----------------------------------------------------
~ASCII -----------------------------------------------------
```

Only the first letter after the tilde is load-bearing. `~Version`, `~VERSION` and `~V` name the same section, and the trailing dashes are decoration.

## Rules a reader relies on

Three structural rules keep the format parseable, and the app's parser enforces each of them with a plain, line-numbered error rather than a guess.

First, comments and blanks. Lines starting with `#` are comments and blank lines are ignored inside header sections. The quirky teaching file opens with one before any section starts:

```
# Exported by a legacy vendor tool - expect rough edges below
```

Comments and blank lines may appear before the first section; any other content there means the file is not LAS at all, and the parser says so.

Second, one data section. There must be exactly one `~A` block. Two of them mean a corrupt or concatenated file, and the parser refuses it outright rather than picking one.

Third, data is terminal. Once the reader crosses the `~A` title line, everything that follows is data, even a line that happens to start with a tilde. There is no way to "close" the data section and resume headers. This is why `~A` must be the last section: the format leaves no way back.

## How the parser walks the file

The engine behind this app splits the file into sections in a single pass: each tilde line starts a new section, header lines accumulate under the current section with their line numbers (so errors can point at the exact line), and the `~A` section keeps every raw line for the tokeniser. It then reads `~V` first, `~W` second (the NULL value lives there and is needed before any data can be interpreted), `~C` third (the column contract), and the data last. That reading order is worth internalising because it is also the right order to inspect a suspect file by hand: version, well, curves, then data.

## What optional really means

`~P` and `~O` are optional, and the teaching set proves it: `basic_20.las` carries both (a `~Params` section with the kelly bushing elevation and an `~Other` note), while `wrapped_12.las` carries neither and jumps straight from `~Curve Information` to `~ASCII`. A reader must not require them, and metadata that matters downstream should never live only in `~O`, because nothing there has defined structure.

## Exercise

Without looking back, write down the six section letters in the order the reference file uses them, mark which two are optional, and state the rule about what happens after `~A`. Self-check: V, W, C, P, O, A; the optional pair is `~P` and `~O`; after the `~A` title line everything is data and no further section can begin. Finally, name the two sections a parser must have read before it can correctly interpret a single data value, and why. Self-check: `~W` for the NULL value that flags missing data, and `~C` for the number and order of columns.
