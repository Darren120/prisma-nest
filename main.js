#!/usr/bin/env node
const fs = require('mz/fs');
const inquirer = require('inquirer');
const getObjectName = [
    {
      type: "input",
      name: "objectName",
      message: "\n Enter the name of the object/class you want to generate (case sensitive): "
    }
];
const templateChoices = ["Controller, Module, and Service", "Controller", "Service", "Module", ]
const getTemplateInput = [
  {
    type: "list",
    name: "templateName",
    message: `\n What template would you like to generate? `,
    choices: templateChoices
  }
];

var overWriteAll = false
async function main() {

  const getObjectNameResult = (await inquirer.prompt(getObjectName));
  const name = getObjectNameResult.objectName
  console.log(`${getObjectNameResult.objectName}`)
  const getTemplateInputResult = (await inquirer.prompt(getTemplateInput));
  const templateChoice = getTemplateInputResult.templateName;
  const firstLetterUpper = name.charAt(0).toUpperCase()
  const firstLetterLower = name.charAt(0).toLowerCase()
  const withoutFirstLetter = name.substr(1)
  const cammelUpper = firstLetterUpper + withoutFirstLetter
  const cammelLower = firstLetterLower + withoutFirstLetter
  const dir = process.cwd() + `/src/${name}`
  
  const overWrtieChoices = ["Abort", "Overwrite All"]
  const overWritePrompt = [
    {
      type: "list",
      name: "overWrite",
      message: `\n A file currently exist at  ${dir}, continuing will overwrite existing files \n Are you sure you want to overwrite?`,
      choices: overWrtieChoices
    }
  ];
  const finishPrompt = [
    {
      type: "message",
      name: "finishMsg",
      message: `==================================================================================================== \n Done! Please remeber to import your new ${cammelUpper}Module into your app.module.ts in the 'imports' array so \n nestJS can know about it! [Press return or enter to exit] \n ====================================================================================================`,
  
    }
  ];
  const abortPrompt = [
    {
      type: "message",
      name: "abortMsg",
      message: `\n ==================================================================================================== \n Aborted! That was a close one! Phew! [Press return or enter to exit] \n ====================================================================================================`,
  
    }
  ];
  if (fs.existsSync(dir) == false){
    fs.mkdirSync(dir, {recursive: true});
    
  } else {
    const getOverWritePremission = (await inquirer.prompt(overWritePrompt));
    if (getOverWritePremission.overWrite == overWrtieChoices[1]) {
      overWriteAll = true
    } else {
      await (await inquirer.prompt(abortPrompt));
      process.exit()
    }
  }

  if (templateChoice == templateChoices[0]) {

      await writeController(name, cammelUpper, cammelLower)
      await writeService(name, cammelUpper, cammelLower)
      await writeModule(name, cammelUpper, cammelLower)
      await writeServiceTest(name, cammelUpper, cammelLower)
      await writeControllerTest(name, cammelUpper, cammelLower)
      await (await inquirer.prompt(finishPrompt));
      process.exit()
  } else if (templateChoice == templateChoices[1]){
      await writeController(name, cammelUpper, cammelLower)
      await writeControllerTest(name, cammelUpper, cammelLower)
      await (await inquirer.prompt(finishPrompt));
      process.exit()
  } else if (templateChoice == templateChoices[2]){
      await writeServiceTest(name, cammelUpper, cammelLower)
      await writeService(name, cammelUpper, cammelLower)
      await (await inquirer.prompt(finishPrompt));
      process.exit()
  } else if (templateChoice == templateChoices[2]){
      await writeModule(name, cammelUpper, cammelLower)
      await (await inquirer.prompt(finishPrompt));
      process.exit()
  
  }

}
try {
  main();
} catch (error) {
  console.log(error)
}



