export interface GenAlgorithm {
    run(): void
}

export type Vector = [number, number, number]
export type Stress = [number, number, number, number, number, number]

/**
 * @hidden
 */
export const clone = (a: Vector): Vector => [...a]
/**
 * @hidden
 */
export const scale = (v: Vector, s: number): Vector =>
    v.map((w) => w * s) as Vector
/**
 * @hidden
 */
export const dot = (a: Vector, b: Vector): number =>
    a.reduce((acc, cur, i) => acc + cur * b[i], 0)
/**
 * @hidden
 */
export const sub = (a: Vector, b: Vector): Vector =>
    a.map((v, i) => v - b[i]) as Vector
