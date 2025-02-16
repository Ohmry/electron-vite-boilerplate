#!/usr/bin/env node

import inquirer from 'inquirer'
import path from 'path'
import fs from 'fs'

interface Answer {
  projectName: string
  dependencies: string[]
  author: string
  version: string
  description: string
  homepage: string
  license: string
}

interface PackageJson {
  name: string
  version: string
  description: string
  main: string
  author: string
  homepage: string
  license: string
  scripts: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

async function inquery(): Promise<Answer | undefined> {
  try {
    const projectNameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project Name:',
        default: 'electron-vite-project'
      }
    ])
  
    const projectPath = path.resolve(process.cwd(), projectNameAnswer.projectName)
    if (fs.existsSync(projectPath)) {
      if (fs.statSync(projectPath).isDirectory()) {
        const overwriteAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'The directory already exists. Do you want to overwrite all files related to project initialization in the folder?',
            default: true
          }
        ])
  
        if (!overwriteAnswer.overwrite) {
          process.exit()
        }
      } else {
        const overwriteAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'The file already exists. Do you want to delete it and create the project?',
            default: true
          }
        ])
  
        if (!overwriteAnswer.overwrite) {
          process.exit(1)
        }
      }
    }
  
    const authorNameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: 'anonymous'
      }
    ])
  
    const versionAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0'
      }
    ])
  
    const descriptionAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: 'Electron-Vite application with Typescript'
      }
    ])
  
    const homepageAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'homepage',
        message: 'Homepage:'
      }
    ])
  
    const licenseAnswer = await inquirer.prompt([
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
    ])
  
    const dependenciesAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'dependencies',
        message: 'Dependencies',
        choices: [
          { name: 'Sass', value: 'sass' },
          { name: 'Bootstrap Icons', value: 'bootstrap-icons'},
          { name: 'FlatIcon Uicons', value: '@flaticon/flaticon-uicons'}
        ],
        default: ['sass']
      }
    ])
  
    return {
      projectName: projectNameAnswer.projectName,
      dependencies: dependenciesAnswer.dependencies,
      author: authorNameAnswer.author,
      description: descriptionAnswer.description,
      homepage: homepageAnswer.homepage,
      license: licenseAnswer.license,
      version: versionAnswer.version
    } as Answer
  } catch (e) {
    return undefined
  }
}

function createReadme(packageJson: PackageJson): string {
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
  `.trim()
}

async function initialize(): Promise<void> {
  const answers: Answer | undefined = await inquery()

  if (answers === undefined) {
    console.log()
    console.log(' 💀 Aborted!')
    console.log()
    return
  }

  const dirName = answers.projectName.toLowerCase().replace(/\s+/g, '-')
  const projectPath = path.resolve(process.cwd(), dirName)
  const templatePath = path.resolve(__dirname, 'template')

  if (fs.existsSync(projectPath) && !fs.statSync(projectPath).isDirectory()) {
    fs.rmSync(projectPath)
  }

  fs.mkdirSync(projectPath, { recursive: true })
  fs.cpSync(templatePath, projectPath, {recursive: true})

  const packageJsonPath = path.join(projectPath, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageJson

    packageJson.name = answers.projectName
    packageJson.version = answers.version
    packageJson.description = answers.description
    packageJson.author = answers.author
    packageJson.homepage = answers.homepage
    packageJson.license = answers.license
    
    if (answers.dependencies.includes('sass')) {
      packageJson.devDependencies['sass'] = '^1.83.1'
      packageJson.devDependencies['concurrently'] = '^9.1.2'
      packageJson.scripts['sass'] = 'sass src/renderer/assets/sass:src/renderer/assets/css --style compressed'
      packageJson.scripts['sass:watch'] = 'sass -w src/renderer/assets/sass:src/renderer/assets/css --style compressed'
      packageJson.scripts['dev'] = 'concurrently --kill-others-on-fail "npm run sass:watch" "electron-vite dev"'
    }
    
    if (answers.dependencies.includes('bootstrap-icons')) {
      packageJson.dependencies['bootstrap-icons'] = '^1.11.3'
    }
    if (answers.dependencies.includes('@flaticon/flaticon-uicons')) {
      packageJson.dependencies['@flaticon/flaticon-uicons'] = '^3.3.1'
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    // Create Readme.md
    const readme = createReadme(packageJson)
    const readmePath = path.join(projectPath, 'README.md')
    if (fs.existsSync(readmePath)) {
      fs.rmSync(readmePath)
    }
    fs.writeFileSync(readmePath, readme)
  } else {
    console.error('package.json file is not exists')
  }

  console.log()
  console.log('🎉 Created your project, now start with:')
  console.log()
  console.log(` cd ${dirName}`)
  console.log(' npm install')
  console.log(' npm run dev')
  console.log()
}

initialize().catch(console.error)