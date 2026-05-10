/*
  Warnings:

  - A unique constraint covering the columns `[tokenHash]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `Appointment_clinicId_patientId_startAt_idx` ON `Appointment`(`clinicId`, `patientId`, `startAt`);

-- CreateIndex
CREATE INDEX `AppointmentStatusHistory_appointmentId_createdAt_idx` ON `AppointmentStatusHistory`(`appointmentId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Clinic_slug_idx` ON `Clinic`(`slug`);

-- CreateIndex
CREATE INDEX `Conversation_clinicId_channel_createdAt_idx` ON `Conversation`(`clinicId`, `channel`, `createdAt`);

-- CreateIndex
CREATE INDEX `Conversation_leadId_createdAt_idx` ON `Conversation`(`leadId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Lead_clinicId_createdAt_idx` ON `Lead`(`clinicId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Lead_clinicId_email_idx` ON `Lead`(`clinicId`, `email`);

-- CreateIndex
CREATE INDEX `Lead_clinicId_phone_idx` ON `Lead`(`clinicId`, `phone`);

-- CreateIndex
CREATE INDEX `LeadActivity_leadId_createdAt_idx` ON `LeadActivity`(`leadId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Patient_clinicId_createdAt_idx` ON `Patient`(`clinicId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Patient_clinicId_email_idx` ON `Patient`(`clinicId`, `email`);

-- CreateIndex
CREATE INDEX `Patient_clinicId_phone_idx` ON `Patient`(`clinicId`, `phone`);

-- CreateIndex
CREATE INDEX `Reminder_clinicId_status_scheduledFor_idx` ON `Reminder`(`clinicId`, `status`, `scheduledFor`);

-- CreateIndex
CREATE INDEX `Reminder_appointmentId_createdAt_idx` ON `Reminder`(`appointmentId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Review_clinicId_status_collectedAt_idx` ON `Review`(`clinicId`, `status`, `collectedAt`);

-- CreateIndex
CREATE INDEX `Review_appointmentId_collectedAt_idx` ON `Review`(`appointmentId`, `collectedAt`);

-- CreateIndex
CREATE INDEX `ReviewRequest_clinicId_status_createdAt_idx` ON `ReviewRequest`(`clinicId`, `status`, `createdAt`);

-- CreateIndex
CREATE INDEX `ReviewRequest_appointmentId_createdAt_idx` ON `ReviewRequest`(`appointmentId`, `createdAt`);

-- CreateIndex
CREATE INDEX `UserSession_userId_expiresAt_idx` ON `UserSession`(`userId`, `expiresAt`);

-- CreateIndex
CREATE UNIQUE INDEX `UserSession_tokenHash_key` ON `UserSession`(`tokenHash`);
