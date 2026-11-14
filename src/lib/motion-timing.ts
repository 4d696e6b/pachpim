// Seconds, shared by content and navigation so cursor and UI timing stay aligned.
export const motionTiming = {
  assemble: 2.9,
  erasePage: 0.65,
  buildPage: 1.25,
  eraseStagger: 0.045,
  buildStagger: 0.065,
} as const;
