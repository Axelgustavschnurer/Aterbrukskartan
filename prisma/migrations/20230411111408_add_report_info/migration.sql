/*
  Warnings:

  - You are about to drop the column `reports` on the `story` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[story] DROP COLUMN [reports];
ALTER TABLE [dbo].[story] ADD [report_author] NVARCHAR(1000),
[report_contact] NVARCHAR(1000),
[report_link] NVARCHAR(4000),
[report_site] NVARCHAR(4000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
