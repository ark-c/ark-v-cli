'use strict';

var create = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(appName, options) {
        var cwd, targetDir, _ref2, ok, _ref3, action;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // const cwd = 
                        console.log(appName, options);
                        cwd = options.cwd || process.cwd();
                        targetDir = path.resolve(cwd, appName || '.');

                        if (!fs.existsSync(targetDir)) {
                            _context.next = 27;
                            break;
                        }

                        if (!options.force) {
                            _context.next = 9;
                            break;
                        }

                        _context.next = 7;
                        return fs.remove(targetDir);

                    case 7:
                        _context.next = 27;
                        break;

                    case 9:
                        _context.next = 11;
                        return inquirer.prompt([{
                            type: 'confirm',
                            name: 'ok',
                            message: 'genrate the project in currentDir'
                        }]);

                    case 11:
                        _ref2 = _context.sent;
                        ok = _ref2.ok;

                        if (ok) {
                            _context.next = 15;
                            break;
                        }

                        return _context.abrupt('return');

                    case 15:
                        _context.next = 17;
                        return inquirer.prompt([{
                            type: 'list',
                            name: 'action',
                            message: 'Targe directory ' + chalk.cyan(targetDir) + ' already exists. Pick one action:',
                            choices: [{ name: 'Overwrite', value: 'overwrite' }, { name: 'Merge', value: 'merge' }, { name: 'Cancel', value: false }]
                        }]);

                    case 17:
                        _ref3 = _context.sent;
                        action = _ref3.action;

                        if (action) {
                            _context.next = 23;
                            break;
                        }

                        return _context.abrupt('return');

                    case 23:
                        if (!(action === 'overwrite')) {
                            _context.next = 27;
                            break;
                        }

                        console.log('\n Removing ' + chalk.cyan(targetDir) + '...');
                        _context.next = 27;
                        return fs.remove(targetDir);

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function create(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs-extra');
var inquirer = require('inquirer');
var path = require('path');
var chalk = require('chalk');

module.exports = function () {
    return create.apply(undefined, arguments).catch(function (err) {
        error(err);
    });
};