/** Versioned, project-owned delivery; provenance and sizes: docs/cinematic-assets.json. */
function asset(name: string) {
  return { src: `/media/cinematic/${name}-v1.mp4`, poster: name === "launch" ? `/media/cinematic/${name}-v1.webp` : `/media/cinematic/${name}-omnipresence-v1.webp` };
}
export const cinematicAssets = {
  hero: asset("hero"), proof: asset("proof"), packages: asset("packages"), process: asset("process"),
  security: asset("security"), launch: asset("launch"),
} as const;
