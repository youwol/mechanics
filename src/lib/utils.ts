import { generateSphere } from '@youwol/geometry'
import { vec } from '@youwol/math'
import { GeneratorType } from './types'

/**
 * Uniformly generate normals and areas on a sphere.
 * @param subdivision The number of subdivision for the sphere
 * @see [sphere](https://youwol.github.io/geometry/dist/docs/modules.html#sphere) in @youwol/geometry
 * @returns
 * @category Failure
 */
export function generator(subdivision: number): GeneratorType {
    const {positions, indices} = generateSphere(subdivision)
    const P = positions as Float32Array

    // Compute the normals ...

    const normals: Array<[number,number,number]> = []
    const areas: Array<number> = []
    
    let idx = 0
    for (let i=0; i<(P as Float32Array).length/9; i+=9) {
        const p1 = [P[i  ], P[i+1], P[i+2]]
        const p2 = [P[i+3], P[i+4], P[i+5]]
        const p3 = [P[i+6], P[i+7], P[i+8]]
        const v1 = vec.create(p1,p2) as vec.Vector3
        const v2 = vec.create(p1,p3) as vec.Vector3
        const n  = vec.cross(v1,v2)
        const l  = vec.norm(n)
        normals.push([n[0]/l, n[1]/l, n[2]/l])
        areas.push(Math.abs(l) * 0.5)
    }

    return {
        normals,
        areas
    }
}
