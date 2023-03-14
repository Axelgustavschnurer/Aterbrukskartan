BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[map_item] ADD [is_active] BIT NOT NULL CONSTRAINT [map_item_is_active_df] DEFAULT 1;

-- AlterTable
ALTER TABLE [dbo].[recycle] ADD [is_active] BIT NOT NULL CONSTRAINT [recycle_is_active_df] DEFAULT 1;

-- AlterTable
ALTER TABLE [dbo].[story] ADD [is_active] BIT NOT NULL CONSTRAINT [story_is_active_df] DEFAULT 1,
[report_title] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
