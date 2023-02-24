BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[recycle] (
    [id] INT NOT NULL IDENTITY(1,1),
    [map_id] INT NOT NULL,
    [project_type] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(4000),
    [contact] NVARCHAR(4000),
    [external_links] NVARCHAR(4000),
    [available_materials] NVARCHAR(1000),
    [looking_for_materials] NVARCHAR(1000),
    CONSTRAINT [recycle_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [recycle_map_id_key] UNIQUE NONCLUSTERED ([map_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[recycle] ADD CONSTRAINT [recycle_map_id_fkey] FOREIGN KEY ([map_id]) REFERENCES [dbo].[map_item]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
