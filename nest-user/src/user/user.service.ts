import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ObjectId } from 'mongodb';
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Generate a valid MongoDB ObjectId for userId
    const userId = new ObjectId();

    // Create the user using Prisma
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        userId: userId.toHexString(), // Convert the ObjectId to a string
      },
    });
  }

  async findAll() {
    // Use Prisma's query builder to retrieve all users
    const users = await this.prismaService.user.findMany();

    // Return the list of users
    return users;
  }

  async findOne(id: string) {
    // Use Prisma's query builder to find a user by id
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Return the found user
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Attempt to find the user by ID
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Generate a new MongoDB ObjectId for userId
    const userId = new ObjectId();

    // Update the user's information, including the generated userId
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          userId: userId.toHexString(), // Convert the ObjectId to a string
        },
      });

      return updatedUser;
    } catch (error) {
      // Handle any Prisma-specific errors or other errors
      throw new Error(`Failed to update user with id ${id}: ${error.message}`);
    }
  }
  async remove(id: string) {
    // Use Prisma's query builder to find and delete the user by id
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Use Prisma's query builder to delete the user by id
    await this.prismaService.user.delete({
      where: { id },
    });

    return `User with id ${id} has been successfully removed`;
  }
}