async function writeController(name, cammelUpper, cammelLower) {
  
  const content = 
`import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ${cammelUpper}Service } from './${name}.service';
import { ${cammelUpper} as ${name}Model } from '@prisma/client';

@Controller('${cammelLower}')
export class ${cammelUpper}Controller {
  constructor(private readonly ${cammelLower}Service: ${name}Service) {}

  @Get('${name}/:id')
  async get${cammelUpper}ByID(@Param('id') id: string): Promise<${name}Model> {
    return this.${cammelLower}Service.${name}({ id: Number(id) });
  }

  @Post()
  async create${cammelUpper}(@Body() ${cammelLower}Data): Promise<${name}Model> {
    return this.${cammelLower}Service.create${cammelUpper}( ${cammelLower}Data);
  }

  @Delete('${name}/:id')
  async delete${cammelUpper}ByID(@Param('id') id: string): Promise<${name}Model> {
    rreturn this.${cammelLower}Service.delete({ id: Number(id) });
  }
}
`
  await fs.writeFile(process.cwd() + `/src/${name}/${cammelLower}.controller.ts`,content)
}
async function writeService(name, cammelUpper, cammelLower) {
  const content = 
`import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ${cammelUpper}, Prisma } from '@prisma/client';

@Injectable()
export class ${cammelUpper}Service {
  constructor(private prisma: PrismaService) {}

  async ${name}(${cammelLower}WhereUniqueInput: Prisma.${cammelUpper}WhereUniqueInput): Promise<${name} | null> {
    return this.prisma.${name}.findUnique({
      where: ${cammelLower}WhereUniqueInput,
    });
  }

  async ${name}s(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.${cammelUpper}WhereUniqueInput;
    where?: Prisma.${cammelUpper}WhereInput;
    orderBy?: Prisma.${name}OrderByInput;
  }): Promise<${name}[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.${name}.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create${cammelUpper}(data: Prisma.${name}CreateInput): Promise<${name}> {
    return this.prisma.${cammelLower}.create({
      data,
    });
  }

  async update${cammelUpper}(params: {
    where: Prisma.${cammelUpper}WhereUniqueInput;
    data: Prisma.${cammelUpper}UpdateInput;
  }): Promise<${name}> {
    const { where, data } = params;
    return this.prisma.${cammelLower}.update({
      data,
      where,
    });
  }

  async delete${cammelUpper}(where: Prisma.${cammelUpper}WhereUniqueInput): Promise<${name}> {
    return this.prisma.${cammelLower}.delete({
      where,
    });
  }
}
`
  await fs.writeFile(process.cwd() + `/src/${name}/${cammelLower}.service.ts`,content)
}
async function writeModule(name, cammelUpper, cammelLower) {
  const content = 
  `import { Module } from '@nestjs/common';
import { ${cammelUpper}Controller } from './${cammelLower}.controller';
import { ${cammelUpper}Service } from './${cammelLower}.service';

@Module({
  imports: [],
  controllers: [${cammelUpper}Controller],
  providers: [${cammelUpper}Service],
})
export class ${cammelUpper}Module {}
`

  await fs.writeFile(process.cwd() + `/src/${name}/${cammelLower}.module.ts`, content)
  
}
async function writeControllerTest(name, cammelUpper, cammelLower) {
  content = 
`import { Test, TestingModule } from '@nestjs/testing';
import { ${cammelUpper}Controller } from './${cammelLower}.controller';

describe('${cammelUpper}Controller', () => {
  let controller: ${cammelUpper}Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${cammelUpper}Controller],
    }).compile();

    controller = module.get<${cammelUpper}Controller>(${cammelUpper}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`
  await fs.writeFile(process.cwd() + `/src/${name}/${cammelLower}.controller.spec.ts`, content)

}
async function writeServiceTest(name, cammelUpper, cammelLower) {
  const content = 
`import { Test, TestingModule } from '@nestjs/testing';
import { ${cammelUpper}Service } from './${cammelLower}.service';

describe('${cammelUpper}Service', () => {
  let service: ${cammelUpper}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [${cammelUpper}Service],
    }).compile();

    service = module.get<${cammelUpper}Service>(${cammelUpper}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
`
  await fs.writeFile(process.cwd() + `/src/${name}/${cammelLower}.service.spec.ts`, content)
  
}
