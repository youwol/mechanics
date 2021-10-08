import { Wc, WcEnvelope } from "../lib/failure"

test('Test fault-system-envelope', () => {
    const wc = new Wc
    wc.subdivision = 50
    wc.S1 = 10
    wc.S3 = 5
    // set wc parameters if necessary...
    
    const f = new WcEnvelope(wc)
    const n = 10
    f.setAxis('x', 'S2',       {n, min: 5, max:10})
    f.setAxis('y', 'friction', {n, min: 0, max:1})
    f.setAxis('z', 'lambda'  , {n, min: 0, max:1})
    f.property = 'nbDistortionalPlanes'
    const cube = f.run()
    expect(cube).toBeDefined()
    console.log(cube)
})
