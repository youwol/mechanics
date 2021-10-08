import { Axis } from './axis'
//import { Vector3 } from '@youwol/math';

/**
 * By default the 3 axis are unknown
 * @category Sampling
 */
export class Sampler3D {
    private nbr_ = 10 ;
    private cx_: Axis = undefined
    private cy_: Axis = undefined
    private cz_: Axis = undefined
    private _verbose = false
    private endYAxisCallback: Function = undefined
    private endZAxisCallback: Function = undefined

    get verbose() {return this._verbose}
    set verbose(b: boolean) {this._verbose = b}

    checkAxis() {
        if (!this.cx_) throw new Error('X axis is not defined.')
        if (!this.cy_) throw new Error('Y axis is not defined.')
        if (!this.cz_) throw new Error('Z axis is not defined.')
    }

    get sampling() {
        this.checkAxis()
        return this.cx_.sampling * this.cy_.sampling * this.cz_.sampling ;
    }

    get xAxis() {return this.cx_}
    get yAxis() {return this.cy_}
    get zAxis() {return this.cz_}

    /**
     * Configure the axis 'x', 'y' or 'z' to be defined as a member variable given by its name (property)
     * @param parent The object supporting the property (e.g., `object['pressure']`, where `object` is
     * the parent and `pressure` is the property)
     * @param axeName Either 'x', 'y' or 'z'
     * @param property The property name of this derived class
     * @param params 
     * @example
     * configure(sampler, 'x', 'cohesion', {n:10, min:0, max:1, reverse:false})
     */
     configure(parent: any, axeName: string, property: string, 
        {n=10, min=0, max=1,reverse=false} :
        {n?: number, min?: number, max?: number, reverse?:boolean} = {}): boolean
    {
        if (parent[property] === undefined) {
            throw new Error(`Unknown member property named ${property}`)
        }

        if (min === undefined) min = 0
        if (max === undefined) max = 1
        if (reverse === undefined) reverse = false

        const axis = new Axis((parent?parent:this), property, {n,min,max,reverse})
        if (axeName === 'x') this.cx_ = axis
        if (axeName === 'y') this.cy_ = axis
        if (axeName === 'z') this.cz_ = axis

        return true ;
    }

    /**
     * Called every time the y-axis is done to iterate
     */
    set finishedYAxisCallBack(cb: Function) {
        this.endYAxisCallback = cb
    }

    /**
     * Called every time the y-axis is done to iterate
     */
    set finishedZAxisCallBack(cb: Function) {
        this.endZAxisCallback = cb
    }

    /**
     * The order of iteration is
     * ```ts
     * for (x) {
     *      for (y) {
     *          for (z) {
     *              ...
     *              endZAxisCallback()
     *          }
     *          endYAxisCallback()
     *      }
     * }
     * @example
     * this.forEach( (p: number[]) => {
     *    const value = this.compute(p) // for example
     *})
     * @param cb a function callback
     */
    forEach( cb: Function ) {
        if (cb === undefined) throw new Error('Missing callback function')
        const n = this.nbr_
        const cx = this.cx_
        const cy = this.cy_
        const cz = this.cz_
        for (let i = 0; i < cx.sampling; ++i) {
            const x = cx.update(i)
            for (let j = 0; j < cy.sampling; ++j) {
                const y = cy.update(j)
                for (let k = 0; k < cz.sampling; ++k) {
                    const z = cz.update(k)
                    cb([x, y, z])
                }
                if (this.endZAxisCallback) this.endZAxisCallback()
            }
            if (this.endYAxisCallback) this.endYAxisCallback()
        }
    }

}