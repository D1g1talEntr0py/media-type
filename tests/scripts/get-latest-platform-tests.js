import { writeFile } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Pin to specific version, reflecting the spec version in the readme.
//
// To get the latest commit:
// 1. Go to https://github.com/w3c/web-platform-tests/tree/master/mimesniff
// 2. Press "y" on your keyboard to get a permalink
// 3. Copy the commit hash
const commitHash = '468507ee2225e049313251f04008ca0f2bc0be8f';
const urlPrefix = `https://raw.githubusercontent.com/w3c/web-platform-tests/${commitHash}/mimesniff/mime-types/resources/`;

/**
 * Creates files containing the latest platform test data
 * for `mime-types.json` and `generated-mime-types.json`.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
	if (process.env.NO_UPDATE) {
		return;
	}

	for (const file of ['mime-types.json', 'generated-mime-types.json']) {
		const response = await fetch(`${urlPrefix}${file}`);

		await writeFile(resolve(path.dirname(fileURLToPath(import.meta.url)), '../web-platform-tests', file.replace('mime', 'media')), Buffer.from(await response.arrayBuffer()));
	}
};

try {
	await main();
} catch (error) {
	console.error(error.stack);
	process.exit(1);
}