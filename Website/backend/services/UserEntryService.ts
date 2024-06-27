import UserEntry, { IUserEntry } from "../models/UserEntry";

const getUserEntryById = async (id: string): Promise<IUserEntry | null> => {
  return UserEntry.findById(id);
};

const getByEmail = async (email: string): Promise<IUserEntry | null> => {
  return UserEntry.findOne({ email })
};

export { getUserEntryById, getByEmail };
