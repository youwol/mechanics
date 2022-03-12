const meca = require("../../dist/@youwol/mechanics")

class Algo {
    constructor() {
        this.a_ = 0
        this.b_ = 0
    }

    set a(v) {this.a_ = v}
    get a()  {return this.a_}

    set b(v) {this.b_ = v}
    get b()  {return this.b_}

    run() {
        console.log(this.a_ + this.b_)
    }
}

const algo = new Algo()

const sampler = new meca.Sampler2D()
sampler.configure(algo, 'x', 'a', {n: 10, min: 0, max: 1})
sampler.configure(algo, 'y', 'b', {n: 10, min: 0, max: 1})

sampler.forEach( p => {
    algo.run()
})
