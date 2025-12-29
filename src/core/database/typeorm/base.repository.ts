import {
  Repository,
  EntityManager,
  FindOptionsWhere,
  DeepPartial,
  ObjectLiteral,
  FindManyOptions,
  FindOneOptions,
  SelectQueryBuilder,
} from 'typeorm';

/**
 * Abstract Base Repository
 * Provides common CRUD operations for all domain repositories
 * Does not depend on any specific domain entity
 *
 * Usage:
 * ```typescript
 * @Injectable()
 * export class UserRepository extends BaseRepository<User> {
 *   constructor(
 *     @InjectRepository(User)
 *     repository: Repository<User>,
 *   ) {
 *     super(repository);
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  // ============================================
  // Basic CRUD Operations
  // ============================================

  /**
   * Find entity by ID
   */
  async findById(id: string | number): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Find entity by ID or throw
   */
  async findByIdOrFail(id: string | number): Promise<T> {
    return this.repository.findOneOrFail({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  /**
   * Find one entity by conditions
   */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  /**
   * Find one entity by where conditions
   */
  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(where);
  }

  /**
   * Find multiple entities
   */
  async findMany(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  /**
   * Find multiple entities by conditions
   */
  async findManyBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(where);
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  /**
   * Save entity (insert or update)
   */
  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  /**
   * Save multiple entities
   */
  async saveMany(entities: DeepPartial<T>[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  /**
   * Create entity instance (does not persist)
   */
  create(entityLike: DeepPartial<T>): T {
    return this.repository.create(entityLike);
  }

  /**
   * Update entity by ID
   */
  async update(
    id: string | number,
    partialEntity: DeepPartial<T>,
  ): Promise<T | null> {
    await this.repository.update(id, partialEntity as never);
    return this.findById(id);
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string | number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Soft delete entity by ID (if entity supports soft delete)
   */
  async softDelete(id: string | number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Restore soft-deleted entity
   */
  async restore(id: string | number): Promise<boolean> {
    const result = await this.repository.restore(id);
    return (result.affected ?? 0) > 0;
  }

  // ============================================
  // Count & Existence
  // ============================================

  /**
   * Count entities
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  /**
   * Count entities by conditions
   */
  async countBy(where: FindOptionsWhere<T>): Promise<number> {
    return this.repository.countBy(where);
  }

  /**
   * Check if entity exists
   */
  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.countBy(where);
    return count > 0;
  }

  /**
   * Check if entity exists by ID
   */
  async existsById(id: string | number): Promise<boolean> {
    return this.exists({ id } as unknown as FindOptionsWhere<T>);
  }

  // ============================================
  // Query Builder
  // ============================================

  /**
   * Create query builder
   */
  createQueryBuilder(alias?: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  // ============================================
  // Transaction Support
  // ============================================

  /**
   * Get repository for transaction
   * Use this when you need to perform operations within a transaction
   */
  withTransaction(manager: EntityManager): Repository<T> {
    return manager.getRepository(this.repository.target);
  }

  // ============================================
  // Pagination
  // ============================================

  /**
   * Find with pagination
   */
  async findWithPagination(
    options: FindManyOptions<T>,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============================================
  // Bulk Operations
  // ============================================

  /**
   * Bulk insert entities
   */
  async bulkInsert(entities: DeepPartial<T>[]): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .values(entities as never)
      .execute();
  }

  /**
   * Bulk delete by conditions
   */
  async bulkDelete(where: FindOptionsWhere<T>): Promise<number> {
    const result = await this.repository.delete(where);
    return result.affected ?? 0;
  }
}
