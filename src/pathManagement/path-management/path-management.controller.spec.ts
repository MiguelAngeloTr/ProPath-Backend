import { Test, TestingModule } from '@nestjs/testing';
import { PathManagementController } from './path-management.controller';

describe('PathManagementController', () => {
  let controller: PathManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PathManagementController],
    }).compile();

    controller = module.get<PathManagementController>(PathManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
