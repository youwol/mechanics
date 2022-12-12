import { Envelope3D } from '../envelopes'
import { RemoteFunction, SurfaceType } from './types'
import { FaultSystem } from './FaultSystem'

/**
 * @category Envelope
 */
export class FaultSystemEnvelope3D extends Envelope3D {
    constructor() {
        super()
        const fs = new FaultSystem()
        this.setAlgo(fs)
    }

    addSurface(surface: SurfaceType) {
        this.system.addSurface(surface)
    }

    set remote(r: RemoteFunction) {
        ;(this.getAlgo() as FaultSystem).remote = r
    }

    private get system() {
        return this.getAlgo() as FaultSystem
    }
}
