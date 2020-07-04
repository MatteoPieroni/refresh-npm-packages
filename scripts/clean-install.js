const rimraf = require('rimraf');
const { exit, stdout } = require('process');
const { execSync } = require('child_process');

function cleanUpHandler(e) {
	if (e) {
		console.error(`The clean up of node_modules has failed: ${e}`);
		exit(1);
	};

	try {
		const childStdout = execSync('yarn install');

		stdout.write(childStdout);

		console.log('Clean install succesfully executed');

		exit();
	} catch(e) {
		console.error(`The install step has failed: ${e}`);
		exit(1);
	}
}

function cleanInstall() {
	rimraf('node_modules', cleanUpHandler);
}

cleanInstall();