const fs = require('fs');
const exec = require('child_process').exec;

const projectName = process.argv[2];
console.log('Generate files for project ' + projectName);

fs.access('dist/' + projectName, error => {
  if (!error) {

    if (projectName) {
      fs.readFile('package.json', 'utf-8', (err, mainData) => {
        const mainPackage = JSON.parse(mainData);

        const projectPackageJsonPath = `dist/${projectName}/package.json`;
        fs.readFile(projectPackageJsonPath, 'utf-8', (err, projectData) => {
          const projectPackage = JSON.parse(projectData);

          const checkProperties = ['description', 'keywords', 'author', 'license', 'repository', 'bugs', 'homepage'];
          checkProperties.forEach(key => {
            if (!projectPackage[key] && mainPackage[key]) {
              projectPackage[key] = mainPackage[key];
            }
          });

          fs.writeFile(projectPackageJsonPath, JSON.stringify(projectPackage), err => {
            if (err) {
              console.error(err);
            } else {
              exec('prettier --parser=json-stringify --write ' + projectPackageJsonPath,
                (error, stdout, stderr) => {
                  if (error !== null) {
                    console.log(`exec error: ${error}`);
                  }
                });
              console.log('Package.json generated');
            }
          });
        });
      });

      exec(`cp LICENSE dist/${projectName}/LICENCE`,
        (error, stdout, stderr) => {
          // console.log(`stdout: ${stdout}`);
          // console.log(`stderr: ${stderr}`);
          if (error !== null) {
            console.log(`exec error: ${error}`);
          } else {
            console.log('Licence copied');
          }
        });
    }

  } else {
    console.log(`Project ${projectName} not exist!`);
    return;
  }
});





