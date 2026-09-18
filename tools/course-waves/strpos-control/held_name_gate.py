"""Lift the held-NAME gates verbatim out of a go-live and run them against a
synthetic graded key. Usage: likecontrol.py <golive.sql> <course.sql> <slug> <key>"""
import sys, re
golive, course, slug, key = sys.argv[1:]
t = open(golive).read()
start = t.index("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')")
# the two name gates: key then label, each closed by its own end if;
end = t.index("end if;", t.index("end if;", start) + 1) + len("end if;")
gate = t[start:end]
assert gate.count("unnest(array[") == 2, 'expected exactly the key gate and the label gate'
print("\\set ON_ERROR_STOP on")
print("begin;")
print(open(course).read())
print(f"""update public.academy_capstones
   set fields = '[{{"key": "{key}", "label": "synthetic", "expected": 1, "tolerance": 1}}]'::jsonb
 where app_slug = '{slug}' and tier = 'beginner';""")
print("do $gate$ declare v_graded int; v_names text; begin")
print(gate)
print("  raise notice 'GATE PASSED for %', " + f"'{key}';")
print("end $gate$;")
print("rollback;")
