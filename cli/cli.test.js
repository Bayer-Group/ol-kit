const fs = require('fs')
const path = require('path')

describe('cli', () => {
    it('should verify app/demos/world exists', () => {
        try {
            fs.accessSync('./app/demos/world/App.js', fs.F_OK);
            fs.accessSync('./app/demos/world/index.js', fs.F_OK)
            fs.accessSync('./app/demos/world/index.html', fs.F_OK)
            expect(true).toBe(true)
        }
        catch(e) {
            console.log('app/demos/world has been borked!!')
            console.log(e)
            expect(false).toBe(true)
        }
    })
  })