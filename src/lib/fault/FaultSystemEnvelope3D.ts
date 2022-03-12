import { Serie } from "@youwol/dataframe"
import { Envelope3D } from "../envelope"
import { GeneratorType, SurfaceType } from "../types"
import { generatorFromSurfaces } from "./common"

/**
 * @category Envelope
 */
export class FaultSystemEnvelope3D extends Envelope3D {
    private surfaces_: SurfaceType[] = []
    private gen: GeneratorType = undefined

    addSurface(surface: SurfaceType) {
        this.surfaces_.push(surface)
    }

    run(): Serie {
        if (this.gen === undefined) {
            this.gen = generatorFromSurfaces(this.surfaces_)
            this.getAlgo().setNormalsAndArea( this.gen )
        }
        return super.run()
    }
}
