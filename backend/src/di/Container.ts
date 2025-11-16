import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IAdminRepository } from '../repositories/interfaces/IAdminRepository';
import { IAdminService } from '../services/interfaces/IAdminService';
import { IUserService } from '../services/interfaces/IUserService';
import { UserRepository } from '../repositories/implementations/UserRepository';
import { AdminRepository } from '../repositories/implementations/AdminRepository';
import { UserService } from '../services/implementations/UserService';
import { AdminService } from '../services/implementations/AdminService';

// Simple DI Container
class DIContainer {
  private static instance: DIContainer;
  private services = new Map<string, any>();

  private constructor() {
    // Register repositories
    this.services.set('UserRepository', new UserRepository());
    this.services.set('AdminRepository', new AdminRepository());

    // Register services
    this.services.set('UserService', new UserService(this.getRepository('UserRepository')));
    this.services.set('AdminService', new AdminService(
      this.getRepository('AdminRepository'),
      this.getRepository('UserRepository')
    ));
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public getRepository<T>(name: string): T {
    return this.services.get(name);
  }

  public getService<T>(name: string): T {
    return this.services.get(name);
  }
}

export const container = DIContainer.getInstance();