import { Axis } from './axis'

/**
 * Regular sampling in 1D.
 * By default the axis is unknown
 * @example
 * ```js
 * const meca = require("@youwol/mechanics")
 * 
 * class Algo {
 *     constructor() {
 *         this.a_ = 0
 *     }
 * 
 *     set a(v) {this.a_ = v}
 *     get a()  {return this.a_}
 * 
 *     run() {
 *         console.log(this.a_)
 *     }
 * }
 * 
 * const algo = new Algo()
 * 
 * const sampler = new meca.Sampler1D()
 * sampler.configure(algo, 'x', 'a', {n: 10, min: 0, max: 1})
 * 
 * sampler.forEach( p => {
 *     algo.run()
 * })
 * ```
 * @category Sampling
 */
export class Sampler1D {
    private nbr_ = 10 ;
    private cx_: Axis = undefined
    private _verbose = false

    get verbose() {return this._verbose}
    set verbose(b: boolean) {this._verbose = b}

    checkAxis() {
        if (!this.cx_) throw new Error('X axis is not defined.')
    }

    // set sampling(n) {
    //     this.nbr_ = n ;
    //     if (this.xAxis) this.cx_.sampling = n
    // }
    
    get sampling() {return this.nbr_ ;}

    get xAxis() {return this.cx_}

    /**
     * Configure the axis as a member variable given by its name (property)
     * @param parent The object supporting the property (e.g., `object['pressure']`, where `object` is
     * the parent and `pressure` is the property)
     * @param property The property name of this derived class
     * @param params 
     * @example
     * ```js
     * const sampler = new Sampler1D()
     * sampler.configure(object, 'cohesion', {n:10, min:0, max:1, reverse:false})
     * ```
     */
    configure(parent: any, property: string, 
        {n=10, min=0, max=1,reverse=false} :
        {n?: number, min?: number, max?: number, reverse?:boolean} = {}): boolean
    {
        if (parent[property] === undefined) {
            throw new Error(`Unknown member property named ${property}`)
        }

        if (min === undefined) min = 0
        if (max === undefined) max = 1
        if (reverse === undefined) reverse = false
        if (n === undefined) n = this.nbr_
        else this.nbr_ = n

        const axis = new Axis((parent?parent:this), property, {n,min,max,reverse})
        this.cx_ = axis

        return true ;
    }

    /**
     * @example
     * ```js
     * this.forEach( (_: any) => {
     *    const value = this.compute()
     * })
     ```
     * @param cb a function callback
     */
    forEach( cb: Function ) {
        if (cb === undefined) throw new Error('Missing callback function')
        const n = this.nbr_
        const cx = this.cx_
        for (let i = 0; i < n; ++i) {
            const x = cx.update(i)
            cb(x)
        }
    }

}