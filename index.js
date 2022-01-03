const fs = require('fs')

function val_at(a, ncols, row, col, default_val = 1) {
    if (col < 0 || col >= ncols || row < 0 || row >= a.length/ncols) {
        return default_val
    }
    return a[row * ncols + col]
}

function parse_vals(lines) {
    let ret = []
    lines.map(line => {
        for (let i=0; i<line.length; i++) {
            ret.push(parseInt((line[i])))
        }
    })
    return ret
}


const pos = [
    [-1,-1],[-1, 0],[-1, 1],
    [ 0,-1],        [ 0, 1],
    [ 1,-1],[ 1, 0],[ 1, 1],
]
function sum_flash_effects( vals, ncols) {
    let flash_effects = new Array(vals.length).fill(0)
    let nrows = vals.length/ncols
    for (let r = 0; r < nrows; r++) {
        for (let c = 0; c < ncols; c++) {
            let flash_count = pos.reduce((sum, p) => {
                if (val_at(vals, ncols, r + p[0], c + p[1]) > 9) {
                    sum++
                }
                return sum
            }, 0)
            flash_effects[r * ncols + c] += flash_count
        }
    }
    return flash_effects
}

function zero_out_flashes (vals) {
    let count = 0
    for (let i=0; i < vals.length; i++) {
        if (vals[i] > 9) {
            vals[i] = 0
            count++
        }
    }
    return count
}

function apply_flash_effects (vals, flash_effects) {
    for (let i=0; i<vals.length; i++) {
        if(vals[i] !== 0 && flash_effects[i] !== 0) {
            vals[i] += flash_effects[i]
        }
    }
}

function increment_energy (vals) {
    for (let i=0; i<vals.length; i++) { vals[i]++ }
}

function execute_step (vals, ncols) {
    increment_energy(vals)
    let flash_effects = sum_flash_effects(vals, ncols)
    let nflashes = zero_out_flashes(vals)
    let total_flashes = nflashes
    while (nflashes > 0) {
        apply_flash_effects(vals, flash_effects)
        flash_effects = sum_flash_effects(vals, ncols)
        nflashes = zero_out_flashes(vals)
        total_flashes += nflashes
    }
    return total_flashes
}

function print_matrix (vals, ncols) {
    let nrows = vals.length/ncols
    for (let r = 0; r < nrows; r++) {
        let line = ''
        for (let c = 0; c < ncols; c++) {
            line += val_at(vals, ncols, r, c)
        }
        console.log(line)
    }
}

function part_one () {
    let lines = fs.readFileSync('./data3', 'utf8').split('\n')
    let vals = parse_vals(lines)
    let ncols = lines[0].length
    console.log('initial matrix')
    console.log('-------------')
    print_matrix(vals, ncols)
    let total_flashes = 0
    for (let i = 0; i < 100; i++) {
        total_flashes += execute_step(vals, ncols)
        console.log('')
        console.log('step', (i+1))
        console.log('-------------')
        print_matrix(vals, ncols)
    }
    console.log('total_flashes', total_flashes)
}

function part_two () {
    let lines = fs.readFileSync('./data3', 'utf8').split('\n')
    let vals = parse_vals(lines)
    let ncols = lines[0].length
    console.log('initial matrix')
    console.log('-------------')
    print_matrix(vals, ncols)
    let nflashes = 0
    let step = 1
    while (nflashes !== vals.length) {
        if (step > 350) {
            console.log('here')
        }
        console.log('step', step)
        nflashes = execute_step(vals, ncols)
        step++
    }
    console.log('all flashed at step:', step - 1)
}

if (require.main === module) {
    // part_one()
    part_two()
}
