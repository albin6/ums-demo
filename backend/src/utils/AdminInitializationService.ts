import { AdminRepository } from "../repositories/implementations/AdminRepository";
import { hashPassword } from "../utils/auth/password";

export class AdminInitializationService {
  private adminRepository: AdminRepository;

  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async initializeAdmin() {
    try {
      const existingAdmin = await this.adminRepository.findByEmail(
        "admin@example.com"
      );

      if (!existingAdmin) {
        const hashedPassword = await hashPassword("admin123");
        await this.adminRepository.create({
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
        });

        console.log("Default admin user created:");
        console.log("Email: admin@example.com");
        console.log("Password: admin123");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error initializing admin:", error);
    }
  }
}
