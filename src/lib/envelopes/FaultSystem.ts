import { Serie } from "@youwol/dataframe"
import { GeneratorType, RemoteFunction, SurfaceType } from "./types"
import { generatorFromSurfaces, TriangleUtils } from "././utils"
import { GenAlgorithm, Stress, Vector } from "../types"
import { vec } from "@youwol/math"


/**
 * @category Envelope
 */
export class FaultSystem implements GenAlgorithm {
    private surfaces_: SurfaceType[] = []
    private gen: GeneratorType = undefined
    private friction_ = 0
    private cohesion_ = 0
    private lambda_   = 0
    private poisson_  = 0.25
    private pressure_ = 0
    private maxArea_  = 0
    private remote_: RemoteFunction = undefined

    private dis_      = 0
    private vol_      = 0

    addSurface(surface: SurfaceType) {
        this.surfaces_.push(surface)
    }

    get friction() {return this.friction_}
    set friction(v: number) {this.friction_ = v}

    get cohesion() {return this.cohesion_}
    set cohesion(v: number) {this.cohesion_ = v}

    get lambda()   {return this.lambda_}
    set lambda(v: number) {this.lambda_ = v}

    get poisson()  {return this.poisson_}
    set poisson(v: number) {this.poisson_ = v}

    get pressure() {return this.pressure_}
    set pressure(v: number) {this.pressure_ = v}

    set remote(r: RemoteFunction) {this.remote_ = r}

    /**
     * Accessible after each call to run().
     * Get the distortional energy associated to the reactivated fractures
     */
    get distortional() {return this.dis_}
     
     /**
      * Get the volumetric energy
      * Accessible after each call to run().
      */
    get volumetric() {return this.vol_}
 
     /**
      * Accessible after each call to run().
      * Get the strain energy (distortional + volumetric)
      */
    get strain() {return this.distortional + this.volumetric}

    run() {
        this.initialize()

        const mu = this.friction
        const Co = this.cohesion
        const La = this.lambda
        const Po = this.poisson
        const Pr = this.pressure
        const tu = new TriangleUtils()

        let dis = 0
        let vol = 0
        this.gen.positions.forEach( (p, i) => {
            const a = this.gen.areas[i]
            const n = this.gen.normals[i]
            tu.setNormal(n)
            const {ts, tn} = tu.normalAndShearStress( this.remote_(p) )
            const tts = vec.norm(ts)
            const ttn = vec.norm(tn)
            const C = (ttn-Pr)*mu*(1.-La) + Co
            if (tts>C) {
                const Teff = (1+Po)*(tts-C)**2    // Distortional Eff
                const Seff = (1-2*Po)*(La*ttn)**2 // Volumetric Eff
                dis += Teff*a/this.maxArea_
                vol += Seff*a/this.maxArea_
            }
        })
        this.dis_ = dis
        this.vol_ = vol
    }

    private initialize() {
        if (this.remote_ === undefined) {
            throw new Error('Remote is not set')
        }
        if (this.gen === undefined) {
            this.gen = generatorFromSurfaces(this.surfaces_)
            this.maxArea_ = 0
            this.gen.areas.forEach( a => {
                if (a>this.maxArea_) this.maxArea_ = a
            })
        }
    }
}
