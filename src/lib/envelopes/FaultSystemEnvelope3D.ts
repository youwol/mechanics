import { Envelope3D } from "../envelopes"
import { SurfaceType } from "./types"
import { FaultSystem } from "./FaultSystem"

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

    get system() { return this.getAlgo() as FaultSystem }
}
