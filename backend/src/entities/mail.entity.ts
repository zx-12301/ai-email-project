import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

export type MailStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'draft'
export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'
export type MailLabel = 'work' | 'personal' | 'important' | 'promotion' | 'social'

@Entity('mails')
export class Mail {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: string

  @Column()
  folder: MailFolder

  @Column({ nullable: true })
  label: MailLabel

  @Column()
  from: string

  @Column()
  fromName: string

  @Column('simple-array')
  to: string[]

  @Column('simple-array', { nullable: true })
  cc: string[]

  @Column('simple-array', { nullable: true })
  bcc: string[]

  @Column()
  subject: string

  @Column('text')
  content: string

  @Column('text', { nullable: true })
  contentHtml: string

  @Column({ default: false })
  isRead: boolean

  @Column({ default: false })
  isStarred: boolean

  @Column({ default: false })
  isDeleted: boolean

  @Column({ nullable: true })
  deletedAt: Date

  @Column('simple-array', { nullable: true })
  attachments: string[]

  @Column({ nullable: true })
  inReplyTo: string

  @Column({ nullable: true })
  references: string

  @Column({ default: 'sent' })
  status: MailStatus

  @Column({ type: 'boolean', default: false })
  aiGenerated: boolean

  @Column({ type: 'boolean', default: false })
  isPhishing: boolean

  @Column({ nullable: true })
  phishingScore: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  sentAt: Date
}
