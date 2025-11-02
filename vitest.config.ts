import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineConfig({
	test: {
		typecheck: { enabled: false },
		coverage: { reporter: ['lcov', 'text'], reportsDirectory: 'tests/coverage', include: ['src'], exclude: ['src/index.ts', 'src/@types'] },
		outputFile: 'coverage/sonar-report.xml'
	},
	resolve: {
		alias: [{ find: '@/', replacement: fileURLToPath(new URL('./', import.meta.url)) }]
	}
});

export default config;