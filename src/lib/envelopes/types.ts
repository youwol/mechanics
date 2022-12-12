import { Serie } from '@youwol/dataframe'
import { Stress, Vector } from '../types'

/**
 * @category Envelope
 */
export type GeneratorType = {
    // TODO: use series
    normals: Vector[]
    areas: number[]
    positions?: Vector[]
}

/**
 * @category Envelope
 */
export type SurfaceType = {
    positions: Serie
    indices: Serie
}

export type RemoteFunction = (p: Vector) => Stress

/**
 * @hidden
 * @category Envelope
 */
export const validPropertyNames = [
    'nbDistortionalPlanes',
    'nbVolumetricPlanes',
    'distortional',
    'volumetric',
    'strain',
    'nbSlipped',
]
