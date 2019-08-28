const execa = require('execa')

exports.hasYarn = () => {
    try {
        execa.sync('yarn', ['--version'], {stdio: 'ignore'})
        return true
    }catch(error) {
        return false
    }
}