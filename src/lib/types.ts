import { Serie } from "@youwol/dataframe"

export interface Algorithm {
    run(): void
    setNormalsAndArea(na: GeneratorType): void
}

export type GeneratorType = {
    normals: Array<[number,number,number]>,
    areas  : Array<number>
}

export type SurfaceType = {
    positions: Serie,
    indices  : Serie
}

export const validPropertyNames = [
    'nbDistortionalPlanes', 
    'nbVolumetricPlanes', 
    'distortional', 
    'volumetric', 
    'strain'
]
