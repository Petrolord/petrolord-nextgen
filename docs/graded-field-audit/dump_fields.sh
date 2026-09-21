#!/usr/bin/env bash
# Dump every live capstone field from a LOCAL scratch replay of NextGen main.
# Never point this at production: it reads a docker container by name only.
#   SCRATCH=b5-scratch ./dump_fields.sh > caps.json
set -euo pipefail
C=${SCRATCH:-b5-scratch}
docker exec "$C" psql -U postgres -tAq -c "
select coalesce(jsonb_agg(jsonb_build_object(
  'app', c.app_slug, 'tier', c.tier, 'title', c.title, 'dataset', c.dataset,
  'prompt', c.prompt, 'fields', c.fields) order by c.app_slug,
  array_position(array['beginner','intermediate','advanced'], c.tier)), '[]'::jsonb)
from public.academy_capstones c join public.academy_apps a on a.slug = c.app_slug
where c.active and a.status = 'available'"
