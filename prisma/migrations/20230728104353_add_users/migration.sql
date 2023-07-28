/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `recycle_organisation` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[recycle] ADD [is_public] BIT NOT NULL CONSTRAINT [recycle_is_public_df] DEFAULT 0;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [is_admin] BIT NOT NULL CONSTRAINT [user_is_admin_df] DEFAULT 0,
    [is_storyteller] BIT NOT NULL CONSTRAINT [user_is_storyteller_df] DEFAULT 0,
    [is_recycler] BIT NOT NULL CONSTRAINT [user_is_recycler_df] DEFAULT 0,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[_RecycleOrganisationToUser] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_RecycleOrganisationToUser_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_RecycleOrganisationToUser_B_index] ON [dbo].[_RecycleOrganisationToUser]([B]);

-- CreateIndex
ALTER TABLE [dbo].[recycle_organisation] ADD CONSTRAINT [recycle_organisation_name_key] UNIQUE NONCLUSTERED ([name]);

-- AddForeignKey
ALTER TABLE [dbo].[_RecycleOrganisationToUser] ADD CONSTRAINT [_RecycleOrganisationToUser_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[recycle_organisation]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_RecycleOrganisationToUser] ADD CONSTRAINT [_RecycleOrganisationToUser_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
