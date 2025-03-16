// import { Controller } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
// import { UserService } from './user.service';
// import { UserInfo } from '../dtos/user.dto';

// @Controller()
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @MessagePattern({ cmd: 'get_all_users' })
//   async getAllUsers() {
//     return this.userService.findAll();
//   }

//   @MessagePattern({ cmd: 'get_user_by_id' })
//   async getUserById(id: number) {
//     return this.userService.findById(id);
//   }

//   @MessagePattern({ cmd: 'create_user' })
//   async createUser(userInfo: UserInfo) {
//     return this.userService.create(userInfo);
//   }

//   @MessagePattern({ cmd: 'update_user' })
//   async updateUser(data: { id: number; user: UserInfo }) {
//     const { id, user } = data;
//     return this.userService.update(id, user);
//   }

//   @MessagePattern({ cmd: 'delete_user' })
//   async deleteUser(id: number) {
//     return this.userService.remove(id);
//   }

//   @MessagePattern({ cmd: 'get_user_with_paths' })
//   async getUserWithPaths(id: number) {
//     return this.userService.findWithPaths(id);
//   }
// }