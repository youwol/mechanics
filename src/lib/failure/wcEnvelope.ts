import { Wc } from './Wc'
import { createTyped, Serie } from '@youwol/dataframe'
import { Sampler3D } from '../sampling/sampler3D'
import { vec } from '@youwol/math'

/**
 * Generate a 3D regular sampling in order to compute Wc at each point, so
 * that iso-surfaces can be extracted.
 * @example
 * ```ts
 * const wc = new Wc
 * // set wc parameters if necessary...
 *   
 * const f = new WcEnvelope(wc)
 * const n = 10
 * f.setAxis('x', 'S1',       {n})
 * f.setAxis('y', 'friction', {n})
 * f.setAxis('z', 'lambda'  , {n})
 * f.property = 'distortional'
 * const cube = f.run()
 * ```
 * @category Failure
 */
export class WcEnvelope extends Sampler3D {
    private _wc: Wc = undefined
    private _property: string = 'strain'

    constructor(wc: Wc) {
        super()
        this._wc = wc
    }

    setAxis(axeName: string, property: string, 
        {n=10, min=0, max=1,reverse=false} :
        {n?: number, min?: number, max?: number, reverse?:boolean} = {}): boolean
    {
        return super.configure(this._wc, axeName, property, {n, min, max, reverse})
    }

    /**
     * @see [[Wc]] for the possible values (method with info `Accessible after each call to run()`)
     */
    set property(name: string) {
        if (validNames.includes(name) === false) { // see below for validNames...
            throw new Error(`Invalid property named ${name}. Should be in ${validNames}`)
        }
        this._property = name
    }

    run(): Serie {
        this.checkAxis()

        let total = this.sampling // product of the 3 axis sampling
        //let total = Math.pow(n, 3)
        const values = createTyped(Float32Array, total, true)

        let l = 0
        this.forEach( (v: vec.Vector3) => {
            this._wc.run()
            values[l++] = this._wc[this._property]
        })

        const serie = Serie.create({array: values as Float32Array, itemSize: 1})
        serie.userData = {
            "property": this._property,
            "x": {
                "property": this.xAxis.property,
                "min": this.xAxis.min,
                "max": this.xAxis.max,
                "nbr": this.xAxis.sampling,
            },
            "y": {
                "property": this.yAxis.property,
                "min": this.yAxis.min,
                "max": this.yAxis.max,
                "nbr": this.yAxis.sampling,
            },
            "z": {
                "property": this.zAxis.property,
                "min": this.zAxis.min,
                "max": this.zAxis.max,
                "nbr": this.zAxis.sampling,
            }
        }
        return serie
    }
}

const validNames = [
    'nbDistortionalPlanes', 
    'nbVolumetricPlanes', 
    'distortional', 
    'volumetric', 
    'strain'
]