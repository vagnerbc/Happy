import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class createApprovedColumnOnOrphanage1604449925422
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.addColumn(
      "orphanages",
      new TableColumn({
        name: "approved",
        type: "boolean",
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropColumn("orphanages", "approved");
  }
}
