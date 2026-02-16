import fs from 'node:fs';
import path from 'node:path';

import lodash from 'lodash';

const { capitalize } = lodash;

// Get the feature name from command line arguments (first non-option argument)
const args = process.argv.slice(2);
const isWithMigration = args[ 1 ]?.toLowerCase() ? args[ 1 ].toLowerCase() === 'true' : false;
const rawFeatureName = args[ 0 ];

if (!rawFeatureName) {
  console.error(
    'Please provide a feature name as an argument: npm run generate:feature <name> e.g. npm run generate:feature user'
  );
  process.exit(1);
}

const featureName = rawFeatureName.toLowerCase();

// Create the feature directory path
const featureDir = path.join(process.cwd(), 'src', 'features', featureName);
const modelDir = path.join(process.cwd(), 'src', 'models', featureName);
const migrationDir = path.join(process.cwd(), 'src', 'db', 'migrations');

// Create the directory if it doesn't exist
if (!fs.existsSync(featureDir) && !fs.existsSync(modelDir)) {
  fs.mkdirSync(featureDir, { recursive: true });
  fs.mkdirSync(modelDir, { recursive: true });
  console.log(`Created directory: ${featureDir}`);
} else {
  console.log(`Directory already exists: ${featureDir}`);
}

function getCompactDateTimeUTC(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');

  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds())
  );
}

const migrationFileName = `${getCompactDateTimeUTC()}-create_${featureName}.js`;

// Define the file names
const filesInfo = [
  {
    fileName: `${featureName}.controller.js`,
    filePath: path.join(featureDir, `${featureName}.controller.js`),
  },
  {
    fileName: `${featureName}.router.js`,
    filePath: path.join(featureDir, `${featureName}.router.js`),
  },
  {
    fileName: `${featureName}.schema.js`,
    filePath: path.join(featureDir, `${featureName}.schema.js`),
  },
  {
    fileName: `${featureName}.model.js`,
    filePath: path.join(modelDir, `${featureName}.model.js`),
  }
];

if (isWithMigration) {
  filesInfo.push({
    fileName: migrationFileName,
    filePath: path.join(migrationDir, migrationFileName),
  });
}

// Create each file with content
filesInfo.forEach(({ fileName, filePath }) => {
  if (!fs.existsSync(filePath)) {
    let content = '';

    switch (fileName) {
      case `${featureName}.controller.js`:
        content = `// ${featureName}.controller.js\n\n`;
        break;
      case `${featureName}.router.js`:
        content = `import { Router } from 'express';\n\nexport const ${featureName}Router = Router();`;
        break;
      case `${featureName}.schema.js`:
        content = `import Joi from 'joi';\nimport { querySchema } from '../../common/joiSchema.js';`;
        break;
      case `${featureName}.model.js`:
        content = `const ${capitalize(featureName)} = (sequelize, DataTypes) => {\n  return sequelize.define('${featureName}', {\n    id: {\n      type: DataTypes.UUID,\n      defaultValue: DataTypes.UUIDV4,\n      allowNull: false,\n      primaryKey: true,\n    },\n  });\n};\n\nexport default ${capitalize(featureName)};`;
        break;
      case migrationFileName:
        content = `export const up = async (queryInterface, Sequelize) => {\n  await queryInterface.createTable('${featureName}', {\n    id: {\n      type: Sequelize.UUID,\n      defaultValue: Sequelize.UUIDV4,\n      allowNull: false,\n      primaryKey: true,\n    },\n  });\n};\n\nexport const down = async (queryInterface) => {\n  await queryInterface.dropTable('${featureName}');\n};`;
        break;
    }

    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
});
