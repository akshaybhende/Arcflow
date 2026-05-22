/** Deterministic PRNG for mock dashboard metrics (stable between selector runs). */
export function seededRandom(seed: number): () => number {
  let state = Math.max(1, Math.floor(seed)) % 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
