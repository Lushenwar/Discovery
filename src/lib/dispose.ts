import { Texture, type Material, type Mesh, type Object3D } from 'three';

/**
 * Fully dispose a loaded scene graph: geometries, materials, and their texture
 * maps (material.dispose() does NOT free maps — walk them explicitly).
 */
export function disposeSceneGraph(root: Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m: Material) => {
      Object.values(m).forEach((v) => {
        if (v instanceof Texture) v.dispose();
      });
      m.dispose();
    });
  });
}
