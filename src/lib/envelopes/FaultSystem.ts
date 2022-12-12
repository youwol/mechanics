import { GeneratorType, RemoteFunction, SurfaceType } from './types'
import { generatorFromSurfaces } from './utils'
import { dot, scale, sub, GenAlgorithm, Stress, Vector } from '../types'
import { vec } from '@youwol/math'

/**
 * @category Envelope
 */
export class FaultSystem implements GenAlgorithm {
    private surfaces_: SurfaceType[] = []
    private gen: GeneratorType = undefined
    private friction_ = 0
    private cohesion_ = 0
    private lambda_ = 0
    private poisson_ = 0.25
    private pressure_ = 0
    private maxArea_ = 0
    private nbSlipped_ = 0
    private remote_: RemoteFunction = undefined

    private dis_ = 0
    private vol_ = 0

    addSurface(surface: SurfaceType) {
        this.surfaces_.push(surface)
    }

    get friction() {
        return this.friction_
    }
    set friction(v: number) {
        this.friction_ = v
    }

    get cohesion() {
        return this.cohesion_
    }
    set cohesion(v: number) {
        this.cohesion_ = v
    }

    get lambda() {
        return this.lambda_
    }
    set lambda(v: number) {
        this.lambda_ = v
    }

    get poisson() {
        return this.poisson_
    }
    set poisson(v: number) {
        this.poisson_ = v
    }

    get pressure() {
        return this.pressure_
    }
    set pressure(v: number) {
        this.pressure_ = v
    }

    set remote(r: RemoteFunction) {
        this.remote_ = r
    }

    /**
     * Accessible after each call to run().
     * Get the distortional energy associated to the reactivated fractures
     */
    get distortional() {
        return this.dis_
    }

    /**
     * Get the volumetric energy
     * Accessible after each call to run().
     */
    get volumetric() {
        return this.vol_
    }

    /**
     * Accessible after each call to run().
     * Get the strain energy (distortional + volumetric)
     */
    get strain() {
        return this.distortional + this.volumetric
    }

    /**
     * Get the number of triangles that has slipped
     */
    get nbSlipped() {
        return this.nbSlipped_
    }

    run() {
        this.initialize()

        const mu = this.friction
        const Co = this.cohesion
        const La = this.lambda
        const Po = this.poisson
        const Pr = this.pressure

        let dis = 0
        let vol = 0
        let nb = 0

        this.gen.positions.forEach((p, i) => {
            const a = this.gen.areas[i]
            const n = this.gen.normals[i]
            const { ts, tn } = this.normalAndShearStress(n, this.remote_(p))
            const C = (tn - Pr) * mu * (1 - La) + Co

            if (ts > C) {
                const Teff = (1 + Po) * (ts - C) ** 2 // Distortional Eff
                const Seff = (1 - 2 * Po) * (La * tn) ** 2 // Volumetric   Eff
                dis += (Teff * a) / this.maxArea_
                vol += (Seff * a) / this.maxArea_
                nb++
            }
        })

        this.dis_ = dis
        this.vol_ = vol
        this.nbSlipped_ = nb
    }

    private normalAndShearStress(
        n: Vector,
        stress: Stress,
    ): { ts: number; tn: number } {
        const Sxx = stress[0]
        const Sxy = stress[1]
        const Sxz = stress[2]
        const Syy = stress[3]
        const Syz = stress[4]
        const Szz = stress[5]
        const x = n[0]
        const y = n[1]
        const z = n[2]
        const t = [
            Sxx * x + Sxy * y + Sxz * z,
            Sxy * x + Syy * y + Syz * z,
            Sxz * x + Syz * y + Szz * z,
        ] as Vector
        const tn = scale(n, -dot(t, n))
        const ts = sub(t, tn)
        return {
            ts: vec.norm(ts),
            tn: vec.norm(tn),
        }
    }

    private initialize() {
        if (this.remote_ === undefined) {
            throw new Error('Remote is not set')
        }
        if (this.gen === undefined) {
            this.gen = generatorFromSurfaces(this.surfaces_)
            this.maxArea_ = 0
            this.gen.areas.forEach((a) => {
                if (a > this.maxArea_) {
                    this.maxArea_ = a
                }
            })
        }
    }
}
