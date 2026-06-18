import { User } from "@/store/useAuthStore";

export const buildPayload = (
  form: Record<string, any>,
  user: Partial<User> = {},
) => {
  const { updatedAt, ...restUser } = user;
  const payload: Record<string, any> = { ...restUser };
  const configuration: Record<string, any> = { ...restUser.configuration };

  if (form.name) {
    payload.name = form.name;
  }

  if (form.eodMailRecipient) {
    configuration.eodMailRecipient = form.eodMailRecipient;
  }

  if (form.jobFailureTriggerRecipient) {
    configuration.jobFailureTriggerRecipient = form.jobFailureTriggerRecipient;
  }

  configuration.cronOption = form.cronOption ?? "EOD";

  if (Object.keys(configuration).length) {
    payload.configuration = configuration;
  }
  return payload;
};

export const buildSheetPayload = (
  form: Record<string, any>,
  user: Partial<User> = {},
) => {
  const {
    id,
    sheetTabName,
    taskNameIndex,
    durationIndex,
    statusIndex,
    dateIndex,
    projectIndex,
  } = form;
  const { updatedAt, ...restUser } = user;
  const payload: Record<string, any> = { ...restUser };

  const configuration: Record<string, any> = { ...restUser.configuration };

  return {
    ...payload,
    configuration: {
      ...configuration,
      sheet: {
        ...configuration?.sheet,
        id: id || null,
        sheetTabName: sheetTabName || null,
        taskNameIndex: !Number.isNaN(taskNameIndex)
          ? Number(taskNameIndex)
          : null,
        durationIndex: !Number.isNaN(durationIndex)
          ? Number(durationIndex)
          : null,
        statusIndex: !Number.isNaN(statusIndex) ? Number(statusIndex) : null,
        dateIndex: !Number.isNaN(dateIndex) ? Number(dateIndex) : null,
        projectIndex: !Number.isNaN(projectIndex) ? Number(projectIndex) : null,
      },
    },
  };
};
