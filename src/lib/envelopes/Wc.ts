import { GeneratorType } from './types'
import { GenAlgorithm } from '../types'

// Note on Volumetric energy
// -------------------------
// Here we have to calibrate Ev according to Ed such that the energy
// computed from WC is the same the one from the energy itself.
//

/**
 * Get the Wc given some mechanical parameters.
 * Description will come soon...
 *
 * Initial parameters are
 * ```
 * friction = 0
 * cohesion = 0
 * lambda   = 0
 * pressure = 0
 * poisson  = 0.25
 * S1 = 10
 * S2 = 5
 * S3 = 5
 * ```
 * @category Envelope
 */
export class Wc implements GenAlgorithm {
    setNormalsAndAreas(na: GeneratorType) {
        this.normals = na.normals
        this.areas = na.areas
    }

    /**
     * Get the imposed Sigma1
     */
    get S1() {
        return this.S1_
    }
    set S1(s) {
        this.S1_ = s
    }

    /**
     * Get the imposed Sigma2
     */
    get S2() {
        return this.S2_
    }
    set S2(s) {
        this.S2_ = s
    }

    /**
     * Get the imposed Sigma3
     */
    get S3() {
        return this.S3_
    }
    set S3(s) {
        this.S3_ = s
    }

    /**
     * Get the stress ratio
     */
    get R() {
        return (this.S2_ - this.S3_) / (this.S1_ - this.S3_)
    }

    /**
     * Get the imposed friction coef
     */
    get friction() {
        return this.friction_
    }
    set friction(s) {
        this.friction_ = s
    }

    /**
     * Get the imposed cohesion
     */
    get cohesion() {
        return this.cohesion_
    }
    set cohesion(s) {
        this.cohesion_ = s
    }

    /**
     * Get the imposed lambda
     */
    get lambda() {
        return this.lambda_
    }
    set lambda(s) {
        this.lambda_ = s
    }

    /**
     * Get the imposed poisson coef
     */
    get poisson() {
        return this.poisson_
    }
    set poisson(s) {
        this.poisson_ = s
    }

    /**
     * Get the imposed pressure
     */
    get pressure() {
        return this.pressure_
    }
    set pressure(s) {
        this.pressure_ = s
    }

    /**
     * Accessible after each call to run().
     * Get the number of total fractures used for the simulation
     */
    get nbTotalPlanes() {
        return this.normals.length
    }

    /**
     * Accessible after each call to run().
     * Get the number of reactivated shear fractures
     */
    get nbDistortionalPlanes() {
        return this.dis_.n
    }

    /**
     * Accessible after each call to run().
     * Get the distortional energy associated to the reactivated fractures
     */
    get distortional() {
        return this.dis_.E
    }

    get distortionalInfo() {
        return this.dis_
    }

    /**
     * Accessible after each call to run().
     * Get the number of reactivated opening fractures
     */
    get nbVolumetricPlanes() {
        return this.vol_.n
    }

    /**
     * Get the volumetric energy
     * Accessible after each call to run().
     */
    get volumetric() {
        return this.vol_.E
    }

    /**
     * Accessible after each call to run().
     * Get the strain energy (distortional + volumetric)
     */
    get strain() {
        return this.distortional + this.volumetric
    }

    /**
     * Run the simulation using the prescribed parameters
     */
    run(): void {
        this.vol_.reset()
        this.dis_.reset()

        for (let i = 0; i < this.normals.length; ++i) {
            const N = this.normals[i]
            const area = this.areas[i]
            const l = N[0]
            const m = N[1]
            const n = N[2]
            const s1 = this.S1_
            const s2 = this.S2_
            const s3 = this.S3_
            // const S12 = (s1 - s2) * (s1 - s2)
            // const S23 = (s2 - s3) * (s2 - s3)
            // const S31 = (s3 - s1) * (s3 - s1)
            const l2 = l * l
            const m2 = m * m
            const n2 = n * n
            // const Tn = Math.sqrt(S12 * l2 * m2 + S23 * m2 * n2 + S31 * n2 * l2)
            const Sn = s1 * l2 + s2 * m2 + s3 * n2 - this.pressure_
            const Tn = Math.sqrt(
                s1 ** 2 * l2 + s2 ** 2 * m2 + s3 ** 2 * n2 - Sn ** 2,
            )

            const Co =
                Sn * this.friction_ * (1.0 - this.lambda_) + this.cohesion_
            const okShear = Tn >= Co ? true : false

            // this.poisson_ = 0 // <----------------------------------------------- DEBUG PURPOSE

            const Ed = okShear ? (1.0 + this.poisson_) * (Tn - Co) ** 2 : 0
            const Ev = (1.0 - 2.0 * this.poisson_) * (this.lambda_ * Sn) ** 2

            if (Ev > 0) {
                this.vol_.add(Ev, area)
            }

            if (okShear) {
                // as shear
                this.dis_.add(Ed, area)
            }
        }
    }

    // ----------------------------------------------------------

    private friction_ = 0
    private cohesion_ = 0
    private lambda_ = 0
    private pressure_ = 0
    private poisson_ = 0.25
    private S1_ = 10
    private S2_ = 5
    private S3_ = 5
    private vol_ = new Info()
    private dis_ = new Info()

    private normals: Array<[number, number, number]>
    private areas: Array<number>
}

class Info {
    public E = 0
    public n = 0
    public mean = 0
    public max: number = Number.NEGATIVE_INFINITY
    public array: Array<number> = []

    reset(): void {
        this.E = 0
        this.n = 0
        this.max = Number.NEGATIVE_INFINITY
        this.array = []
    }
    add(e: number, area: number) {
        const ev = area * e
        this.E += ev
        this.array.push(ev)
        this.n++
        if (ev > this.max) {
            this.max = ev
        }
        this.mean = this.E / this.n
    }
}
