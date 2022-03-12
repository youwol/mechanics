import { Wc } from './Wc'
import { GeneratorType } from '../types'
import { Envelope3D } from '../envelope'

/**
 * Generate a 3D regular sampling in order to compute Wc at each point, so
 * that iso-surfaces can be extracted.
 * @example
 * ```ts
 * const wc = new Wc
 * // set wc parameters if necessary...
 *   
 * const f = new WcEnvelope3D(wc)
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
    constructor(wc: Wc, generator: GeneratorType) {
        super()
        this.setAlgo(wc)
        this.generator = generator
    }

    set generator(gen: GeneratorType) {
        this.getAlgo().setNormalsAndArea( gen )
    }
}
