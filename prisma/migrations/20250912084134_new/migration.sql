/*
  Warnings:

  - You are about to alter the column `Pnumber` on the `Professor` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `Snumber` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Professor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "Pnumber" INTEGER NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Professor" ("Fname", "Lname", "Pnumber", "email", "id", "password") SELECT "Fname", "Lname", "Pnumber", "email", "id", "password" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
CREATE UNIQUE INDEX "Professor_Pnumber_key" ON "Professor"("Pnumber");
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "Snumber" INTEGER NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Student" ("Fname", "Lname", "Snumber", "email", "id", "major", "password", "year") SELECT "Fname", "Lname", "Snumber", "email", "id", "major", "password", "year" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_Snumber_key" ON "Student"("Snumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
