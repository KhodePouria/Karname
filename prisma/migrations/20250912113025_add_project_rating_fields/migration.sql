-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "publisherId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "publishedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sendDate" DATETIME NOT NULL,
    "rating" REAL,
    "feedback" TEXT,
    "isGraded" BOOLEAN NOT NULL DEFAULT false,
    "gradedAt" DATETIME,
    CONSTRAINT "Project_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Professor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("description", "id", "projectAddress", "publishedDate", "publisherId", "sendDate", "senderId", "title") SELECT "description", "id", "projectAddress", "publishedDate", "publisherId", "sendDate", "senderId", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
