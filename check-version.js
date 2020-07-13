const { exec } = require('child_process');
const { version } = require('./package.json');

const command = 'yarn deploy:check';
const publish = 'yarn deploy';

exec(command, (err, stdout) => {
  if (err) {
    //some err occurred
		console.error(`Error checking version: ${err}`);
		
		process.exit(1);
  } else {
		try {
			const isVersionString = stdout.match(/Version:(\s)+[0-9|.]+(\n)?/gm);
			const versionString = isVersionString !== null ? isVersionString[0] : null;
			
			if (typeof versionString === 'string') {
				const publishedVersion = versionString.replace(/Version:(\s)+/g, '');
				const isSameVersion = publishedVersion === version;
				
				if (isSameVersion) {
					console.log(`New version detected: ${version}. Publishing`);
					return exec(publish, (publishErr, publiStdout) => {
						if (publishErr) {
							console.error(`Error publishing: ${publishErr}`);

							process.exit(1);
						}

						console.log(publiStdout);
						return process.exit(0);
					});
				};

				console.log('Same version detected, skipping publish step');
				process.exit(0);
			}
		} catch(e) {
			console.error(e);
			process.exit(1);
		}
  }
});