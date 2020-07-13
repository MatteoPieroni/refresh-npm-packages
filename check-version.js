const { exec } = require('child_process');
const { version } = require('./package.json');

const command = 'yarn deploy:check';

exec(command, (err, stdout) => {
  if (err) {
    //some err occurred
		console.error(err);
		
		process.exit(1);
  } else {
		try {
			const isVersionString = stdout.match(/Version:(\s)+[0-9|.]+(\n)?/gm);
			const versionString = isVersionString !== null ? isVersionString[0] : null;
			
			if (typeof versionString === 'string') {
				const publishedVersion = versionString.replace(/Version:(\s)+/g, '');
				const isSameVersion = publishedVersion === version;
				
				if (!isSameVersion) {
					console.log('New version detected', version);
					return process.exit(0);
				};

				throw new Error('Skip publishing');
			}
		} catch(e) {
			console.error(e);
			process.exit(1);
		}
  }
});