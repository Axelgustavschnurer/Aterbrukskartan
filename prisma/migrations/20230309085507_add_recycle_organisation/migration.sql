BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[recycle] ADD [month] INT;

-- AlterTable
ALTER TABLE [dbo].[story] ADD [is_energy_story] BIT NOT NULL CONSTRAINT [story_is_energy_story_df] DEFAULT 1;

-- CreateTable
CREATE TABLE [dbo].[recycle_organisation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [recycle_organisation_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
