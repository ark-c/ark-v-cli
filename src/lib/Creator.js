const EventEmitter = require('events')
const inquirer = require('inquirer')
const chalk = require('chalk')
const execa = require('execa')
const ora = require('ora') // 命令行loading
const downloadGit = require('download-git-repo') // 下载git模版

module.exports = class Creator extends EventEmitter {
    constructor(name, context) {
        super()
        this.name = name
        this.context = context
        this.run = this.run.bind(this)
    }

    async create(cliOptions = {}) {
        const anoQuestions = [
            {
                type: 'input',
                name: 'version',
                message: 'verson(v1.0.0)：',
                default: 'v1.0.0',
                validate(val) {
                    return val !== ''
                }
            },
            {
                type: 'input',
                name: 'author',
                message: 'author:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'project description:'
            },
            {
                type: 'list',
                name: 'template',
                description: 'lazy, there are some template:',
                choices: [
                    { name: 'h5', value: 'template-h5' },
                    { name: 'pc', value: 'template-pc' },
                    { name: 'nothing', value: '' }
                ]
            }
        ]
        const ans = await inquirer.prompt(anoQuestions)
        if (ans.template) {
            const gitBaseUri = require('../utils/constants').gitUri
            const writeJson = require('../utils/pkgJson')
            const hasYarn = require('../utils/env').hasYarn
            const gitUrl = `${gitBaseUri}ark-v-${ans.template}`
            const loading = ora(`fetch template from ${gitUrl}...`)
            loading.start()
            downloadGit(`direct:${gitUrl}`,
                `${this.name}`,
                { clone: true },
                async  (err) => {
                    if (err) return
                    loading.succeed()
                    delete ans.template
                    const jsonConfig = {
                        ...ans,
                        name: this.name
                    }

                    writeJson(`${this.name}/package.json`, jsonConfig)
                    await this.run('git init')
                    loading.start('node install...')
                    if (hasYarn()) {
                        await this.run('yarn install')
                    } else {
                        await this.run('npm install')
                    }
                    loading.succeed()
                    const consoleTxt = `🎉  Successfully created project ${this.name}.\n` +
                        `👉  Get started with the following commands:\n\n`
                    console.log(consoleTxt,
                        chalk.cyan(`$ cd ${this.name}\n`),
                        chalk.cyan(`$ npm run serve\n`)
                    )
                })
        }
    }

    run(command, args) {
        if (!args) {
            [command, ...args] = command.split(/\s+/)
        }
        return execa.sync(command, args, { cwd: this.context })
    }
}