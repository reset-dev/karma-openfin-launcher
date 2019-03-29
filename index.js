const execSync = require('child_process').execSync;
const fs = require('fs');

var OpenfinBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this)
  
  const cliJs = '.\\node_modules\\openfin-cli\\cli.js';
  this.name = "openfin";
  this.configFile = this._tempDir + '\\openfin.json';

  if(!fs.existsSync(cliJs)){
    throw new Error("Cannot find openfin-cli");
  }

  this._getOptions = function(url){  
    //write our config file if they passed one otherwise openfin will create one for us
    if(args.config){
      fs.writeFileSync(this.configFile, JSON.stringify(args.config));
    }
    return [cliJs,'--launch', '--config', this.configFile, '--url', url]
  }
  
  this._getCommand = function(){
    return 'node.exe'
  }

  //the openfin-cli doesn't close the window when it receives a SIGTERM
  //this is a workaround to close the window. We write a basic script
  //that uses the openfin api to close the window.
  //We could directly use the openfin api from within here but I think
  //handling sigterm would be better
  this._oldOnProcessExit = this._onProcessExit;
  this._onProcessExit = function(){
    var config = JSON.parse(fs.readFileSync(this.configFile,'utf-8'));
    var killPageContents = `<html><body><script>
      fin.desktop.Application.wrap('${config.startup_app.uuid}').terminate(); 
      fin.desktop.Application.getCurrent().close();
      </script></body></html>`;
    var killFile = this._tempDir + '\\kill.html';
    fs.writeFileSync(killFile, killPageContents);
    execSync('node.exe ' + cliJs + ' --launch ' + this.configFile + ' --url ' + killFile);
    return this._oldOnProcessExit();
  }
  
}

OpenfinBrowser.$inject = ['baseBrowserDecorator', 'args']

// PUBLISH DI MODULE
module.exports = {
  'launcher:openfin': ['type', OpenfinBrowser]
}
