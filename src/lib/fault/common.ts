import { GeneratorType, SurfaceType } from "../types"
import { facetArea, facetNormal, Surface } from "@youwol/geometry"


export function generatorFromSurfaces(surfaces: SurfaceType[]): GeneratorType {
    const r: GeneratorType = {
        normals: [],
        areas: []
    }

    this.surfaces_.forEach( surface => {
        const surf = Surface.create(surface.positions, surface.indices)
        surf.forEachFace( face => {
            r.normals.push( facetNormal(face) )
            r.areas  .push( facetArea(face) )
        })
    })

    return r
}
