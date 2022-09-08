import { Envelope2D } from "../envelopes/Envelope2D"
import { RemoteFunction, SurfaceType } from "./types"
import { FaultSystem } from "./FaultSystem"

/**
 * @category Envelope
 */
export class FaultSystemEnvelope2D extends Envelope2D {
    constructor() {
        super()
        const fs = new FaultSystem()
        this.setAlgo(fs)
    }

    addSurface(surface: SurfaceType) {
        this.system.addSurface(surface)
    }

    set remote(r: RemoteFunction) {
        (this.getAlgo() as FaultSystem).remote = r
    }

    private get system() { return this.getAlgo() as FaultSystem }
}
