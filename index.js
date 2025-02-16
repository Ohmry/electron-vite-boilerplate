#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function inquery() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectNameAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Project Name:',
                    default: 'electron-vite-project'
                }
            ]);
            const projectPath = path_1.default.resolve(process.cwd(), projectNameAnswer.projectName);
            if (fs_1.default.existsSync(projectPath)) {
                if (fs_1.default.statSync(projectPath).isDirectory()) {
                    const overwriteAnswer = yield inquirer_1.default.prompt([
                        {
                            type: 'confirm',
                            name: 'overwrite',
                            message: 'The directory already exists. Do you want to overwrite all files related to project initialization in the folder?',
                            default: true
                        }
                    ]);
                    if (!overwriteAnswer.overwrite) {
                        process.exit();
                    }
                }
                else {
                    const overwriteAnswer = yield inquirer_1.default.prompt([
                        {
                            type: 'confirm',
                            name: 'overwrite',
                            message: 'The file already exists. Do you want to delete it and create the project?',
                            default: true
                        }
                    ]);
                    if (!overwriteAnswer.overwrite) {
                        process.exit(1);
                    }
                }
            }
            const authorNameAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'author',
                    message: 'Author:',
                    default: 'anonymous'
                }
            ]);
            const versionAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'version',
                    message: 'Version:',
                    default: '1.0.0'
                }
            ]);
            const descriptionAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'description',
                    message: 'Description:',
                    default: 'Electron-Vite application with Typescript'
                }
            ]);
            const homepageAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'homepage',
                    message: 'Homepage:'
                }
            ]);
            const licenseAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'license',
                    message: 'License',
                    choices: [
                        'MIT',
                        'Apache-2.0',
                        'GPL-3.0',
                        'BSD-3-Clause',
                        'None'
                    ]
                }
            ]);
            const dependenciesAnswer = yield inquirer_1.default.prompt([
                {
                    type: 'checkbox',
                    name: 'dependencies',
                    message: 'Dependencies',
                    choices: [
                        { name: 'Sass', value: 'sass' },
                        { name: 'Bootstrap Icons', value: 'bootstrap-icons' },
                        { name: 'FlatIcon Uicons', value: '@flaticon/flaticon-uicons' }
                    ],
                    default: ['sass']
                }
            ]);
            return {
                projectName: projectNameAnswer.projectName,
                dependencies: dependenciesAnswer.dependencies,
                author: authorNameAnswer.author,
                description: descriptionAnswer.description,
                homepage: homepageAnswer.homepage,
                license: licenseAnswer.license,
                version: versionAnswer.version
            };
        }
        catch (e) {
            return undefined;
        }
    });
}
function createReadme(packageJson) {
    return `
  # ${packageJson.name}
  ${packageJson.description}

  ### Initialize
  \`\`\`bash
  $ npm install
  \`\`\`

  ### Run
  \`\`\`bash
  $ npm run dev
  \`\`\`

  ### Build
  \`\`\`bash
  # For windows
  $ npm run build:win

  # For macOS
  $ npm run build:mac

  # For Linux
  $ npm run build:linux
  \`\`\`
  `.trim();
}
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquery();
        if (answers === undefined) {
            console.log();
            console.log(' 💀 Aborted!');
            console.log();
            return;
        }
        const dirName = answers.projectName.toLowerCase().replace(/\s+/g, '-');
        const projectPath = path_1.default.resolve(process.cwd(), dirName);
        const templatePath = path_1.default.resolve(__dirname, 'template');
        console.log(templatePath);
        if (fs_1.default.existsSync(projectPath) && !fs_1.default.statSync(projectPath).isDirectory()) {
            fs_1.default.rmSync(projectPath);
        }
        fs_1.default.mkdirSync(projectPath, { recursive: true });
        fs_1.default.cpSync(templatePath, projectPath, { recursive: true });
        const packageJsonPath = path_1.default.join(projectPath, 'package.json');
        if (fs_1.default.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
            packageJson.name = answers.projectName;
            packageJson.version = answers.version;
            packageJson.description = answers.description;
            packageJson.author = answers.author;
            packageJson.homepage = answers.homepage;
            packageJson.license = answers.license;
            if (answers.dependencies.includes('sass')) {
                packageJson.devDependencies['sass'] = '^1.83.1';
                packageJson.devDependencies['concurrently'] = '^9.1.2';
                packageJson.scripts['sass'] = 'sass src/renderer/assets/sass:src/renderer/assets/css --style compressed';
                packageJson.scripts['sass:watch'] = 'sass -w src/renderer/assets/sass:src/renderer/assets/css --style compressed';
                packageJson.scripts['dev'] = 'concurrently --kill-others-on-fail "npm run sass:watch" "electron-vite dev"';
            }
            if (answers.dependencies.includes('bootstrap-icons')) {
                packageJson.dependencies['bootstrap-icons'] = '^1.11.3';
            }
            if (answers.dependencies.includes('@flaticon/flaticon-uicons')) {
                packageJson.dependencies['@flaticon/flaticon-uicons'] = '^3.3.1';
            }
            fs_1.default.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            // Create Readme.md
            const readme = createReadme(packageJson);
            const readmePath = path_1.default.join(projectPath, 'README.md');
            if (fs_1.default.existsSync(readmePath)) {
                fs_1.default.rmSync(readmePath);
            }
            fs_1.default.writeFileSync(readmePath, readme);
        }
        else {
            console.error('package.json file is not exists');
        }
        console.log();
        console.log('🎉 Created your project, now start with:');
        console.log();
        console.log(` cd ${dirName}`);
        console.log(' npm install');
        console.log(' npm run dev');
        console.log();
    });
}
initialize().catch(console.error);
