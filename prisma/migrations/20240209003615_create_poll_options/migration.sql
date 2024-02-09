-- CreateTable
CREATE TABLE "polloption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "polloption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "polloption" ADD CONSTRAINT "polloption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
