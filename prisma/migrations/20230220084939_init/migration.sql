BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[map_item] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [organisation] NVARCHAR(1000),
    [year] INT,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [address] NVARCHAR(1000),
    [postcode] INT,
    [city] NVARCHAR(1000),
    CONSTRAINT [map_item_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[story] (
    [id] INT NOT NULL IDENTITY(1,1),
    [map_id] INT NOT NULL,
    [category_swedish] NVARCHAR(1000),
    [category_english] NVARCHAR(1000),
    [description_swedish] NVARCHAR(1000),
    [description_english] NVARCHAR(1000),
    [description_swedish_short] NVARCHAR(1000),
    [description_english_short] NVARCHAR(1000),
    [open_data] NVARCHAR(1000),
    [reports] NVARCHAR(1000),
    [videos] NVARCHAR(1000),
    [pdf_case] NVARCHAR(1000),
    CONSTRAINT [story_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [story_map_id_key] UNIQUE NONCLUSTERED ([map_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[story] ADD CONSTRAINT [story_map_id_fkey] FOREIGN KEY ([map_id]) REFERENCES [dbo].[map_item]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
