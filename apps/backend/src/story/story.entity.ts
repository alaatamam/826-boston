import { Entity, Column, IntegerType, ManyToOne, JoinColumn } from 'typeorm';
import { Anthology } from '../anthology/anthology.entity';

@Entity()
export class Story {
  @Column({ primary: true })
  id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  author: string;

  @Column()
  student_bio?: string;

  @Column()
  genre?: string;

  @Column()
  theme?: string;

  @ManyToOne(() => Anthology)
  @JoinColumn({ name: 'anthology_id' })
  anthology?: Anthology;
}
