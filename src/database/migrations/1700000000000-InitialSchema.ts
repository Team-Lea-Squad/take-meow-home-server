import { MigrationInterface, QueryRunner } from "typeorm";

// Schema 생성 : npm run migration:run
export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users 테이블
        await queryRunner.query(`
          CREATE TABLE \`user\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`user_type\` INT NOT NULL,
              \`profile_img\` TEXT,
              \`name\` VARCHAR(100) NOT NULL,
              \`email\` VARCHAR(100) NOT NULL,
              \`oauth_provider\` INT,
              \`oauth_id\` VARCHAR(100),
              \`point\` INT NOT NULL DEFAULT 0,
              \`created_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              \`updated_at\` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
              \`deleted_at\` TIMESTAMP(6) NULL,
              UNIQUE INDEX \`IDX_user_email\` (\`email\`)
          ) ENGINE=InnoDB
      `);
      

        // Shelters 테이블
        await queryRunner.query(`
          CREATE TABLE \`shelter\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`s_name\` VARCHAR(255) NOT NULL,
              \`s_reg_num\` VARCHAR(255) NOT NULL,
              \`representative_name\` VARCHAR(255) NOT NULL,
              \`contact_phone\` VARCHAR(255) NOT NULL,
              \`shelter_type\` VARCHAR(255) NOT NULL,
              \`is_registered\` TINYINT(1) NOT NULL DEFAULT 0,
              \`description\` TEXT NULL,
              \`photo_url\` TEXT NULL,
              \`opening_hours\` VARCHAR(255) NULL,
              \`address\` VARCHAR(255) NOT NULL,
              \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
              UNIQUE INDEX \`IDX_shelter_reg_num\` (\`s_reg_num\`)
          ) ENGINE=InnoDB
      `);
      
      

        // Cats 테이블
        await queryRunner.query(`
          CREATE TABLE \`cat\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`shelter_id\` CHAR(36) NOT NULL,
              \`name\` VARCHAR(255) NOT NULL,
              \`gender\` INT NOT NULL,
              \`is_neutered\` TINYINT(1) NOT NULL DEFAULT 0,
              \`age\` INT NOT NULL,
              \`weight\` INT NOT NULL,
              \`breed\` INT NOT NULL,
              \`region\` INT NOT NULL,
              \`is_vaccinated\` TINYINT(1) NOT NULL DEFAULT 0,
              \`protection_start_date\` TIMESTAMP(6) NULL,
              \`notice_start_date\` TIMESTAMP(6) NULL,
              \`notice_end_date\` TIMESTAMP(6) NULL,
              \`status\` INT NOT NULL DEFAULT 0,
              \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
              CONSTRAINT \`FK_cat_shelter\` FOREIGN KEY (\`shelter_id\`) REFERENCES \`shelter\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
          ) ENGINE=InnoDB
      `);
      
        // shelter_user 테이블
        await queryRunner.query(`
          CREATE TABLE \`shelter_user\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`uid\` CHAR(36) NOT NULL,
              \`sid\` CHAR(36) NOT NULL,
              \`role\` INT NOT NULL,
              \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              \`deleted_at\` DATETIME(6),
              \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
              CONSTRAINT \`FK_shelter_user_user\` FOREIGN KEY (\`uid\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE,
              CONSTRAINT \`FK_shelter_user_shelter\` FOREIGN KEY (\`sid\`) REFERENCES \`shelter\`(\`id\`) ON DELETE CASCADE
          ) ENGINE=InnoDB
      `);

        // cat_img 테이블
        await queryRunner.query(`
          CREATE TABLE \`cat_img\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`cid\` CHAR(36) NOT NULL,
              \`img_url\` TEXT NOT NULL,
              \`is_thumbnail\` TINYINT(1) NOT NULL DEFAULT 0,
              \`sort_order\` INT NOT NULL DEFAULT 0,
              CONSTRAINT \`FK_cat_img_cat\` FOREIGN KEY (\`cid\`) REFERENCES \`cat\`(\`id\`) ON DELETE CASCADE
          ) ENGINE=InnoDB
      `);

        // shelter_invi 테이블
        await queryRunner.query(`
          CREATE TABLE \`shelter_invi\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`sid\` CHAR(36) NOT NULL,
              \`invitee\` CHAR(36) NOT NULL,
              \`invi_code\` VARCHAR(255) NOT NULL,
              \`status\` INT NOT NULL DEFAULT 0, -- 0: pending, 1: accepted, 2: declined, 3: expired
              \`expires_at\` DATETIME(6) NULL,
              \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              CONSTRAINT \`FK_invi_shelter\` FOREIGN KEY (\`sid\`) REFERENCES \`shelter\`(\`id\`) ON DELETE CASCADE,
              CONSTRAINT \`FK_invi_invitee\` FOREIGN KEY (\`invitee\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
          ) ENGINE=InnoDB
      `);
    
        // adoption 테이블
        await queryRunner.query(`
          CREATE TABLE \`adoption\` (
              \`id\` CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
              \`cid\` CHAR(36) NOT NULL,
              \`uid\` CHAR(36) NOT NULL,
              \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
              \`deleted_at\` DATETIME(6),
              CONSTRAINT \`FK_adoption_cat\` FOREIGN KEY (\`cid\`) REFERENCES \`cat\`(\`id\`) ON DELETE CASCADE,
              CONSTRAINT \`FK_adoption_user\` FOREIGN KEY (\`uid\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
          ) ENGINE=InnoDB
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 외래 키 제약조건이 있는 테이블부터 삭제
        await queryRunner.query(`DROP TABLE \`adoption\``);       // 참조 → cat, user
        await queryRunner.query(`DROP TABLE \`shelter_invi\``);   // 참조 → user, shelter
        await queryRunner.query(`DROP TABLE \`cat_img\``);        // 참조 → cat
        await queryRunner.query(`DROP TABLE \`shelter_user\``);   // 참조 → user, shelter
        await queryRunner.query(`DROP TABLE \`cat\``);            // 참조 → shelter
        await queryRunner.query(`DROP TABLE \`shelter\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }
} 