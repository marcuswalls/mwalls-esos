export type SubTaskListMap<T> = {
  title: string;
} & Partial<{
  [K in keyof T]: {
    title: string;
  };
}>;
