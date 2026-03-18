import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  phone: string

  @Column({ unique: true, nullable: true })
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  signature: string

  @Column({ default: false })
  emailVerified: boolean

  @Column({ nullable: true })
  verificationCode: string

  @Column({ nullable: true })
  codeExpiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
