/*
  This renames the column `date` to `general_availability` and adds the following columns to the `releases` table:
  - `end_of_development`
  - `end_of_life`
  - `end_of_sales`
  - `end_of_service`
  - `end_of_support`
*/

-- AlterTable
ALTER TABLE "releases" RENAME COLUMN "date" TO "general_availability";
ALTER TABLE "releases" ADD COLUMN     "end_of_development" TIMESTAMP(3),
ADD COLUMN     "end_of_life" TIMESTAMP(3),
ADD COLUMN     "end_of_sales" TIMESTAMP(3),
ADD COLUMN     "end_of_service" TIMESTAMP(3),
ADD COLUMN     "end_of_support" TIMESTAMP(3);
