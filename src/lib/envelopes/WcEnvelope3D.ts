import { Wc } from './Wc'
import { Envelope3D } from '../envelopes'
import { generator } from './utils'

/**
 * Generate a 3D regular sampling in order to compute Wc at each point, so
 * that iso-surfaces can be extracted.
 * @example
 * ```ts
 * const f = new WcEnvelope3D()
 *
 * // set wc parameters if necessary...
 * f.wc.S1 = 0.3
 *
 * const n = 10
 * f.setAxis('x', 'S1',       {n})
 * f.setAxis('y', 'friction', {n})
 * f.setAxis('z', 'lambda'  , {n})
 * f.property = 'distortional'
 * const cube = f.run()
 * ```
 * @category Envelope
 */
export class WcEnvelope3D extends Envelope3D {
    constructor(n = 30) {
        super()
        const wc = new Wc()
        wc.setNormalsAndAreas(generator(n))
        this.setAlgo(wc)
    }

    get wc(): Wc {
        return this.getAlgo() as Wc
    }
}
