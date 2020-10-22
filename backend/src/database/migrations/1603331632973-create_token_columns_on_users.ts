import { Column, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class createTokenColumnsOnUsers1603331632973
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.addColumns("users", [
      new TableColumn({
        name: "password_reset_token",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "password_reset_expires",
        type: "timestamp",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "password_reset_token");
    await queryRunner.dropColumn("users", "password_reset_expires");
    return;
  }
}
