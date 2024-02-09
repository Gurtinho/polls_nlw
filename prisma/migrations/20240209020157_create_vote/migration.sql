-- CreateTable
CREATE TABLE "vote" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "pollOptionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vote_sessionId_pollId_key" ON "vote"("sessionId", "pollId");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "polloption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
