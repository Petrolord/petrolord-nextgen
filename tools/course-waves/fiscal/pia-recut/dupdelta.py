import json,os,sys,tempfile,io,contextlib
sys.path.insert(0,'/root/dc-wavekit'); import dupaxes
tier,L=sys.argv[1],{'beginner':'b','intermediate':'i','advanced':'a'}[sys.argv[1]]
K='tools/course-waves/fiscal/pia-recut'
served=json.load(open(f'{K}/served_fiscal.json'))
man=json.load(open(f'src/content/courses/fiscal/{tier}/manifest.json'))
d=tempfile.mkdtemp()
for m in [(x['key'],f"ec2{L}_{x['key'][:3]}.json",'module') for x in man['modules']]+[(None,f'ec2{L}_exam.json','final')]:
    rows=sorted([r for r in served if r['tier']==tier and r['scope']==m[2] and r['module_key']==m[0]],key=lambda r:r['ord'])
    json.dump([{'prompt':r['prompt'],'options':r['options'],'answer':r['answer_index'],'explanation':r['explanation']} for r in rows],open(os.path.join(d,m[1]),'w'))
with contextlib.redirect_stdout(io.StringIO()):
    a,_=dupaxes.run(d,0.45,f'ec2{L}'); b,_=dupaxes.run(f'{K}/banks',0.45,f'ec2{L}')
base={(x[1],x[3],x[4]):x[0] for x in a}
n=0
for v,axis,sc,x,y in b:
    if (axis,x,y) not in base or v>base[(axis,x,y)]+1e-9: n+=1; print('NEW/WORSE',round(v,2),axis,x,y,base.get((axis,x,y)))
print(f'dupdelta {tier}: baseline {len(a)} pairs, after {len(b)}, new or worse {n}')
