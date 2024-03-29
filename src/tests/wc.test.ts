import { generator, Wc } from '../lib'
import { maxArray } from '@youwol/math'

test('fault-system-envelope', () => {
    const f = new Wc()
    //f.subdivision = 50
    f.setNormalsAndAreas(generator(50))
    f.S1 = 10
    f.S3 = 5
    f.friction = 0.3

    const n = []
    for (let i = 0; i < 10; ++i) {
        const R = i / 9
        f.S2 = (f.S1 - f.S3) * R + f.S3
        // console.log(f.S3, f.S2, f.S1)
        f.run()
        n.push(f.nbDistortionalPlanes)
    }

    const m = maxArray(n)
    // console.log(n)
    let s = ''
    n.forEach(
        (v) => (s += Array(Math.trunc((v / m) * 12) + 1).join('*') + '\n'),
    )
    // console.log(s)
    // expect(s)

    const sol = [2125, 1103, 584, 459, 407, 412, 474, 679, 1365, 1699]
    n.forEach((v, i) => expect(v).toEqual(sol[i]))
})
