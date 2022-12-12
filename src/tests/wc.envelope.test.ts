import { WcEnvelope3D } from "../lib"

test('fault-system-envelope', () => {
    const f = new WcEnvelope3D(50)
    f.wc.S1 = 10
    f.wc.S3 = 5

    const n = 10
    f.setAxis('x', 'S2',       {n, min: 5, max:10})
    f.setAxis('y', 'friction', {n, min: 0, max:1})
    f.setAxis('z', 'lambda'  , {n, min: 0, max:1})
    f.property = 'nbDistortionalPlanes'
    const cube = f.run()
    expect(cube).toBeDefined()
    console.log(cube)
})
