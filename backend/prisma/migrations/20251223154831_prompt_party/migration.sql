-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "hostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minCutoffAt" TIMESTAMP(3),
    "maxEndAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "cutReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVote" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutVote" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CutVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_joinCode_key" ON "Room"("joinCode");

-- CreateIndex
CREATE INDEX "Room_joinCode_idx" ON "Room"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Player_sessionToken_key" ON "Player"("sessionToken");

-- CreateIndex
CREATE INDEX "Player_roomId_idx" ON "Player"("roomId");

-- CreateIndex
CREATE INDEX "Player_sessionToken_idx" ON "Player"("sessionToken");

-- CreateIndex
CREATE INDEX "Round_roomId_idx" ON "Round"("roomId");

-- CreateIndex
CREATE INDEX "Round_actorId_idx" ON "Round"("actorId");

-- CreateIndex
CREATE INDEX "Prompt_roundId_idx" ON "Prompt"("roundId");

-- CreateIndex
CREATE INDEX "Prompt_playerId_idx" ON "Prompt"("playerId");

-- CreateIndex
CREATE INDEX "PromptVote_roundId_idx" ON "PromptVote"("roundId");

-- CreateIndex
CREATE INDEX "PromptVote_promptId_idx" ON "PromptVote"("promptId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVote_roundId_playerId_key" ON "PromptVote"("roundId", "playerId");

-- CreateIndex
CREATE INDEX "CutVote_roundId_idx" ON "CutVote"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "CutVote_roundId_playerId_key" ON "CutVote"("roundId", "playerId");

-- CreateIndex
CREATE INDEX "Rating_roundId_idx" ON "Rating"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_roundId_playerId_key" ON "Rating"("roundId", "playerId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVote" ADD CONSTRAINT "PromptVote_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVote" ADD CONSTRAINT "PromptVote_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVote" ADD CONSTRAINT "PromptVote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutVote" ADD CONSTRAINT "CutVote_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutVote" ADD CONSTRAINT "CutVote_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
