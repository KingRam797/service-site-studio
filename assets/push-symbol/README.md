# Push symbol

Reference: supplied `public/brand/push2start-symbol.jpeg`. Rounded chrome diamond, three open nodes, continuous lime/cyan insert. Rear trim and support depth are inferred; there is no supplied rear reference.

Run `blender -b -t 4 --python assets/push-symbol/build.py` using Blender 4.5.3 LTS. The source generates an editable `.blend`, a GLB in `public/brand`, and six diagnostic views. Geometry budget: 40,000 triangles / 2 MB GLB. Mesh names are stable. Export applies bevel and normals modifiers and preserves vertex colors.

The browser loads the geometry, reconstructs studio lighting, and rotates the assembly with native scroll. SVG light paths are measured against actual card positions at every layout resize; scroll reveals them progressively. No scroll interception or paid video generation. Reduced-motion and data-saving visitors receive the supplied still. Rendering stops offscreen and in hidden tabs; WebGL failure retains the still. Pause control freezes motion.

`validate.py` verifies the exported GLB in a fresh Blender process. `validation.json` records the result. `review.jpg` contains front, perspective, back, left, right, and top diagnostic views; side and rear geometry is intentionally shallow.
