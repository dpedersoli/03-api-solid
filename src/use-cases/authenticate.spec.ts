import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'


describe('Authenticate Use Case', () => {
  it('should be able to authenticate.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository) 

    await usersRepository.create({
      name: 'John Doe',
      email: 'danieldiferente@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'danieldiferente@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String)) 
  })

  it('should be able to authenticate with wrong e-mail.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository) 

    await expect(() => sut.execute({
      email: 'danieldiferente@gmail.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError) 
  })

  it('should be able to authenticate with wrong password.', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'danieldiferente@gmail.com',
      password_hash: await hash('123456', 6),
    }) 

    await expect(() => sut.execute({
      email: 'danieldiferente@gmail.com',
      password: '123123',
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
