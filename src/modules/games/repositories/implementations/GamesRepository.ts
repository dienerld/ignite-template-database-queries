import { title } from 'process';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games').select('title')
      .where('title ILIKE :title', { title: `%${param}%` })
      .getRawMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `SELECT COUNT(*) FROM games`,
    );
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder('games')
      .where('games.id = :id', { id })
      .leftJoinAndSelect('games.users','users')
      .getOne();

      if(!game) {
        throw new Error('Game not found');
      }
    return game.users;
  }
}
