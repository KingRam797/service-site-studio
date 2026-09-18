"""Fresh-process export verification: blender -b --python assets/push-symbol/validate.py."""
import bpy, math, json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
asset=root/'public/brand/push-symbol.glb'
bpy.ops.import_scene.gltf(filepath=str(asset))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
required={'Diamond_Rim','Rear_Trim','Node_Commit','Node_Build','Node_Launch','Stem','Branch','Rear_Support'}
assert required.issubset({o.name for o in meshes})
triangles=0
for o in meshes:
    assert all(math.isfinite(c) for v in o.data.vertices for c in v.co)
    assert len(o.data.materials)>0
    o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
assert triangles<40000 and asset.stat().st_size<2000000
metrics={'blender':bpy.app.version_string,'meshes':len(meshes),'triangles':triangles,'bytes':asset.stat().st_size,'required_names_preserved':True,'finite_coordinates':True,'fresh_import':True}
(root/'assets/push-symbol/validation.json').write_text(json.dumps(metrics,indent=2)+'\n')
print(json.dumps(metrics))
