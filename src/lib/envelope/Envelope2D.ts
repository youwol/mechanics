import { createTyped, Serie } from '@youwol/dataframe'
import { vec } from '@youwol/math'
import { Sampler2D } from '../sampling/sampler2D'
import { validPropertyNames, Algorithm } from '../types'

/**
 * @category Envelope
 */
export abstract class Envelope2D extends Sampler2D {
    private _property: string = 'strain'
    private algo_: Algorithm = undefined

    protected getAlgo(): Algorithm {
        return this.algo_
    }
    
    protected setAlgo(algo: Algorithm) {
        this.algo_ = algo
    }

    protected getProperty() {return this._property}

    setAxis(axeName: string, property: string, 
        {n=10, min=0, max=1,reverse=false} :
        {n?: number, min?: number, max?: number, reverse?:boolean} = {}): boolean
    {
        if (this.getAlgo() === undefined) {
            throw new Error('Algo must be set before any call to setAxis')
        }
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

    run(): Serie {
        this.checkAxis()

        let total = this.sampling
        const values = createTyped(Float32Array, total, true)

        let l = 0
        this.forEach( (v: vec.IVector) => {
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
            }
        }
        return serie
    }
}
