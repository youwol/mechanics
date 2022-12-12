// import { Vector } from '@youwol/dataframe'
import { generateSphere, Surface } from '@youwol/geometry'
import { vec } from '@youwol/math'
import { clone, dot, scale, Stress, sub, Vector } from '../types'
import { GeneratorType, SurfaceType } from './types'

/**
 * @hidden
 * @category Envelope
 */
export function generatorFromSurfaces(surfaces: SurfaceType[]): GeneratorType {
    const r: GeneratorType = {
        normals: [],
        areas: [],
        positions: [],
    }

    surfaces.forEach((surface) => {
        const surf = Surface.create(surface.positions, surface.indices)
        surf.forEachFace((face) => {
            r.normals.push(face.normal)
            r.areas.push(face.area)
            r.positions.push(face.barycenter)
            // console.log(face.normal)
        })
    })

    return r
}

/**
 * Uniformly generate normals and areas on a sphere.
 * @param subdivision The number of subdivision for the sphere
 * @see [sphere](https://youwol.github.io/geometry/dist/docs/modules.html#sphere) in `@youwol/geometry`
 *
 * @hidden
 * @category Envelope
 */
export function generator(subdivision: number): GeneratorType {
    const { positions, indices } = generateSphere(subdivision)
    const P = positions as Float32Array

    // Compute the normals ...

    const normals: Array<[number, number, number]> = []
    const areas: Array<number> = []

    const idx = 0
    for (let i = 0; i < P.length / 9; i += 9) {
        const p1 = [P[i], P[i + 1], P[i + 2]]
        const p2 = [P[i + 3], P[i + 4], P[i + 5]]
        const p3 = [P[i + 6], P[i + 7], P[i + 8]]
        const v1 = vec.create(p1, p2) as vec.Vector3
        const v2 = vec.create(p1, p3) as vec.Vector3
        const n = vec.cross(v1, v2)
        const l = vec.norm(n)
        normals.push([n[0] / l, n[1] / l, n[2] / l])
        areas.push(Math.abs(l) * 0.5)
    }

    return {
        normals,
        areas,
    }
}

/**
 * Uniformly generate normals and areas on a sphere.
 * @param subdivision The number of subdivision for the sphere
 * @see [this paper](https://scholar.rose-hulman.edu/cgi/viewcontent.cgi?article=1387&context=rhumj)
 *
 * @hidden
 * @category Envelope
 */
export function generatorKogan(subdivision: number): GeneratorType {
    const sphericalCoordinates = (x: number, y: number) => [
        Math.cos(x) * Math.cos(y),
        Math.sin(x) * Math.cos(y),
        Math.sin(y),
    ]

    const NX = (n: number, x: number) => {
        const pts = []
        const start = -1 + 1 / (n - 1)
        const increment = (2 - 2 / (n - 1)) / (n - 1)
        for (let j = 0; j < n; ++j) {
            // <---------------- CHECK include n or not (should be ok)
            const s = start + j * increment
            pts.push(
                sphericalCoordinates(
                    s * x,
                    (Math.PI / 2) *
                        Math.sign(s) *
                        (1 - Math.sqrt(1 - Math.abs(s))),
                ),
            )
        }
        return pts
    }

    const normals = NX(subdivision, 0.1 + 1.2 * subdivision)

    return {
        normals,
        areas: new Array(normals.length).fill((4 * Math.PI) / normals.length),
    }
}

/**
 * @hidden
 * @category Envelope
 */
export class TriangleUtils {
    private normal_: Vector = undefined

    static create(normal: Vector) {
        const tu = new TriangleUtils()
        tu.setNormal(normal)
        return tu
    }

    /**
     * @param t The traction vector
     */
    shearComponent(t: Vector): Vector {
        return sub(clone(t), this.normalComponent(t)) //t.clone().sub(this.normalComponent(t)).scale(-1.0)
    }

    /**
     * @param t The traction vector
     */
    normalComponent(t: Vector): Vector {
        const n = this.normal_
        return scale(n, -dot(t, n)) //n.scale(-t.dot(n))
    }

    /**
     *
     * @param stress
     * @returns The shear stress (ts) and the normal stress (tn)
     */
    normalAndShearStress(stress: Stress): { ts: Vector; tn: Vector } {
        const n = this.normal_
        const t = [
            stress[0] * n[0] + stress[1] * n[1] + stress[2] * n[2],
            stress[1] * n[0] + stress[3] * n[1] + stress[4] * n[2],
            stress[2] * n[0] + stress[4] * n[1] + stress[5] * n[2],
        ] as Vector
        const tn = this.normalComponent(t)
        const ts = sub(clone(t), tn)
        // console.log(ts)
        return {
            ts,
            tn,
        }
    }

    setNormal(n: Vector) {
        this.normal_ = n

        const TINY_ANGLE_ = 1e-7
        const x3 = [n[0], n[1], n[2]] as vec.Vector3
        if (vec.norm(x3) < TINY_ANGLE_) {
            throw new Error(
                'Cannot calculate element normal. Elt must have a very odd shape.',
            )
        }
        vec.normalize(x3)

        let x2 = vec.cross([0, 0, 1], x3) //Vector3.fromCoords(0, 0, 1).cross(x3)
        if (vec.norm(x2) < TINY_ANGLE_) {
            x2 = [0, 1, 0]
        }
        vec.normalize(x2)

        const x1 = vec.cross(x2, x3)
        vec.normalize(x1)

        return true
    }
}
