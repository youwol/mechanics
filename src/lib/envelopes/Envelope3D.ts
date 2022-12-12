import { createTyped, Serie } from '@youwol/dataframe'
import { Sampler3D } from '../sampling/sampler3D'
import { MinMax, vec } from '@youwol/math'
import { validPropertyNames } from './types'
import { GenAlgorithm } from '../types'

/**
 * @category Envelope
 */
export class Envelope3D extends Sampler3D {
    private _property = 'strain'
    private algo_: GenAlgorithm = undefined

    protected getAlgo(): GenAlgorithm {
        return this.algo_
    }
    
    protected setAlgo(algo: GenAlgorithm) {
        this.algo_ = algo
    }

    protected getProperty() {return this._property}

    setAxis(axeName: string, property: string, 
        {n=10, min=0, max=1,reverse=false} :
        {n?: number, min?: number, max?: number, reverse?:boolean} = {}): boolean
    {
        return super.configure(this.getAlgo(), axeName, property, {n, min, max, reverse})
    }

    /**
     * @see [[Wc]] for the possible values (method with info `Accessible after each call to run()`)
     */
    set property(name: string) {
        if (validPropertyNames.includes(name) === false) { // see below for validNames...
            throw new Error(`Invalid property named ${name}. Should be in ${validPropertyNames}`)
        }
        this._property = name
    }

    getPositions(normalize = true) {
        const total = this.sampling * 3
        const values = createTyped(Float32Array, total, true)
        let l = 0

        if (normalize) {
            // get minmax of position
            const m = [new MinMax(), new MinMax(), new MinMax()]
            
            const normalize_ = (v: number, i: number) => (v-m[i].min)/(m[i].max-m[i].min) // fct

            this.forEach( p => p.forEach( (v,i) => m[i].add(v)) )
            this.forEach( p => p.forEach( (v, i) => values[l++] = normalize_(v, i)) )
        }
        else {
            this.forEach( p => p.forEach( v => values[l++] = v) )
        }

        return Serie.create({array: values as Float32Array, itemSize: 3})
    }

    run(): Serie {
        this.checkAxis()

        const total = this.sampling
        const values = createTyped(Float32Array, total, true)

        let l = 0
        this.forEach( (v: vec.Vector3) => {
            this.getAlgo().run()
            values[l++] = this.getAlgo()[this._property]
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
