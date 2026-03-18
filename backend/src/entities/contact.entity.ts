import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  company: string

  @Column({ nullable: true })
  position: string

  @Column('simple-array', { nullable: true })
  tags: string[]

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  notes: string

  @Column({ default: 'personal' })
  type: 'personal' | 'work' | 'family' | 'other'

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
