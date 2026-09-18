"""Blender 4.5 LTS: blender -b -t 4 --python assets/push-symbol/build.py.
Deterministic source; XY logo plane becomes XZ in glTF, corrected by runtime.
"""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector, Matrix

ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
PUBLIC=ROOT/'public/brand'
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)

def mat(name,color,metal=.3,rough=.24,emission=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    for k,v in {'Base Color':(*color,1),'Metallic':metal,'Roughness':rough,'Emission Color':(*color,1),'Emission Strength':emission}.items(): p.inputs[k].default_value=v
    return m
chrome=mat('Chrome',(.66,.73,.8),.85)
dark=mat('Graphite',(.012,.019,.024),.5)
glow=mat('BranchGradient',(1,1,1),.2,emission=.25)
# Exportable vertex colors supply the continuous lime-to-cyan insert.
n=glow.node_tree.nodes.new('ShaderNodeVertexColor');n.layer_name='Color'
p=glow.node_tree.nodes.get('Principled BSDF')
glow.node_tree.links.new(n.outputs['Color'],p.inputs['Base Color'])
glow.node_tree.links.new(n.outputs['Color'],p.inputs['Emission Color'])

def finish(o,name,m,w=.025):
    bpy.context.view_layer.update()
    o.name=name;o.data.materials.append(m)
    if m==glow:
        a=o.data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
        for l in o.data.loops:
            y=(o.matrix_world@o.data.vertices[l.vertex_index].co).y
            t=max(0,min(1,(y+.95)/1.8))
            a.data[l.index].color=(.65*t*t,.55+.45*t,1-t,1)
    b=o.modifiers.new('Soft machined edges','BEVEL');b.width=w;b.segments=3
    o.modifiers.new('Face normals','WEIGHTED_NORMAL')
    for f in o.data.polygons:f.use_smooth=True
    return o

def rounded(h,r):
    pts=[]
    for x,y,start in [(1,1,0),(-1,1,90),(-1,-1,180),(1,-1,270)]:
        for i in range(17):
            a=math.radians(start+i*90/16);px=x*(h-r)+r*math.cos(a);py=y*(h-r)+r*math.sin(a)
            pts.append(((px-py)/math.sqrt(2),(px+py)/math.sqrt(2)))
    return pts

def ring(name,outer,inner,depth,z,m):
    n=len(outer);v=[];f=[]
    for h in [z-depth/2,z+depth/2]:
        v.extend((x,y,h) for x,y in outer);v.extend((x,y,h) for x,y in inner)
    for i in range(n):
        j=(i+1)%n
        f.extend([(i,j,2*n+j,2*n+i),(n+j,n+i,3*n+i,3*n+j),(2*n+i,2*n+j,3*n+j,3*n+i),(j,i,n+i,n+j)])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(v,[],f);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return finish(o,name,m)

ring('Diamond_Rim',rounded(1.48,.42),rounded(1.25,.33),.24,0,chrome)
ring('Rear_Trim',rounded(1.45,.40),rounded(1.27,.34),.12,-.13,dark)
for name,x,y in [('Node_Commit',-.12,.85),('Node_Build',.78,-.07),('Node_Launch',-.12,-.95)]:
    def circle(r):return [(x+r*math.cos(i*math.tau/64),y+r*math.sin(i*math.tau/64)) for i in range(64)]
    ring(name,circle(.32),circle(.175),.18,.055,glow)

def bar(name,a,b,w,m,z=.045):
    mid=(Vector(a)+Vector(b))/2
    bpy.ops.mesh.primitive_cube_add(size=1,location=(mid.x,mid.y,z))
    o=bpy.context.object;o.dimensions=(w,(Vector(b)-Vector(a)).length,.18)
    o.rotation_euler.z=-math.atan2(b[0]-a[0],b[1]-a[1])
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);finish(o,name,m)
bar('Stem',(-.12,.59),(-.12,-.69),.18,glow)
bar('Branch',(-.12,.32),(.53,.065),.18,glow,.035)
bar('Rear_Support',(-.12,-1.18),(-.12,-1.71),.12,dark,-.1)

scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=12
scene.render.resolution_x=512;scene.render.resolution_y=512;scene.render.resolution_percentage=100
scene.world.color=(.15,.15,.15);scene.view_settings.view_transform='AgX'
def aim(o):
    forward=(-o.location).normalized()
    up=Vector((0,1,0)) if abs(forward.y)<.99 else Vector((0,0,-1))
    right=forward.cross(up).normalized();up=right.cross(forward).normalized()
    o.rotation_euler=Matrix((right,up,-forward)).transposed().to_euler()
for name,pos,power,color in [('Key',(-3,4,5),650,(1,1,1)),('Cyan fill',(3,-2,4),450,(.08,.7,1)),('Back',(-2,1,-4),650,(.8,1,.6))]:
    bpy.ops.object.light_add(type='AREA',location=pos);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.size=4;o.data.color=color;aim(o)
bpy.ops.object.camera_add(location=(0,0,7));cam=bpy.context.object;cam.name='Reference_Front';cam.data.type='ORTHO';cam.data.ortho_scale=4.8;aim(cam);scene.camera=cam
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'push-symbol.blend'),compress=True)
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(PUBLIC/'push-symbol.glb'),export_format='GLB',use_selection=True,export_apply=True)
for name,pos in [('front',(0,0,7)),('perspective',(2,1,7)),('back',(0,0,-7)),('left',(-7,0,.5)),('right',(7,0,.5)),('top',(0,7,.5))]:
    cam.location=pos;aim(cam);scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True)
