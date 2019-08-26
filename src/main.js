// const chalk = require('chalk')
const program = require('commander')
const version = require('./utils/constants').version

program
    .version(version, '-v --version')
    .usage('<command> [option]')


program
    .command('create <app-name>')
    .description('create a vue project by ark-cli')
    .option('-p, --preset <presetName>', 'Skip promtsand ')
    .action((name, cmd) => {
        // console.log(chalk.red(` install ${name}`))
        let opt = cleanArgs(cmd)
        console.log(opt)
        if (process.argv.includes('-g') || process.argv.includes('--git')) { // add git
            opt.forceGit = true
        }
        require('./lib/create')(name, opt)
    })

program
    .parse(process.argv)

function camelize (str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        console.log(key, 'key')
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    })
    return args
}
