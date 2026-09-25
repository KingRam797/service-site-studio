/** Pure policy shared by decorative media and its boundary tests. */
export function cinematicPolicy(input: {
  reduced: boolean; saveData: boolean; paused: boolean;
  near: boolean; visible: boolean; hidden: boolean; failed: boolean;
}) {
  const permitted = !input.reduced && !input.saveData && !input.failed;
  return {
    attach: permitted && input.near && !input.paused,
    play: permitted && input.visible && !input.hidden && !input.paused,
    release: !permitted,
  };
}
