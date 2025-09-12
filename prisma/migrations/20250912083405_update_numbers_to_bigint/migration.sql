-- RedefineTables
PRAGMA foreign_keys=OFF;

-- RedefineTable Student
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "Snumber" BIGINT NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "password" TEXT NOT NULL
);

INSERT INTO "new_Student" ("id", "email", "Snumber", "Fname", "Lname", "major", "year", "password") SELECT "id", "email", "Snumber", "Fname", "Lname", "major", "year", "password" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX "Student_Snumber_key" ON "Student"("Snumber");

-- RedefineTable Professor  
CREATE TABLE "new_Professor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "Pnumber" BIGINT NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

INSERT INTO "new_Professor" ("id", "email", "Pnumber", "Fname", "Lname", "password") SELECT "id", "email", "Pnumber", "Fname", "Lname", "password" FROM "Professor";
DROP TABLE "Professor";
ALTER TABLE "new_Professor" RENAME TO "Professor";
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");
CREATE UNIQUE INDEX "Professor_Pnumber_key" ON "Professor"("Pnumber");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;